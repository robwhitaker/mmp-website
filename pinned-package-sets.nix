let
  pkgs1803 = fetchTarball {
    url = https://github.com/NixOS/nixpkgs/archive/18.03.tar.gz;
    sha256 = "0hk4y2vkgm1qadpsm4b0q1vxq889jhxzjx3ragybrlwwg54mzp4f";
  };

  pkgs1903Beta = fetchTarball {
    url = https://github.com/NixOS/nixpkgs/archive/19.03-beta.tar.gz;
    sha256 = "1wr6dzy99rfx8s399zjjjcffppsbarxl2960wgb0xjzr7v65pikz";
  };
in
  {
    pkgs1803 = import pkgs1803 {};
    pkgs1903Beta = import pkgs1903Beta {};
  }
