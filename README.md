# Midnight Murder Party v2
_Elm, JavaScript, Haskell, Ruby, Sinatra, Nix, SQLite3 (dev), PostgreSQL (prod)_

### Requires
- [Nix](https://nixos.org/nix/download.html)

### Dev Setup
- Clone and `cd` into the repository
- Run `./setup`

The setup script will create the necessary files/folders, install dependencies via Nix, setup the database, and build the reader and countdown page. This will probably take between ten and twenty minutes the first time.

_Optional:_ If you plan on using Nix's garbage collector (`nix-collect-garbage`), you may want to set `keep-outputs = true` in your [Nix config](https://nixos.org/nix/manual/#ch-files). This will prevent the garbage collector from eating this project's dependencies. 

### Dev Environment

Once you run the setup script, you can create a dev environment with all the dependencies installed by running `./dev-shell`. To exit this shell, just type `exit`. Unless otherwise noted, all of the following commands will assume you're running in this shell.

### Dev Data

If you'd like to add some basic data to your local app for testing/development purposes, you can run this simple command:
```bash
DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rake db:reset
```
Note, this command will drop your previous db, create new tables, run migrations, and insert data. The `DISABLE_DATABASE_ENVIRONMENT_CHECK=1` flag is a workaround for 
[`ActiveRecord::EnvironmentMismatchError`](https://makandracards.com/makandra/47069-how-to-avoid-activerecord-environmentmismatcherror-on-rails-db-drop).

### Running the Server
- Run `ruby app.rb`
- Visit `localhost:4567` in your browser

**Note:** If you are just trying to build and run the app without changing anything, you're done. If you've made changes and need to rebuild the app or install new dependencies, read on.

### Building the Front End
- Reader: `gulp build:reader`
- Countdown: `gulp build:countdown`

**Note:** You may use the `--prod` flag while building the Reader and Countdown pages to enable stripping logs/alerts/debuggers, tell the Elm compiler to use the --optimize flag, and use prod config.

### Updating Dependencies

If you update the dependencies in the `Gemfile`, you must generate the corresponding Nix file (`gemset.nix`) again. To do so, leave the Nix shell and run `./update-deps`. Once you enter the Nix shell again, those changes will take effect.

If you update the dependencies in `mmp-website.cabal`, those dependencies will be automatically installed the next time you enter the Nix shell.

To update the Reader dependencies, you can just run `npm install` from within the Nix shell.

