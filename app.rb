require 'bundler'
require 'sinatra'
configure { set :server, :puma }
Bundler.require

require './config/environments'
require './models/chapter'
require './models/entry'

env = ENV["SINATRA_ENV"] || "development"
databases = YAML.load(ERB.new(File.read("config/database.yml")).result)
ActiveRecord::Base.establish_connection(databases[env])

set :public_folder, 'public'

get '/' do
  send_file File.join(settings.public_folder, 'reader.html')
end

get '/editor' do
  send_file File.join(settings.public_folder, 'editor.html')
end

get '/api/chapters/:id' do |id|
  content_type :json

  chapter = Chapter.includes(:entries).find(id)
  json withEntries(chapter)
end

get '/api/chapters' do # public chapters
  content_type :json

  json allChaptersWithEntries("restricted")
end

post '/api/chapters' do # all chapters
  content_type :json

  payload = JSON.parse(request.body.read)

  if authorized? payload["secretKey"] then json allChaptersWithEntries() end
end

post '/api/chapters/crupdate' do
  content_type :json

  payload = JSON.parse(request.body.read)
  data = payload["data"]

  if authorized? payload["secretKey"]
    if data["id"].nil? # Create chapter
      @chapter = Chapter.new(data)
      @chapter.save
    else # Update chapter
      allEntryIds = []
      allEntries = Chapter.find(data["id"]).entries
      allEntries.each do |entry|
        allEntryIds.push(entry[:id])
      end

      givenEntryIds = []
      data["entries_attributes"].each do |entry|
        givenEntryIds.push(entry["id"])
      end

      entriesToBeDeleted = allEntryIds - givenEntryIds
      Entry.destroy(entriesToBeDeleted)

      @chapter = Chapter.update(data["id"], data)
      @chapter.save
    end
  end
  json '{"return": 0}'
end

post '/api/chapters/delete' do
  content_type :json

  payload = JSON.parse(request.body.read)

  if authorized? payload["secretKey"] then Chapter.destroy(payload["data"]) end
  json '{"return": 0}'
end

def authorized?(string)
  string != nil
end

def allChaptersWithEntries(type = "unrestricted")
  chaptersWithEntries = []

  if type == "restricted"
    chapters = Chapter.order(order: :asc).where('release_date <= ?', DateTime.now)
  else
    chapters = Chapter.order(order: :asc)
  end

  chapters.each do |chapter|
    chaptersWithEntries.push(withEntries(chapter))
  end

  chaptersWithEntries
end

def withEntries(chapter)
  chapterWithEntries = chapter.attributes
  chapterWithEntries[:entries] = chapter.entries
  chapterWithEntries
end
