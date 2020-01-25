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

  haskellEnv = (pkgs1803.haskellPackages.callCabal2nix "mmp-website" ./. {}).env;

in pkgs1803.lib.overrideDerivation haskellEnv (old: {
  name = "mmp-website";
  src = mmpApp;
  buildInputs = old.buildInputs ++ (with pkgs1803; [
    rubyEnv
    rubyEnv.wrappedRuby
    sqlite
    nodejs
    pkgs1903Beta.elmPackages.elm
    pkgs1903Beta.elmPackages.elm-format
    cabal-install
  ]);
  shellHook = ''
    export PATH=./node_modules/.bin:$PATH
    cabal --config-file=/dev/null configure
  '';
})
