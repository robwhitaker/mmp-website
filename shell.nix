with import (fetchTarball {
  url = https://github.com/NixOS/nixpkgs/archive/18.03.tar.gz;
  sha256 = "0hk4y2vkgm1qadpsm4b0q1vxq889jhxzjx3ragybrlwwg54mzp4f";
}) { config = import ./config.nix; };

let
  pkgsWithElm019 = import (fetchGit {
      url = https://github.com/NixOS/nixpkgs.git;
      rev = "5082ab8335be9a0895ca78fe1ae81a5a186ae4a4";
    }) {};

  mmpApp = { outPath = ./.; name = "mmp-website"; };

  ruby = ruby_2_5;

  gems = bundlerEnv {
    name = "mmp-website";
    inherit ruby;
    gemdir = ./.;
  };

  bowerComponents = buildBowerComponents {
    name = "mmp-website";
    generated = ./bower-packages.nix;
    src = mmpApp;
  };

  haskellEnv = (haskellPackages.callCabal2nix "mmp-website" ./. {}).env;

in lib.overrideDerivation haskellEnv (old: {
  name = "mmp-website";
  src = mmpApp;
  inherit bowerComponents;
  buildInputs = old.buildInputs ++ [
    gems
    ruby
    sqlite
    nodejs
    purescript
    pkgsWithElm019.elmPackages.elm
    pkgsWithElm019.elmPackages.elm-format
    cabal-install
  ];
  shellHook = ''
    cp --reflink=auto --no-preserve=mode -r $bowerComponents/bower_components .
    export PATH=./node_modules/.bin:$PATH
    cabal configure
  '';
})
