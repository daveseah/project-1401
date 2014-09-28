requirejs.config({
    paths: {
        'text': '../vendor/requirejs-text/text',
        'knockout': '../vendor/knockout.js/knockout',
        'jquery': '../vendor/jquery/jquery',
        'bootstrap': '../vendor/bootstrap/bootstrap',
        'durandal':'../vendor/durandal',
        'plugins' : '../vendor/durandal/plugins',
        'transitions' : '../vendor/durandal/transitions',
// ---- project 1401 paths added --------------------------------------------- // 
        'gamesys' : '../app/gamesys',   // game system
        'games' : '../app/games',       // games folder
        'mygames' : '../../mygames'     // gitignored game path
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    }
});

define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator'),
        system = require('durandal/system');

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = '1401 Game Project';

    app.configurePlugins({
        router:true,
        dialog: true,
        widget: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});