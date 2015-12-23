exports.config = {
  // See http://brunch.io/#documentation for docs.
  files: {
    javascripts: {
      joinTo: {
        "js/mmp.js": /^(web\/static\/build\/editor.js)/,
        "js/ding.js": /^(web\/static\/build\/reader.js)/
      }
    }
  },
  conventions: {
    assets: /^(web\/static\/assets)/
  },

  // Phoenix paths configuration
  paths: {
    // Dependencies and current project directories to watch
    watched: [
      "deps/phoenix/web/static",
      "deps/phoenix_html/web/static",
      "web/static",
      "test/static",
      "web/elm/Editor.elm",
      "web/elm/Reader.elm"
    ],

    // Where to compile files to
    public: "priv/static"
  },

  // Configure your plugins
  plugins: {
    elmBrunch: {
      elmFolder: 'web/elm',
      mainModules: ['Editor.elm', 'Reader.elm'],
      outputFolder: '../static/build'
    },
    babel: {
      // Do not use ES6 compiler in vendor code
      ignore: [/web\/static\/build/]
    }
  },

  modules: {
    autoRequire: {
      "js/editor.js": ["web/static/build/editor"],
      "js/reader.js": ["web/static/build/reader"]
    }
  },

  npm: {
    enabled: true
  }
};
