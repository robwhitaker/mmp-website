require 'bundler'
Bundler.require

require 'rss'
require 'logger'
require 'time'
require 'yaml'
require './config/environments'
require './models/chapter'
require './models/entry'

set :server => :puma,
    :show_exceptions => :after_handler,
    :public_folder => 'public'
env = ''

if File.file?('config/secrets.yml')
  env = YAML.load_file('config/secrets.yml')["rack_env"]
else
  env = 'development'
end

databases = YAML.load(ERB.new(File.read('config/database.yml')).result)
ActiveRecord::Base.establish_connection(databases[env])

configure do
  enable :logging
  file = File.new('var/log/app.log', 'a+')
  file.sync = true
  use Rack::CommonLogger, file
end

error 400..510 do
  subject = "#{env} | Error Occurred"
  message = "#{env} | Error:\n#{env['sinatra.error'].message}"
  send_error_email(subject, message)
end

get '/' do
  send_file File.join(settings.public_folder, 'reader.html')
end

get '/read.html' do
  redirect '/'
end

get '/editor' do
  send_file File.join(settings.public_folder, 'editor.html')
end

get '/extras/halloween2015/play' do
  send_file File.join(settings.public_folder, '/extras/halloween2015/index.html')
end

get '/api/chapters/:id' do |id|
  content_type :json

  chapter = Chapter.includes(:entries).find(id)
  success_response
  json with_entries(chapter)
end

get '/api/chapters' do # public chapters
  content_type :json
  success_response
  json all_chapters_with_entries("restricted")
end

get '/rss' do # rss (public chapters)
  @releases = rss_feed
  success_response
  builder :rss
end

post '/webhook' do
  content_type :json

  payload = JSON.parse(request.body.read)
  log(payload)
end

post '/api/chapters' do # all chapters
  content_type :json

  payload = JSON.parse(request.body.read)

  if authorized? payload["secretKey"]
    success_response
    json all_chapters_with_entries
  else
    failure_response
  end
end

post '/api/chapters/crupdate' do
  content_type :json

  payload = JSON.parse(request.body.read)
  data = adjust_time_zones(payload["data"])
  log(payload)

  if authorized? payload["secretKey"]
    if data["id"].nil? # Create chapter
      chapter = Chapter.new(data)
      chapter.save
      success_response
    else # Update chapter
      entries_to_be_deleted = diff_entry_ids(data["id"], data["entries_attributes"])
      Entry.destroy(entries_to_be_deleted)

      chapter = Chapter.update(data["id"], data)
      chapter.save
      success_response
    end
  else
    failure_response
  end
end

post '/api/chapters/delete' do
  content_type :json

  payload = JSON.parse(request.body.read)
  log(payload)

  if authorized? payload["secretKey"]
    Chapter.destroy(payload["data"])
    success_response
  else
    failure_response
  end
end

private

def success_response
  status 200
  body '{ "data": 1 }'
end

def failure_response
  status 418
  body '{ "data": 0 }'
end

def log(payload)
  File.open("var/log/app.log", "a+") do |f|
    f.puts(payload)
  end
end

def authorized?(string)
  if File.file?('config/secrets.yml')
    secrets = YAML.load_file('config/secrets.yml')
    if secrets["rack_env"] == 'dev-auth' || secrets["rack_env"] == 'production'
      string == secrets["admin_secret"]
    else
      true
    end
  else
    true
  end
end

def adjust_time_zone(date_string)
  release_date = Time.parse(date_string)

  if release_date.dst?
    adjusted_release_date = release_date.strftime('%Y-%m-%d %H:%M:%S') + ' -0400'
  else
    adjusted_release_date = release_date.strftime('%Y-%m-%d %H:%M:%S') + ' -0500'
  end
end

def adjust_time_zones(data)
  adjusted_data = data
  adjusted_data["release_date"] = adjust_time_zone(data["release_date"])

  data["entries_attributes"].each_with_index do |entry, index|
    adjusted_data["entries_attributes"][index]["release_date"] = adjust_time_zone(entry["release_date"])
  end

  adjusted_data
end

def with_entries(chapter)
  chapter_with_entries = chapter.attributes
  chapter_with_entries[:entries] = chapter.entries
  chapter_with_entries
end

def all_chapters_with_entries(type = "unrestricted")
  chapters_with_entries = []

  if type == "restricted"
    chapters = Chapter.order(order: :asc).where('release_date <= ?', DateTime.now)
  else
    chapters = Chapter.order(order: :asc)
  end

  chapters.each do |chapter|
    chapters_with_entries.push(with_entries(chapter))
  end

  chapters_with_entries
end

def rss_content
  all_content = []

  Chapter.order(order: :asc).where('release_date <= ?', DateTime.now).each do |chapter|
    entries = chapter.entries
    chapter = chapter.as_json.deep_symbolize_keys
    chapter[:level] = 0

    all_content.push(chapter)
    entries.each {|entry| all_content.push(entry.as_json.deep_symbolize_keys)}
  end

  all_content
end

def rss_feed
  feed = []
  release_stack = []
  current_chapter_id = nil

  rss_content.each do |sub_release|
    if release_stack.empty? || sub_release[:level] > release_stack.last[:level]
      release_stack.push(sub_release)
    else
      if release_stack.first[:id] != current_chapter_id
        current_chapter_id = release_stack.first[:id]
        release_stack.last[:use_chapter_link] = true
      end

      feed.push(release_stack.clone)

      release_stack.reverse.each do |element|
        if sub_release[:level] <= element[:level]
          release_stack.pop
        end
      end

      release_stack.push(sub_release)
    end
  end

  feed.push(release_stack.clone)
  feed
end

def diff_entry_ids(chapter_id, entries)
  all_entry_ids = []
  all_entries = Chapter.find(chapter_id).entries
  all_entries.each do |entry|
    all_entry_ids.push(entry[:id])
  end

  given_entry_ids = []
  entries.each do |entry|
    given_entry_ids.push(entry["id"])
  end

  all_entry_ids - given_entry_ids
end

def send_error_email(subject, message)
  Pony.mail({
    :to => 'larouxn@gmail.com',
    :from => 'admin@midnightmurderparty.com',
    :subject => subject,
    :body => message,
    :via => :sendmail,
    :via_options => { :location  => '/usr/sbin/sendmail' }
  })
end
