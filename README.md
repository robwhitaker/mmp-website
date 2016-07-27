# Midnight Murder Party v2
Elm, Sinatra, SQLite3 (dev), PostgreSQL (prod)

Requires
- [Elm](http://elm-lang.org/install) v0.17.0
- [Ruby](https://www.ruby-lang.org/en/) v2.3.1

Setup
- Install above prerequistites
- Clone repository
- `cd` into repository
- `bundle install`
- `bundle exec rake db:setup`
- `cd public/elm && elm package install -y`
- Compile Elm code as described below
- `ruby app.rb`
- Visit localhost:4567 in your browser

Compiling Elm
- `cd` into `public/elm`
    + ~~Compile Editor: `elm make Editor/Editor.elm --output=../static/build/editor.js`~~ (Does not compile with Elm v0.17.0)
    + Compile Reader: `elm make Reader/Reader.elm --output=../static/build/reader.js`

Micro-script to compile Elm and CSS and start the server:

`postcss --use autoprefixer public/static/css/reader.css -d public/static/build/; cd public/elm; elm make Reader/Main.elm --output ../static/build/reader.js;cd ../..; ruby app.rb`
