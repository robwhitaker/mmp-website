{ packageOverrides = pkgs: rec {
  haskellPackages = pkgs.haskellPackages.override {
      overrides = haskellPackagesNew: haskellPackagesOld: rec {
      };
    };
  };
}
