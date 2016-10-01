# config valid only for current version of Capistrano
lock '3.6.1'

set :application, 'mmp'
set :repo_url, 'git@github.com:robwhitaker/MMPWebsiteV2.git'
set :bundle_without, [:development, :test]
