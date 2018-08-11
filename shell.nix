with (import <nixos> { config = import ./config.nix; });
let
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
    elmPackages.elm
    cabal-install
  ];
  shellHook = ''
    cp --reflink=auto --no-preserve=mode -r $bowerComponents/bower_components .
    export PATH=./node_modules/.bin:$PATH
    cabal configure
  '';
})

