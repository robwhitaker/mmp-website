require 'bundler'
Bundler.require

require './config/environments'
require './models/chapter'
require './models/entry'

set :public_folder, 'public'

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/editor' do
  send_file File.join(settings.public_folder, 'editor.html')
end

get '/api/chapters' do
  content_type :json

  chaptersWithEntries = []

  chapters = Chapter.includes(:entries).all
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

  @entries = payload["entries"]
  payload.delete("entries")
	@chapter = Chapter.new(payload)
	if @chapter.save
    @chapter.entries.create(@entries)
		redirect '/chapters'
	else
		"Sorry, there was an error!"
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

  redirect '/chapters'
end

def withEntries(chapter)
  chapterWithEntries = chapter.attributes
  chapterWithEntries[:entries] = chapter.entries
  chapterWithEntries
end
