exports.config = {
  // See http://brunch.io/#documentation for docs.
  files: {
    javascripts: {
      joinTo: { 
        "js/editor.js" : /web\/static\/vendor\/editor\.js/,
        "js/reader.js" : /web\/static\/vendor\/reader\.js/
      }

      // To use a separate vendor.js bundle, specify two files path
      // https://github.com/brunch/brunch/blob/stable/docs/config.md#files
      // joinTo: {
      //  "js/app.js": /^(web\/static\/js)/,
      //  "js/vendor.js": /^(web\/static\/vendor)|(deps)/
      // }
      //
      // To change the order of concatenation of files, explicitly mention here
      // https://github.com/brunch/brunch/tree/master/docs#concatenation
      // order: {
      //   before: [
      //     "web/static/vendor/js/jquery-2.1.1.js",
      //     "web/static/vendor/js/bootstrap.min.js"
      //   ]
      // }
    },
    stylesheets: {
      joinTo: {
        "css/editor.css" : /web\/static\/css\/editor\.css/,
        "css/reader.css" : /web\/static\/css\/reader\.css/,
      }
    },
    templates: {
      joinTo: "js/app.js"
    }
  },

  conventions: {
    // This option sets where we should place non-css and non-js assets in.
    // By default, we set this to "/web/static/assets". Files in this directory
    // will be copied to `paths.public`, which is "priv/static" by default.
    assets: /^(web\/static\/assets)/
  },

  // Phoenix paths configuration
  paths: {
    // Dependencies and current project directories to watch
    watched: [
      // "deps/phoenix/web/static",
      // "deps/phoenix_html/web/static",
      "web/static",
      // "test/static",
      "web/elm/Editor",
      "web/elm/Reader",
      "web/elm/Core"
    ],

    // Where to compile files to
    public: "priv/static"
  },

  // Configure your plugins
  plugins: {
    elmBrunch: {
      elmFolder: 'web/elm',
      mainModules: ['Editor/Editor.elm', 'Reader/Reader.elm'],
      outputFolder: '../static/vendor'
    },
    babel: {
      // Do not use ES6 compiler in vendor code
      ignore: [/web\/static\/vendor/]
    }
  },

  // modules: {
  //   autoRequire: {
  //     "js/app.js": ["web/static/js/app"]
  //   }
  // },

  npm: {
    enabled: true
  },

  notifications: false
};