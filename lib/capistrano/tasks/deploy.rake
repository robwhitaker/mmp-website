namespace :deploy do
  desc "Upload pre-built staging assets"
  task :staging_assets do
    on roles(:app) do
      if fetch(:stage) == 'staging' || fetch(:stage) == 'staging-external'
        %w[ reader.min.js renderer.min.js editor.min.js countdown.min.js ].each do |f|
          upload! 'public/static/build/js/' + f ,
                  '/home/deploy/mmp/public/static/build/js/' + f
        end

        %w[ reader.html renderer.html editor.html coming_soon.html ].each do |f|
          upload! 'public/' + f ,
                  '/home/deploy/mmp/public/' + f
        end

        %w[ reader.min.css renderer.min.css editor.css countdown.min.css ].each do |f|
          upload! 'public/static/build/css/' + f ,
                  '/home/deploy/mmp/public/static/build/css/' + f
        end
      end
    end
  end

  desc "Update base repo folder"
  task :git_pull do
    on roles(:app) do
      execute "cd ~/mmp && git pull"
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
        execute "cd ~/mmp && gulp build:reader && gulp build:editor-js && gulp build:countdown"
      end
    end
  end

  before  :deploy,                 'rvm1:install:gems'
  before  :deploy,                 'deploy:staging_assets'
  after   'deploy:staging_assets', 'deploy:git_pull'
  after   'deploy:git_pull',       'deploy:npm_install'
  after   'deploy:npm_install',    'deploy:build_assets'
end
