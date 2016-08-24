role :app,                     %w{deploy@mmp.nicklaroux.com}
set :branch,                   'master'
set :stage,                    'production'
set :linked_files,             %w{config/database.yml config/secret.yml public/reader.html}
set :linked_dirs,              %w{var/log var/pids var/run public/static/build}
set :rvm1_ruby_version,        '2.3.1'
set :rvm1_map_bins,            %w{rake gem bundle ruby}

shared_path = "/var/www/mmp/var"
set :puma_user,                fetch(:user)
set :puma_bind,                "unix://#{shared_path}/run/puma.sock"
set :puma_pid,                 "#{shared_path}/run/puma.pid"
set :puma_state,               "#{shared_path}/pids/puma.state"
set :puma_default_control_app, "unix://#{shared_path}/pids/pumactl.sock"
set :puma_conf,                "#{shared_path}/puma.rb"
set :puma_access_log,          "#{shared_path}/log/puma_access.log"
set :puma_error_log,           "#{shared_path}/log/puma_error.log"
set :puma_init_active_record,  true
set :puma_threads,             [1, 16]
set :puma_workers,             4
