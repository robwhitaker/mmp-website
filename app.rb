require 'bundler'
Bundler.require

require 'rss'
require 'logger'
require 'time'
require 'yaml'
require 'net/http'
require 'securerandom'
require './config/environments'
require './models/chapter'
require './models/entry'

enable :sessions
set :server => :puma
set :public_folder => 'public'
set :sessions, :expire_after => 3500
set :session_secret, YAML.load_file('config/secrets.yml')["session"] || SecureRandom.hex(64)

environment = YAML.load_file('config/secrets.yml')["rack_env"] || 'development'
databases = YAML.load(ERB.new(File.read('config/database.yml')).result)
ActiveRecord::Base.establish_connection(databases[environment])

Logger.class_eval { alias :write :'<<' }
app_log = File.join(File.dirname(File.expand_path(__FILE__)), 'var', 'log', 'app.log')
app_logger = Logger.new(app_log)
error_logger = File.new(File.join(File.dirname(File.expand_path(__FILE__)), 'var', 'log', 'error.log'), "a+")
error_logger.sync = true

configure { use Rack::CommonLogger, app_logger }
before { env["rack.errors"] = error_logger }

error 501..510 do
  if environment == 'production'
    subject = "Production Error Occurred"
    message = "#{Time.now}\nsinatra.error: #{env["sinatra.error"]}"

    send_error_email(subject, message)
  end
end

get '/' do
  if released_content.empty?
    send_file File.join(settings.public_folder, 'coming_soon.html')
  else
    send_file File.join(settings.public_folder, 'reader.html')
  end
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

get '/api/chapters' do # public chapters
  content_type :json
  success_response
  json all_chapters_with_entries('released')
end

get '/api/next' do # next release's release date
  content_type :json
  success_response
  json next_release_date
end

get '/rss' do # rss (public chapters)
  @releases = rss_feed
  success_response
  builder :rss
end

post '/api/chapters' do # all chapters
  content_type :json

  payload = JSON.parse(request.body.read)

  if authorized?
    success_response
    json all_chapters_with_entries('all')
  else
    failure_response
  end
end

post '/api/chapters/crupdate' do
  content_type :json

  payload = JSON.parse(request.body.read)
  data = payload["data"]
  log(payload)

  if authorized?
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

  if authorized?
    Chapter.destroy(payload["data"])
    success_response
  else
    failure_response
  end
end

post '/api/auth' do
  return success_response if authorized?

  valid_emails = ['robjameswhitaker@gmail.com', 'larouxn@gmail.com']
  valid_aud = '361874213844-33mf5b41pp4p0q38q26u8go81cod0h7f.apps.googleusercontent.com'
  valid_exp = Time.now.to_i

  token = request.body.read.gsub(/"/, '')

  uri = URI("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=#{token}")
  payload = JSON.parse(Net::HTTP.get(uri))
  payload_email = payload['email']
  payload_aud = payload['aud']
  payload_exp = payload['exp'].to_i

  if valid_emails.include?(payload_email) && payload_aud == valid_aud && payload_exp > valid_exp
    session[:authorized] = true
    success_response
  else
    failure_response
  end
end

private

def success_response
  status 200
  body '1'
end

def failure_response
  status 418
  body '0'
end

def log(payload)
  File.open("var/log/app.log", "a+") do |f|
    f.puts(payload)
  end
end

def authorized?
  session[:authorized]
end

def with_entries(chapter, type = 'all')
  chapter_with_entries = chapter.attributes

  entries = if type == 'released'
              chapter.entries.select { |entry| entry.releaseDate <= DateTime.now }
            else
              chapter.entries
            end

  chapter_with_entries[:entries] = entries
  chapter_with_entries
end

def all_chapters_with_entries(type = 'all')
  chapters_with_entries = []

  if type == 'released'
    chapters = Chapter.where('releaseDate <= ?', DateTime.now)
  else
    chapters = Chapter.all
  end

  chapters.each do |chapter|
    chapters_with_entries.push(with_entries(chapter, type))
  end

  chapters_with_entries
end

def next_release_date
  all_content = []

  Chapter.all.each do |chapter|
    entries = chapter.entries
    chapter = chapter.as_json.deep_symbolize_keys
    chapter[:level] = 0

    all_content.push(chapter)
    entries.each {|entry| all_content.push(entry.as_json.deep_symbolize_keys)}
  end

  next_release = all_content.find { |data| data[:releaseDate] > DateTime.now }
  next_release.class == Hash ? next_release[:releaseDate] : ''
end

def released_content
  released_content = []

  Chapter.where('releaseDate <= ?', DateTime.now).each do |chapter|
    entries = chapter.entries.select { |entry| entry.releaseDate <= DateTime.now }
    chapter = chapter.as_json.deep_symbolize_keys
    chapter[:level] = 0

    released_content.push(chapter)
    entries.each {|entry| released_content.push(entry.as_json.deep_symbolize_keys)}
  end

  released_content
end

def rss_feed
  return [] if released_content.empty?

  feed = []
  release_stack = []
  current_chapter_id = nil

  released_content.each do |sub_release|
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
