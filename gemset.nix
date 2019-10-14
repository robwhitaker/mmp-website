{
  activemodel = {
    dependencies = ["activesupport"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1jr7s47vblpi89yvba5c7zpkqyzzc2p0qw78wqli4aj9yniykgsc";
      type = "gem";
    };
    version = "6.0.0";
  };
  activerecord = {
    dependencies = ["activemodel" "activesupport"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "00v3di3krpj8x2c1ww3s2bg3szdmcfix3dhrnan5fz2kpdviili6";
      type = "gem";
    };
    version = "6.0.0";
  };
  activesupport = {
    dependencies = ["concurrent-ruby" "i18n" "minitest" "tzinfo" "zeitwerk"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0b24ch7zmrdb4h6aismahk9785lc4ij30lmdr6ydv19kkljsjq5v";
      type = "gem";
    };
    version = "6.0.0";
  };
  backports = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0cczfi1yp7a68bg7ipzi4lvrmi4xsi36n9a19krr4yb3nfwd8fn2";
      type = "gem";
    };
    version = "3.15.0";
  };
  builder = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0qibi5s67lpdv1wgcj66wcymcr04q6j4mzws6a479n0mlrmh5wr1";
      type = "gem";
    };
    version = "3.2.3";
  };
  coderay = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "15vav4bhcc2x3jmi3izb11l4d9f3xv8hp2fszb7iqmpsccv1pz4y";
      type = "gem";
    };
    version = "1.1.2";
  };
  concurrent-ruby = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1x07r23s7836cpp5z9yrlbpljcxpax14yw4fy4bnp6crhr6x24an";
      type = "gem";
    };
    version = "1.1.5";
  };
  i18n = {
    dependencies = ["concurrent-ruby"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0hmypvx9iyc0b4hski7aic2xzm09cg1c7q1qlpnk3k8s5acxzyhl";
      type = "gem";
    };
    version = "1.7.0";
  };
  mail = {
    dependencies = ["mini_mime"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "00wwz6ys0502dpk8xprwcqfwyf3hmnx6lgxaiq6vj43mkx43sapc";
      type = "gem";
    };
    version = "2.7.1";
  };
  method_source = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1pviwzvdqd90gn6y7illcdd9adapw8fczml933p5vl739dkvl3lq";
      type = "gem";
    };
    version = "0.9.2";
  };
  mini_mime = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1axm0rxyx3ss93wbmfkm78a6x03l8y4qy60rhkkiq0aza0vwq3ha";
      type = "gem";
    };
    version = "1.0.2";
  };
  mini_portile2 = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "15zplpfw3knqifj9bpf604rb3wc1vhq6363pd6lvhayng8wql5vy";
      type = "gem";
    };
    version = "2.4.0";
  };
  minitest = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0zjm24aiz42i9n37mcw8lydd7n0y7wfk27by06jx77ypcld3qvkw";
      type = "gem";
    };
    version = "5.12.2";
  };
  multi_json = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1gysslvn8zvnn0jn3nb60zsci962vxdri4w6ilki5mi2jwy24bgi";
      type = "gem";
    };
    version = "1.14.0";
  };
  mustermann = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0lycgkmnyy0bf29nnd2zql5a6pcf8sp69g9v4xw0gcfcxgpwp7i1";
      type = "gem";
    };
    version = "1.0.3";
  };
  nio4r = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0gnmvbryr521r135yz5bv8354m7xn6miiapfgpg1bnwsvxz8xj6c";
      type = "gem";
    };
    version = "2.5.2";
  };
  nokogiri = {
    dependencies = ["mini_portile2"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0nmdrqqz1gs0fwkgzxjl4wr554gr8dc1fkrqjc2jpsvwgm41rygv";
      type = "gem";
    };
    version = "1.10.4";
  };
  pg = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "00vhasqwc4f98qb4wxqn2h07fjwzhp5lwyi41j2gndi2g02wrdqh";
      type = "gem";
    };
    version = "0.21.0";
  };
  pony = {
    dependencies = ["mail"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "19qqqwlzvdk9751h2l8dian40g3aavj0lp77y6bdwdcbvs57ql5b";
      type = "gem";
    };
    version = "1.13.1";
  };
  pry = {
    dependencies = ["coderay" "method_source"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "00rm71x0r1jdycwbs83lf9l6p494m99asakbvqxh8rz7zwnlzg69";
      type = "gem";
    };
    version = "0.12.2";
  };
  puma = {
    dependencies = ["nio4r"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1i9haylcz3d92cq42mma7857sqj35ydciinhfrdjprc7ba8cd2qd";
      type = "gem";
    };
    version = "4.2.1";
  };
  rack = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0z90vflxbgjy2n84r7mbyax3i2vyvvrxxrf86ljzn5rw65jgnn2i";
      type = "gem";
    };
    version = "2.0.7";
  };
  rack-protection = {
    dependencies = ["rack"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0xcvf6lxwdfls6mk1pc6kyw37gr9jyyal83vc6cnlscyp7zafh8j";
      type = "gem";
    };
    version = "2.0.7";
  };
  rake = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1cvaqarr1m84mhc006g3l1vw7sa5qpkcw0138lsxlf769zdllsgp";
      type = "gem";
    };
    version = "12.3.3";
  };
  sinatra = {
    dependencies = ["mustermann" "rack" "rack-protection" "tilt"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1zmi68iv2lsp9lj6vpmwd9grga2v4hsphagjkzqb908v83539jbw";
      type = "gem";
    };
    version = "2.0.7";
  };
  sinatra-activerecord = {
    dependencies = ["activerecord" "sinatra"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "04dbhx03fqq2yawki5kr2k5jph2qvbkjcr7vz9arckdmpd91q77c";
      type = "gem";
    };
    version = "2.0.14";
  };
  sinatra-contrib = {
    dependencies = ["backports" "multi_json" "mustermann" "rack-protection" "sinatra" "tilt"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "026s6z315dahy9j4lkm48hfm07l6b35sdnwn673al997nmvyp5r8";
      type = "gem";
    };
    version = "2.0.7";
  };
  sqlite3 = {
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1v903nbcws3ifm6jnxrdfcpgl1qg2x3lbif16mhlbyfn0npzb494";
      type = "gem";
    };
    version = "1.4.1";
  };
  thread_safe = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0nmhcgq6cgz44srylra07bmaw99f5271l0dpsvl5f75m44l0gmwy";
      type = "gem";
    };
    version = "0.3.6";
  };
  tilt = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0rn8z8hda4h41a64l0zhkiwz2vxw9b1nb70gl37h1dg2k874yrlv";
      type = "gem";
    };
    version = "2.0.10";
  };
  tzinfo = {
    dependencies = ["thread_safe"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1fjx9j327xpkkdlxwmkl3a8wqj7i4l4jwlrv3z13mg95z9wl253z";
      type = "gem";
    };
    version = "1.2.5";
  };
  zeitwerk = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0hhh8r053f6qhnk6mcfi3pvjhn51m8x885khhf8bjs7rmnr7281g";
      type = "gem";
    };
    version = "2.2.0";
  };
}