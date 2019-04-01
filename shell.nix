with import ./pinned-package-sets.nix;
let
  mmpApp = { outPath = ./.; name = "mmp-website"; };

  rubyEnv = pkgs1903Beta.bundlerEnv {
    name = "mmp-website";
    ruby = pkgs1903Beta.ruby_2_6;
    gemdir = ./.;
	gemConfig = pkgs1903Beta.defaultGemConfig // {
      tzinfo = attrs: {
        preBuild = ''
          sed -i 's!s\.files.*!!' tzinfo.gemspec
        '';
      };
    };
  };

  bowerComponents = pkgs1803.buildBowerComponents {
    name = "mmp-website";
    generated = ./bower-packages.nix;
    src = mmpApp;
  };

  haskellEnv = (pkgs1803.haskellPackages.callCabal2nix "mmp-website" ./. {}).env;

in pkgs1803.lib.overrideDerivation haskellEnv (old: {
  name = "mmp-website";
  src = mmpApp;
  inherit bowerComponents;
  buildInputs = old.buildInputs ++ (with pkgs1803; [
    rubyEnv
    rubyEnv.wrappedRuby
    sqlite
    nodejs
    purescript
    pkgs1903Beta.elmPackages.elm
    pkgs1903Beta.elmPackages.elm-format
    cabal-install
  ]);
  shellHook = ''
    cp --reflink=auto --no-preserve=mode -r $bowerComponents/bower_components .
    export PATH=./node_modules/.bin:$PATH
    cabal configure
  '';
})
