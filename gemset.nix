{
  activemodel = {
    dependencies = ["activesupport"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "043nnxaf3cfq8jijls0jh1bg3a8v5zd9slc62zc2acp2n2wkjnd4";
      type = "gem";
    };
    version = "5.2.1";
  };
  activerecord = {
    dependencies = ["activemodel" "activesupport" "arel"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0pc7cycvhzjpw0swil2inka6c0fvcxhln793czp52pidg0654g7g";
      type = "gem";
    };
    version = "5.2.1";
  };
  activesupport = {
    dependencies = ["concurrent-ruby" "i18n" "minitest" "tzinfo"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0ziy6xk31k4fs115cdkba1ys4i8nzcyri7a2jig7nx7k5h7li6l2";
      type = "gem";
    };
    version = "5.2.1";
  };
  arel = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1jk7wlmkr61f6g36w9s2sn46nmdg6wn2jfssrhbhirv5x9n95nk0";
      type = "gem";
    };
    version = "9.0.0";
  };
  backports = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1ax5sqw30vdkvc7crjj2ikw9q0ayn86q2gb6yfzrkh865174vc2p";
      type = "gem";
    };
    version = "3.11.3";
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
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "183lszf5gx84kcpb779v6a2y0mx9sssy8dgppng1z9a505nj1qcf";
      type = "gem";
    };
    version = "1.0.5";
  };
  i18n = {
    dependencies = ["concurrent-ruby"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0ppvmla21hssvrfm8g1n2fnb4lxn4yhy9qmmba0imanflgldrjmr";
      type = "gem";
    };
    version = "1.1.0";
  };
  mail = {
    dependencies = ["mini_mime"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "10dyifazss9mgdzdv08p47p344wmphp5pkh5i73s7c04ra8y6ahz";
      type = "gem";
    };
    version = "2.7.0";
  };
  method_source = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0xqj21j3vfq4ldia6i2akhn2qd84m0iqcnsl49kfpq3xk6x0dzgn";
      type = "gem";
    };
    version = "0.9.0";
  };
  mini_mime = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1q4pshq387lzv9m39jv32vwb8wrq3wc4jwgl4jk209r4l33v09d3";
      type = "gem";
    };
    version = "1.0.1";
  };
  mini_portile2 = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "13d32jjadpjj6d2wdhkfpsmy68zjx90p49bgf8f7nkpz86r1fr11";
      type = "gem";
    };
    version = "2.3.0";
  };
  minitest = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0icglrhghgwdlnzzp4jf76b0mbc71s80njn5afyfjn4wqji8mqbq";
      type = "gem";
    };
    version = "5.11.3";
  };
  multi_json = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1rl0qy4inf1mp8mybfk56dfga0mvx97zwpmq5xmiwl5r770171nv";
      type = "gem";
    };
    version = "1.13.1";
  };
  mustermann = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0lycgkmnyy0bf29nnd2zql5a6pcf8sp69g9v4xw0gcfcxgpwp7i1";
      type = "gem";
    };
    version = "1.0.3";
  };
  nokogiri = {
    dependencies = ["mini_portile2"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1h9nml9h3m0mpvmh8jfnqvblnz5n5y3mmhgfc38avfmfzdrq9bgc";
      type = "gem";
    };
    version = "1.8.4";
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
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0md2lm32hc87r7rva2m9srn6c9fchjsf59kgjhii5lh8sba2jsf0";
      type = "gem";
    };
    version = "1.12";
  };
  pry = {
    dependencies = ["coderay" "method_source"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1mh312k3y94sj0pi160wpia0ps8f4kmzvm505i6bvwynfdh7v30g";
      type = "gem";
    };
    version = "0.11.3";
  };
  puma = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "06qiqx1pcfwq4gi9pdrrq8r6hgh3rwl7nl51r67zpm5xmqlp0g10";
      type = "gem";
    };
    version = "3.11.4";
  };
  rack = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "158hbn7rlc3czp2vivvam44dv6vmzz16qrh5dbzhfxbfsgiyrqw1";
      type = "gem";
    };
    version = "2.0.5";
  };
  rack-protection = {
    dependencies = ["rack"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1z5598qipilmnf45428jnxi63ykrgvnyywa5ckpr52zv2vpd8jdp";
      type = "gem";
    };
    version = "2.0.3";
  };
  rake = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1idi53jay34ba9j68c3mfr9wwkg3cd9qh0fn9cg42hv72c6q8dyg";
      type = "gem";
    };
    version = "12.3.1";
  };
  sinatra = {
    dependencies = ["mustermann" "rack" "rack-protection" "tilt"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1kyi55q4k4idv31h7l53hw0mnh50dwwrrsfm35j52jy7fc993m9r";
      type = "gem";
    };
    version = "2.0.3";
  };
  sinatra-activerecord = {
    dependencies = ["activerecord" "sinatra"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0l41ls664v4nypd04hkwmrrw42rm70kplmjpwcl8zs1qjif9bjmp";
      type = "gem";
    };
    version = "2.0.13";
  };
  sinatra-contrib = {
    dependencies = ["activesupport" "backports" "multi_json" "mustermann" "rack-protection" "sinatra" "tilt"];
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "1fk8pnvzlylqpnxnvd888ji217552xvvrfpzn8wh2njkz0pk28fc";
      type = "gem";
    };
    version = "2.0.3";
  };
  sqlite3 = {
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "01ifzp8nwzqppda419c9wcvr8n82ysmisrs0hph9pdmv1lpa4f5i";
      type = "gem";
    };
    version = "1.3.13";
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
    source = {
      remotes = ["http://rubygems.org"];
      sha256 = "0020mrgdf11q23hm1ddd6fv691l51vi10af00f137ilcdb2ycfra";
      type = "gem";
    };
    version = "2.0.8";
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
}