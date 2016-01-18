require 'rubygems'
require 'sinatra'
require 'sinatra/activerecord'
require './config/environments' #database configuration

set :public_folder, 'public'

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/editor' do
  send_file File.join(settings.public_folder, 'editor.html')
end
