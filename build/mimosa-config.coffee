exports.config =

  minMimosaVersion:'2.1.0'

  modules: [
    'server'
    'require'
    'minify-js'
    'minify-css'
    'live-reload'
    'jshint'
    'csslint'
    'combine'
    'requirebuild-include'
    'requirebuild-textplugin-include'
    'bower'
    'web-package'
    'copy'
  ]

  watch:
    javascriptDir: 'javascripts/app'

  requireBuildTextPluginInclude:
    pluginPath: 'text'
    extensions: ['html']

  requireBuildInclude:
    folder:"javascripts"
    patterns: ['app/**/*.js', 'vendor/durandal/**/*.js']

  bower:
    copy:
      mainOverrides:
        "knockout.js":[
          "knockout.js"
          "knockout-2.3.0.debug.js"
        ]
        "bootstrap": [
          "docs/assets/js/bootstrap.js"
          "docs/assets/css/bootstrap.css"
          "docs/assets/css/bootstrap-responsive.css"
        ]
        "font-awesome": [
          { font: "../../font" }
          "css/font-awesome.css"
          "css/font-awesome-ie7.css"
        ]
        "durandal": [
          {
            img: "../../images"
            js: "durandal"
            css: "durandal"
          }
        ]

  combine:
    folders: [
      {
        folder:'stylesheets'
        output:'stylesheets/styles.css'
        order: [
          'vendor/bootstrap/bootstrap.css'
          'vendor/bootstrap/bootstrap-responsive.css'
          'vendor/font-awesome/font-awesome.css'
          'vendor/durandal/durandal.css'
          'starterkit.css'
        ]
      }
    ]

  server:
    path: "server.js"
    views:
      compileWith: 'handlebars'
      extension: 'hbs'

  require:
    optimize:
      overrides:
        name: '../vendor/almond-custom'
        inlineText: true
        stubModules: ['text']
        pragmas:
          build: true

  webPackage:
    archiveName: null
    exclude: [
      "README.md"
      "node_modules"
      "mimosa-config.coffee"
      "mimosa-config.js"
      "assets"
      ".git"
      ".gitignore"
      "mimosa-config-documented.coffee"
      ".mimosa"
      "bower.json"
      "make.bat"
      "makefile"
    ]

  csslint:
    rules: 
      'ids': false
      'box-sizing': false
      'adjoining-classes': false

  copy: {
    extensions: [ 
      "js",  "css", "png", "jpg",
      "html", "eot", "svg", "ttf", 
      "woff", "otf", "yaml", "ico",
      "htc", "htm", "json", "txt",
      "xml", "xsd", "map", "md",
      "mp4", "ogg", "mp3", "m3a"
    ]
  }
