namespace :deploy do
  desc "Makes sure local git is in sync with remote."
  task :check_revision do
    # need to make fetch(:branch) staging/production
    unless `git rev-parse HEAD` == `git rev-parse origin/capistrano_deploys`
      puts "WARNING: HEAD is not the same as origin/capistrano_deploys"
      puts "Run `git push` to sync changes."
      exit
    end
  end

  desc "Make sure Gulp is installed"
  task :install_gulp do
    on roles(:app) do
      within "~/mmp" do
        execute "npm install gulp"
      end
    end
  end

  desc "Compile reader and editor assets"
  task :build_assets do
    on roles(:app) do
      within "~/mmp" do
        execute "gulp build:reader"
        execute "gulp build:editor-js"
      end
    end
  end

  before :deploy, 'deploy:check_revision'
  # after :deploy,  'deploy:install_gulp'
  # after :deploy,  'deploy:build_assets'
end
