requirejs.config({
	paths: {
		'text': '../vendor/requirejs-text/text',
		'knockout': '../vendor/knockout.js/knockout',
		'jquery': '../vendor/jquery/jquery',
        'jquery-ui': '../vendor/jquery-ui/jquery-ui',
		'bootstrap': '../vendor/bootstrap/bootstrap',
		'durandal':'../vendor/durandal',
		'plugins' : '../vendor/durandal/plugins',
		'transitions' : '../vendor/durandal/transitions',
// ---- project 1401 paths added --------------------------------------------- //
		'1401' : '../1401',
		'1401-games' : '../1401-games',
// ---- project 1401 extra libs ---------------------------------------------- // 
		'three' : '../vendor-shimmed/three.min',
        'yaml':'../vendor/yaml.js/yaml',
        'physicsjs' : '../vendor/physicsjs/physicsjs-full',
        'keypress' : '../vendor/Keypress/keypress-2.1.0.min'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery'],
			exports: 'jQuery'
		},
// ---- project 1401 non-AMD libs -------------------------------------------- // 
		'three': {
			exports: 'THREE'
		},
		'yaml': {
			exports: 'YAML'
		}
	}
});

define(function(require) {
	var app = require('durandal/app'),
		viewLocator = require('durandal/viewLocator'),
		system = require('durandal/system');

   // make sure bootstrap.js is included
   // otherwise some HTML ui elements won't work (e.g. toggles)
    var bootstrap = require('bootstrap');

	console.log(system);
	//>>excludeStart("build", true);
	system.debug(true);
	//>>excludeEnd("build");

	app.title = '1401 Game Shell';

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