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

get '/api/chapters' do
  content_type :json

  json allChaptersWithEntries("restricted")
end

post '/api/chapters' do
  content_type :json

  payload = JSON.parse(request.body.read)

  if authorized? payload["secretKey"]
    json allChaptersWithEntries()
  else
    return "418"
  end
end

post '/api/chapters/crupdate' do
  content_type :json

  payload = JSON.parse(request.body.read)
  data = payload["data"]

  if authorized? payload["secretKey"]
    if data["id"] != "null" # Update chapter | chapter already exists
      id = data["id"] && data.delete("id")
      @entries = data["entries"] && data.delete("entries")
      @chapter = Chapter.update(id, data)
      if @chapter.save
        @entries.each do |entry|
          if entry["id"] != "null" # Update entry | entry already exists
            id = entry["id"] && entry.delete("id")
            updatedEntry = Entry.update(id, entry)
            updatedEntry.save
          else # Create entry
            entry.delete("id")
            @chapter.entries.create(entry)
          end
        end
      end
      return "200"
    else # Create chapter | note: entries cannot exist without a chapter
      id = data["id"] && data.delete("id")
      @entries = data["entries"] && data.delete("entries")
      @chapter = Chapter.new(data)
    	if @chapter.save
        @entriesWithoutIds = []
        @entries.each do |entry|
          entry.delete("id") && @entriesWithoutIds.push(entry)
        end
        @chapter.entries.create(@entriesWithoutIds)
    		return "200"
    	else # Invalid chapter JSON, presumably
    		return "418"
    	end
    end
  else # Did not pass authorized? check
    return "418"
  end
end

post '/api/chapters/delete' do
  content_type :json

  payload = JSON.parse(request.body.read)

  if authorized? payload["secretKey"]
    Chapter.destroy(payload["data"])
    return "200"
  else
    return "418"
  end
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
