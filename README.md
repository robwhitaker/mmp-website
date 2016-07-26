# Midnight Murder Party v2
Elm + Sinatra

Requires
- [Elm](http://elm-lang.org/install) v0.16.0 && v0.17.0
- [Ruby](https://www.ruby-lang.org/en/) v2.3.1

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

COMPILE ALL THE THINGS
postcss --use autoprefixer public/static/css/reader.css -d public/static/build/; cd public/elm; elm make Reader/Main.elm --output ../static/build/reader.js;cd ../..; ruby app.rb
