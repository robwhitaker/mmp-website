with import (fetchTarball {
  url = https://github.com/NixOS/nixpkgs/archive/18.03.tar.gz;
  sha256 = "0hk4y2vkgm1qadpsm4b0q1vxq889jhxzjx3ragybrlwwg54mzp4f";
}) { config = import ./config.nix; };

let
  mmpApp = { outPath = ./.; name = "mmp-website"; };

  ruby = ruby_2_6;

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
    elmPackages.elm
    cabal-install
  ];
  shellHook = ''
    cp --reflink=auto --no-preserve=mode -r $bowerComponents/bower_components .
    export PATH=./node_modules/.bin:$PATH
    cabal configure
  '';
})

