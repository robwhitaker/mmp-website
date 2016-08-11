namespace :deploy do
  desc "Makes sure local git is in sync with remote."
  task :check_revision do
    unless `git rev-parse HEAD` == `git rev-parse origin/staging-deploy-test`
      puts "WARNING: HEAD is not the same as origin/staging-deploy-test"
      puts "Run `git push` to sync changes."
      exit
    end
  end

  desc "Ensure .bashrc and Ruby are loaded"
  task :check_ruby_version do
    on roles(:app) do
      within "~/mmp" do
        unless execute "ruby -v" == "2.3.1p112"
          puts "Ruby version is incorrect, exiting."
          exit
      end
    end
  end

  %w[start stop restart].each do |command|
    desc "#{command} Puma server."
    task command do
      on roles(:app) do
        within "~/mmp" do
          execute "pumactl #{command}"
        end
      end
    end
  end

  before :deploy, "deploy:check_revision"
  before :deploy, "deploy:check_ruby_version"
  before :deploy, "deploy:stop"
  after :deploy, "deploy:start"
end
