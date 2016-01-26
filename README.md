# Midnight Murder Party
Elm + Sinatra

Requires
- [Elm](http://elm-lang.org/install) v0.16.0
- [Ruby](https://www.ruby-lang.org/en/) v2.3.0
- [Postgres](http://www.postgresql.org/download/) v9.5.0

Setup
- Install above requirements
- Clone repository
- cd into repository
- `bundle install`
- Make sure you have Postgres running
- Add `export PG_USER="_username_"` and `export PG_PASS="_pass_"` environment vars to your PATH
- `rake db:setup`
- Compile Elm files as described below
- `ruby app.rb`

Compiling Elm
- cd into web/elm
    + Compile Editor: `elm make Editor/Editor.elm --output=../static/build/editor.js`
    + Compile Reader: `elm make Reader/Reader.elm --output=../static/build/reader.js`
