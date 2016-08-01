require 'bundler'
Bundler.require

require 'sinatra'
require 'logger'
require 'time'
require './config/environments'
require './models/chapter'
require './models/entry'

set :server => :puma,
    :show_exceptions => :after_handler,
    :public_folder => 'public'
env = ENV["RACK_ENV"] || "development"
databases = YAML.load(ERB.new(File.read('config/database.yml')).result)
ActiveRecord::Base.establish_connection(databases[env])

configure do
  enable :logging
  file = File.new('var/log/app.log', 'a+')
  file.sync = true
  use Rack::CommonLogger, file
end

get '/' do
  send_file File.join(settings.public_folder, 'reader.html')
end

get '/editor' do
  send_file File.join(settings.public_folder, 'editor.html')
end

get '/api/chapters/:id' do |id|
  content_type :json

  chapter = Chapter.includes(:entries).find(id)
  success_response()
  json with_entries(chapter)
end

get '/api/chapters' do # public chapters
  content_type :json
  success_response()
  json all_chapters_with_entries("restricted")
end

post '/api/chapters' do # all chapters
  content_type :json

  payload = JSON.parse(request.body.read)
  log(payload)

  if authorized? payload["secretKey"]
    success_response()
    json all_chapters_with_entries()
  else
    failure_response()
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
      success_response()
    else # Update chapter
      entries_to_be_deleted = diff_entry_ids(data["id"], data["entries_attributes"])
      Entry.destroy(entries_to_be_deleted)

      chapter = Chapter.update(data["id"], data)
      chapter.save
      success_response()
    end
  else
    failure_response()
  end
end

post '/api/chapters/delete' do
  content_type :json

  payload = JSON.parse(request.body.read)
  log(payload)

  if authorized? payload["secretKey"]
    Chapter.destroy(payload["data"])
    success_response()
  else
    failure_response()
  end
end

def success_response()
  status 200
  body '{"data": 1}'
end

def failure_response()
  status 418
  body '{"data": 0}'
end

def log(payload)
  File.open("var/log/app.log", "a+") do |f|
    f.puts(payload)
  end
end

def authorized?(string)
  if ENV["RACK_ENV"] == ("production" || "dev-auth")
    string == ENV["ADMIN_SECRET"]
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
