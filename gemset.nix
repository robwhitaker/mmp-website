{
  activemodel = {
    dependencies = ["activesupport"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0jzqmaicllzw43vs75ba5vs8xxazy9jpyn50m5grn02z7qg8n4vd";
      type = "gem";
    };
    version = "6.0.2.1";
  };
  activerecord = {
    dependencies = ["activemodel" "activesupport"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "12spdddifwx9d1kfg2hppz0pg870x6k3g38r9kr8df58zpk2hf88";
      type = "gem";
    };
    version = "6.0.2.1";
  };
  activesupport = {
    dependencies = ["concurrent-ruby" "i18n" "minitest" "tzinfo" "zeitwerk"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1dd6gh66ffdbhsxv33rxxsiciqyhhkm69l1yqspwdj2brvh1jzl1";
      type = "gem";
    };
    version = "6.0.2.1";
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
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "045wzckxpwcqzrjr353cxnyaxgf0qg22jh00dcx7z38cys5g1jlr";
      type = "gem";
    };
    version = "3.2.4";
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
      sha256 = "0w16p7cvslh3hxd3cia8jg4pd85z7rz7xqb16vh42gj4rijn8rmi";
      type = "gem";
    };
    version = "5.13.0";
  };
  multi_json = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0xy54mjf7xg41l8qrg1bqri75agdqmxap9z466fjismc1rn2jwfr";
      type = "gem";
    };
    version = "1.14.1";
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
      sha256 = "0r0qpgf80h764k176yr63gqbs2z0xbsp8vlvs2a79d5r9vs83kln";
      type = "gem";
    };
    version = "1.10.7";
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
      sha256 = "0v6zai6sinw5r1lchm278mm3dr8x5vi8pwmybwv9lz1kz02fk2g3";
      type = "gem";
    };
    version = "4.3.1";
  };
  rack = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1id0jsslx1ipv0pbqjfn7mjbb2vx2xybk7qypq59a17163xp30gr";
      type = "gem";
    };
    version = "2.0.8";
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
      sha256 = "0w6qza25bq1s825faaglkx1k6d59aiyjjk3yw3ip5sb463mhhai9";
      type = "gem";
    };
    version = "13.0.1";
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
      sha256 = "0lja01cp9xd5m6vmx99zwn4r7s97r1w5cb76gqd8xhbm1wxyzf78";
      type = "gem";
    };
    version = "1.4.2";
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
      sha256 = "0jywi63w1m2b2w9fj9rjb9n3imf6p5bfijfmml1xzdnsrdrjz0x1";
      type = "gem";
    };
    version = "2.2.2";
  };
}