# Midnight Murder Party v2
_Elm, PureScript, JavaScript, Ruby, Sinatra, SQLite3 (dev), PostgreSQL (prod)_

### Requires
- [Ruby](https://www.ruby-lang.org/en/) v2.5.1
- [Bundler](http://bundler.io/#getting-started) v1.16.1
- [NodeJS/NPM](https://nodejs.org/en/) Any LTS release
- An OS that supports GHC 7.10.1+ (though you shouldn't have to install this yourself)

### Dev Setup
- Install above prerequistites
- Clone repository
- `cd` into repository
- Run `./setup` (if your OS doesn't support bash scripts, follow the steps within the script manually)

The setup script will create the necessary files/folders, install dependencies, setup the database, and build the reader, editor, and countdown page.

### Using Bower/Gulp
Bower and Gulp are both installed as `npm` dependencies in order to avoid global installs. After the initial setup, they can be run with `npm run bower` and `npm run gulp`, respectively.

### Manually Installing Dependencies
- Reader: `npm install`
- Editor: `npm run bower install`
- Server: `bundle install`

### Building the Front End
- Reader: `npm run gulp build:reader`
- Editor: `npm run gulp build:editor`
- Countdown: `npm run gulp build:countdown`

**Note:** To use the `--prod` flag when building the reader (which enables stripping logs/alerts/debuggers on build and uses prod config), `npm run gulp build:reader` cannot be used. Instead, run Gulp directly with `./node_modules/.bin/gulp build:reader --prod`.

### Running the Server
- `ruby app.rb`
- Visit `localhost:4567`/`localhost:4567/editor` in your browser
