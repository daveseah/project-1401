define ([
	'1401/settings',
	'1401/system/renderer'
], function (
	SETTINGS,
	RENDERER
) {

///////////////////////////////////////////////////////////////////////////////
/**	GAME MASTER *************************************************************\

	Initializes and launches the game system.
	Also maintains the time step.

	The system loads "games" that are located in the 1401-games directory,
	and loads the 'game-main' module to start.


///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	var MASTER = {};			// module
	var SYS1401 = {};			// used for exposing globals

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	This is called by the associated viewmodel on composition.Complete
	The viewModel and gameId are passed for safekeeping
/*/	MASTER.Start = function ( viewModel, gameSpec ) {
		console.group('Master Startup');

		// save viewmodel to talk to later
		console.assert(viewModel,"Master.Start: ViewModel required");
		m_viewmodel = viewModel || {};

		// select game to load
		m_GameLoad ( gameSpec.game );

		console.groupEnd();
	};


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES *************************************************/

	var m_game_path = null;		// current path to game
	var m_game = null;			// current game
	var m_viewmodel = null;		// parent viewmodel

	var m_current_time_ms = 0;	// global timer
	var m_interval_ms = SETTINGS('TIMESTEP');


///////////////////////////////////////////////////////////////////////////////
/** SUPPORTING PRIVATE FUNCTIONS *********************************************/

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Given the gameId, look for corresponding folder in the
	activities directory, and load asyncronously.
	TODO: Make re-entrant proof
/*/	function m_GameLoad ( gameId ) {
		console.log('!!! LOADING GAME', gameId.angle());

		var path = SETTINGS('PATH_GAMES');	
		m_game_path = path + '/' + gameId + '/';
		console.log(m_game_path);
		var module_path = m_game_path + SETTINGS('PATH_RUNFILE');

		m_game = null;

		require ( [module_path], m_GameInstantiate );
		// ...execution continues in m_GameInstantiate()
		
		console.groupEnd();
	}

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Called after m_GameLoad's require has loaded the module.
/*/	function m_GameInstantiate ( loadedGame )
	{
		console.group('Game Startup');

		m_game = loadedGame;
		m_game.Connect ( m_viewmodel );
		m_game.Initialize ();
		m_game.LoadAssets (m_GameConstructAndStart);
		// ...execution continues in m_gameConstructAndStart()

	}
	
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Resume game loading process...
/*/	function m_GameConstructAndStart () {

		m_game.Construct ();
		m_game.Start ( m_current_time_ms );
		// game will get called on every Step() from here on out

		m_current_time_ms = 0;

		// initialize timestep
		setInterval( m_TimeStep, m_interval_ms );
		
		console.groupEnd();
		console.log("*** BEGIN RUN LOOP ***");
	}

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Resume game loading process...
/*/	function m_TimeStep() {
		if (!m_game) return;
		if (m_game.IsRunning()) m_game.Step( m_interval_ms );
		m_current_time_ms += m_interval_ms;
	}


///////////////////////////////////////////////////////////////////////////////
/** MAKE KEY SYSTEM PROPERTIES AVAILABLE *************************************/

	SYS1401.MasterTime = function () {
		return m_current_time_ms;
	};
	SYS1401.ViewModel = function () {
		return m_viewmodel;
	};
	SYS1401.GamePath = function ( extra ) {
		extra = extra || '';
		return m_game_path+extra;
	};
	window.MASTER1401 = SYS1401;

///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	return MASTER;

});
