/* demo/game-main.js */
define ([
	'1401/objects/gameloop',
	'1401/objects/gamestep',
	'1401/system/renderer'
], function ( 
	API_GLOOP,
	API_GSTEP,
	RENDERER
) {

///////////////////////////////////////////////////////////////////////////////
/**	DEMO GAME ***************************************************************\

	This file, game-main.js, is the starting point of the game. It uses the 
	API for Game Loops to run under the control of master.js.

	In general, you'll be hooking into these functions as necessary.

	MAIN.HandleInitialize = function () { };
	MAIN.HandleConnect = function () { };
	MAIN.HandleLoadAssets = function ( done ) { done(); };
	MAIN.HandleConstruct = function () { };
	MAIN.HandleStart = function ( startTimeMs ) { };
	MAIN.HandleStep = function ( intervalMs ) { };

///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	// create a game loop handler object with all necessary functions
	var MAIN = API_GLOOP.New('GameDemoMain');

	// add handlers as needed
	MAIN.HandleConnect = API_HandleConnect;
	MAIN.HandleInitialize = API_HandleInitialize;
	MAIN.HandleStep = API_HandleStep;


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
		var bg_png = m_viewmodel.GamePath('resources/bg.png');
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
