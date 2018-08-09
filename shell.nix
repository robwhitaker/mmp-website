with (import <nixpkgs> {});
let

  mmpApp = { outPath = ./.; name = "midnight-murder-party"; };

  nixos = import <nixos> {};

  ruby = ruby_2_5;

  gems = bundlerEnv {
    name = "midnight-murder-party";
    inherit ruby;
    gemdir = ./.;
  };

  haskellEnv = (haskellPackages.callPackage ./cabal.nix {}).env;

in lib.overrideDerivation haskellEnv (old: {
  name = "midnight-murder-party";
  src = mmpApp;
  bowerComponents = buildBowerComponents {
    name = "midnight-murder-party";
    generated = ./bower-packages.nix;
    src = mmpApp; 
  };
  buildInputs = old.buildInputs ++ [
    gems
    ruby
    sqlite
    nodejs
    nixos.purescript
    nixos.elmPackages.elm
    cabal-install
  ];
  shellHook = ''
    cp --reflink=auto --no-preserve=mode -r $bowerComponents/bower_components .
    export PATH=./node_modules/.bin:$PATH
    cabal configure
  '';
})

