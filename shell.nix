with (import <nixpkgs> {});
let
  nixos = import <nixos> {};
  ruby = ruby_2_5;
  gems = bundlerEnv {
    name = "midnight-murder-party";
    inherit ruby;
    gemdir = ./.;
  };
in stdenv.mkDerivation {
  name = "midnight-murder-party";
  buildInputs = [
    gems
    ruby
    git
    vim
    sqlite
    postgresql
    nodejs
    nixos.purescript
    nixos.elmPackages.elm
  ];
  shellHook = ''
    export PATH=./node_modules/.bin:$PATH
  '';
}

