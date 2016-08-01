# Midnight Murder Party v2
Elm, Sinatra, SQLite3 (dev), PostgreSQL (prod)

Requires
- [Ruby](https://www.ruby-lang.org/en/) v2.3.1
- [NodeJS/NPM](https://nodejs.org/en/)
- Gulp (`npm install -g gulp`)

Setup
- Install above prerequistites
- Clone repository
- `cd` into repository
- Create necessary files/folders (`mkdir -p var/{pids,run,log} && touch var/log/app.log`)
- `bundle install`
- `bundle exec rake db:setup`
- `npm install`

Additional Setup
- If on Windows: Set environment variable, `DEV_ENV = windows`
- If you need to use the editor: Set environment variable, `ADMIN_SECRET = xxx` where `xxx` is the secret key

Building the Front End
- Reader: `gulp build:reader`
- Editor: `gulp build:editor-js`

Running the Server
- `ruby app.rb`
- Visit localhost:4567 in your browser
