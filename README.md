# Midnight Murder Party v2
_Elm, PureScript, JavaScript, Haskell, Ruby, Sinatra, Nix, SQLite3 (dev), PostgreSQL (prod)_

### Requires
- [Nix](https://nixos.org/nix/download.html)

### Dev Setup
- Clone and `cd` into the repository
- Run `./setup`

The setup script will create the necessary files/folders, install dependencies via Nix, setup the database, and build the reader, editor, and countdown page. This will probably take between ten and twenty minutes the first time.

_Optional:_ The setup script (and the `dev-shell` script) will create Nix roots for this project. This will allow you to use Nix's garbage collector without erasing all of your build output files (thus saving you from having another twenty minute install next time you use the Nix shell). However, to enable keeping the outputs, you must set `keep-outputs = true` in your [Nix config](https://nixos.org/nix/manual/#ch-files). 

### Dev Environment

Once you run the setup script, you can create a dev environment with all the dependencies installed by running `./dev-shell`. Unless otherwise noted, all of the following commands will assume you're running in this shell.

### Updating Dependencies

If you update the dependencies in `bower.json` or the `Gemfile`, you must generate the corresponding Nix file(s) again (bower-packages.nix and gemset.nix, respectively). To do so, leave the Nix shell and run `./update-deps`.

Once you enter the Nix shell again, those changes will take effect.

If you update the dependencies in `mmp-website.cabal`, those dependencies will be automatically installed the next time you enter the Nix shell.

To update the Reader dependencies, you can just run `npm install` from within the Nix shell.

### Building the Front End
- Reader: `gulp build:reader`
- Editor: `gulp build:editor`
- Countdown: `gulp build:countdown`

**Note:** You may use the `--prod` flag while building the Reader to enable stripping logs/alerts/debuggers and to use prod config.

### Running the Server
- `ruby app.rb`
- Visit `localhost:4567`/`localhost:4567/editor` in your browser
