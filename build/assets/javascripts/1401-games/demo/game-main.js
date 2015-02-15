/* demo/game-main.js */
define ([
	'1401/settings',
	'1401/objects/sysloop',
	'1401/system/renderer'
], function ( 
	SETTINGS,
	SYSLOOP,
	RENDERER
) {

///////////////////////////////////////////////////////////////////////////////
/**	DEMO GAME ***************************************************************\

	This file, game-main.js, is the starting point of the game. It uses the 
	API for Game Loops to run under the control of master.js.

	In general, you'll be hooking into these functions as necessary.

	MAIN.SetHandler('Initialize', function () {} );
	MAIN.SetHandler('Connect', function () {} );
	MAIN.SetHandler('LoadAssets', function () {} );
	MAIN.SetHandler('Construct', function () {} );
	MAIN.SetHandler('Start', function () {} );
	MAIN.SetHandler('Step', function () {} );

///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	// create a game loop handler object with all necessary functions
	var MAIN = SYSLOOP.New('GameDemoMain');
	// set 
	SYSLOOP.SetMainLoop(MAIN);

	// add handlers as needed
	MAIN.SetHandler('Connect', API_HandleConnect);
	MAIN.SetHandler('Initialize', API_HandleInitialize);
	MAIN.SetHandler('Update', API_HandleStep);


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/

	var m_viewmodel;	// durandal viewmodel for databinding, system props

///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/

	function API_HandleConnect ( viewModel ) {
		m_viewmodel = viewModel;
	}

	function API_HandleInitialize () {
		console.log("MAIN: Initializing!");
		RENDERER.Initialize ();
		var bg_png = SETTINGS.GamePath('resources/bg.png');
		RENDERER.SetBackgroundStill ( bg_png );
		RENDERER.AutoRender();
	}

	function API_HandleStep () {
		console.log("MAIN: Step!");
	}

///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MAIN;

});
