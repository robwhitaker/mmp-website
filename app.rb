require 'bundler'
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

get '/api/chapters' do
  content_type :json

  chaptersWithEntries = []

  chapters = Chapter.where('release_date <= ?', DateTime.now)

  chapters.each do |chapter|
    chaptersWithEntries.push(withEntries(chapter))
  end

  json chaptersWithEntries
end

get '/api/chapters/:id' do |id|
  content_type :json

  chapter = Chapter.includes(:entries).find(id)
  json withEntries(chapter)
end

post '/api/chapters' do
  content_type :json

  payload = JSON.parse(request.body.read)
  secret_key = payload["secretKey"]
  data = payload["data"]

  if secret_key != nil && data != nil
    @entries = data["entries"]
    data.delete("entries")
  	@chapter = Chapter.new(data)
  	if @chapter.save
      @chapter.entries.create(@entries)
  		json allChaptersWithEntries()
  	else
  		"Sorry, there was an error!\n"
  	end
  elsif secret_key != nil
    json allChaptersWithEntries()
  else
    "Go away. You bungled it.\n"
  end
end

post '/api/batch' do
  content_type :json

  payload = JSON.parse(request.body.read)

  @chapter_batch = payload["chapters"]
  @entry_batch = payload["entries"]

  @chapter_batch["delete"].each do |chapter|
    Chapter.destroy(chapter["id"])
  end

  @chapter_batch["update"].each do |chapter|
    id = chapter["id"] && chapter.delete("id")
    Chapter.update(id, chapter)
  end

  @entry_batch["delete"].each do |entry|
    Entry.destroy(entry["id"])
  end

  @entry_batch["update"].each do |entry|
    id = entry["id"] && entry.delete("id")
    Entry.update(id, entry)
  end

  @entry_batch["create"].each do |data|
    Entry.create(data)
  end

  json allChaptersWithEntries()
end

def allChaptersWithEntries()
  chaptersWithEntries = []
  chapters = Chapter.all

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
