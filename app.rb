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

def withEntries(chapter)
  chapterWithEntries = chapter.attributes
  chapterWithEntries[:entries] = chapter.entries
  chapterWithEntries
end
