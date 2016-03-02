require 'rubygems'
require 'bundler'

Bundler.require

# require 'logger'
# Logger.class_eval { alias :write :'<<' }
# logger = ::Logger.new(::File.new("log/app.log","a+")
#
# configure do
# 	use Rack::CommonLogger, logger
# end

require './app'
run Sinatra::Application
