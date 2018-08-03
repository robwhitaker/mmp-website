# Midnight Murder Party v2
_Elm, PureScript, JavaScript, Ruby, Sinatra, Nix, SQLite3 (dev), PostgreSQL (prod)_

### Requires
- [Nix](https://nixos.org/nix/download.html)

### Dev Setup
- Install Nix
    ```
    $ curl https://nixos.org/nix/install | sh
    $ . $HOME/.nix-profile/etc/profile.d/nix.sh
    ```
- Add the necessary Nix channels (nixos-18.03, nixpkgs-unstable), and add them to your `$NIX_PATH`:
    ```
    $ nix-channel --add https://nixos.org/channels/nixos-18.03 nixos
    $ nix-channel --add https://nixos.org/channels/nixpkgs-unstable nixpkgs
    $ nix-channel --update
    $ export NIX_PATH=nixos=$HOME/.nix-defexpr/channels/nixos:nixpkgs=$HOME/.nix-defexpr/channels/nixpkgs:$NIX_PATH
    $ # ^ you may want to add this line to your `.bashrc` or `.profile`
    ```
- Clone and `cd` into the repository
- Run `./setup`

The setup script will create the necessary files/folders, install dependencies, setup the database, and build the reader, editor, and countdown page.

### Dev Environment

Once you run the setup script, you can create a dev environment with all the dependencies installed by running `nix-shell --pure`. Unless otherwise noted, all of the following commands will assume you're running in the Nix shell.

### Manually Installing Dependencies
- Reader: `npm install`
- Editor: `bower install`
- Server: (from outside the Nix shell) `nix-shell -p bundix --run "bundix -l"`

### Building the Front End
- Reader: `gulp build:reader`
- Editor: `gulp build:editor`
- Countdown: `gulp build:countdown`

**Note:** You may use the `--prod` flag while building the Reader to enable stripping logs/alerts/debuggers and to use prod config.

### Running the Server
- `ruby app.rb`
- Visit `localhost:4567`/`localhost:4567/editor` in your browser

### A Note On `nix-shell`

You don't technically have to be in a Nix shell session to run the above commands, but it will save you some key strokes. You could also run most commands with `nix-shell shell.nix --pure --run "COMMAND"`. For example, to start the server from outside the Nix shell:

```
$ nix-shell shell.nix --pure --run "ruby app.rb"
```
