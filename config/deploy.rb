# config valid only for current version of Capistrano
lock '3.7.1'

set :application, 'mmp'
set :repo_url, 'git@github.com:robwhitaker/mmp-website.git'
set :bundle_without, [:development, :test]
