namespace :deploy do
  desc "Makes sure local git is in sync with remote."
  task :check_revision do
    unless `git rev-parse HEAD` == `git rev-parse origin/#{fetch(:branch)}`
      puts "WARNING: HEAD is not the same as origin/#{fetch(:branch)}"
      puts "Run `git push` to sync changes."
      exit
    end
  end

  desc "Upload pre-built staging assets"
  task :staging_assets do
    on roles(:app) do
      if fetch(:stage) == 'staging'
        %w[ editor.min.js reader.min.css reader.min.js ].each do |f|
          upload! 'public/static/build/' + f ,
                  '/home/deploy/mmp/public/static/build/' + f
        end
      end
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
  before 'deploy',                'rvm1:install:gems'
  before 'deploy:updated',        'deploy:staging_assets'
  before 'deploy:staging_assets', 'deploy:npm_install'
  before 'deploy:npm_install',    'deploy:build_assets'
end
