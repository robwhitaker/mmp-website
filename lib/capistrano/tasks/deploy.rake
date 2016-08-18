namespace :deploy do
  desc "Makes sure local git is in sync with remote."
  task :check_revision do
    unless `git rev-parse HEAD` == `git rev-parse origin/#{fetch(:branch)}`
      puts "WARNING: HEAD is not the same as origin/#{fetch(:branch)}"
      puts "Run `git push` to sync changes."
      exit
    end
  end

  desc "Make sure npm packages are installed"
  task :npm_install do
    on roles(:app) do
      if fetch(:stage) == 'production'
        execute "cd ~/mmp && npm install"
      end
    end
  end

  desc "Compile reader and editor assets"
  task :build_assets do
    on roles(:app) do
      if fetch(:stage) == 'production'
        execute "cd ~/mmp && gulp build:reader"
        execute "cd ~/mmp && gulp build:editor-js"
      end
    end
  end

  # before :deploy, 'deploy:check_revision'
  before 'deploy',         'rvm1:install:gems'
  before 'deploy:updated', 'deploy:npm_install'
  before 'deploy:updated', 'deploy:build_assets'
end
