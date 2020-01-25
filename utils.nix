with (import ./pinned-package-sets.nix).pkgs1903Beta;

mkShell {
  name = "mmp-utils";
  buildInputs = [
    bundler
    bundix
  ];
}
