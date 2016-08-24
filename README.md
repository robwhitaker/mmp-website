# Midnight Murder Party v2
Elm, Sinatra, SQLite3 (dev), PostgreSQL (prod)

Requires
- [Ruby](https://www.ruby-lang.org/en/) v2.3.1
- [NodeJS/NPM](https://nodejs.org/en/)
- Gulp (`npm install -g gulp`)

Dev Setup
- Install above prerequistites
- Clone repository
- `cd` into repository
- Create necessary files/folders (`mkdir -p var/{pids,run,log} && touch var/log/app.log`)
- Create a `config/database.yml` file with contents listed below
- `bundle install`
- `bundle exec rake db:setup`
- `npm install`

Building the Front End
- Reader: `gulp build:reader`
- Editor: `gulp build:editor-js`

Running the Server
- `ruby app.rb`
- Visit localhost:4567 in your browser

Local environment `config/database.yml`:
```yaml
defaults: &defaults
  host: localhost
  encoding: utf8

development:
  adapter: sqlite3
  database: db/development.sqlite3
  pool: 5
  timeout: 5000
```
