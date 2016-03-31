# Midnight Murder Party v2
Elm + Sinatra

Requires
- [Elm](http://elm-lang.org/install) v0.16.0
- [Ruby](https://www.ruby-lang.org/en/) v2.3.0

Setup
- Install above prerequistites
- Clone repository
- `cd` into repository
- `bundle install`
- `rake db:setup`
- `cd public/elm && elm package install -y`
- Compile Elm files as described below
- `ruby app.rb`
- visit localhost:4567 in your browser

Compiling Elm
- `cd` into `public/elm`
    + Compile Editor: `elm make Editor/Editor.elm --output=../static/build/editor.js`
    + Compile Reader: `elm make Reader/Reader.elm --output=../static/build/reader.js`
