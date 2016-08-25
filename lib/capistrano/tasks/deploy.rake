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
        %w[ reader.min.js editor.min.js ].each do |f|
          upload! 'public/static/build/js/' + f ,
                  '/home/deploy/mmp/public/static/build/js/' + f
        end

        %w[ reader.html renderer.html ].each do |f|
          upload! 'public/' + f ,
                  '/home/deploy/mmp/public/' + f
        end

        %w[ reader.min.css renderer.min.css ].each do |f|
          upload! 'public/static/build/css/' + f ,
                  '/home/deploy/mmp/public/static/build/css/' + f
        end
      end
    end
  end

  desc "Update base repo folder"
  task :git_pull do
    on roles(:app) do
      if fetch(:stage) == 'production'
        execute "cd ~/mmp && git pull"
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
      end
    end
  end

  # before  :deploy,                 'deploy:check_revision'
  before  :deploy,                 'rvm1:install:gems'
  before  :deploy,                 'deploy:staging_assets'
  after   'deploy:staging_assets', 'deploy:git_pull'
  after   'deploy:git_pull',       'deploy:npm_install'
  after   'deploy:npm_install',    'deploy:build_assets'
end
