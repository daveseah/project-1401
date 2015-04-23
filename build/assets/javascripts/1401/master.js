define ([
	'1401/settings',
	'1401/objects/sysloop',
	'1401/system/autosystem',
	'1401-games/demo/game-main'
], function (
	SETTINGS,
	SYSLOOP,
	AUTOSYS,
	DEFAULT_GAME
) {

	var DBGOUT = false;

///////////////////////////////////////////////////////////////////////////////
/**	GAME MASTER *************************************************************\

	Initializes and launches the game system.
	Also maintains the time step.

	The system loads "games" that are located in the 1401-games directory,
	and loads the 'game-main' module to start.


///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	var MASTER = {};			// module


//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	This is called by the associated viewmodel on composition.Complete
	The viewModel and gameId are passed for safekeeping
/*/	MASTER.Start = function ( viewModel, gameSpec ) {
		console.group('Master Startup');

		// save viewmodel to talk to later
		console.assert(viewModel,"Master.Start: ViewModel required");
		m_viewmodel = viewModel || {};

		// select game to load
		m_GameLoad ( gameSpec.game, viewModel );

		console.groupEnd();
	};


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES *************************************************/

	var m_game_path = null;		// current path to game
	var m_game = null;			// current game
	var m_viewmodel = null;		// parent viewmodel

	var m_current_time_ms = 0;	// global timer
	var m_interval_ms = SETTINGS('TIMESTEP');

	var USE_DYNAMIC_LOADING = false;


///////////////////////////////////////////////////////////////////////////////
/** SUPPORTING PRIVATE FUNCTIONS *********************************************/

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Given the gameId, look for corresponding folder in the
	activities directory, and load asyncronously.
	TODO: Make re-entrant proof
/*/	function m_GameLoad ( gameId, viewModel ) {
		if (DBGOUT) console.log('!!! LOADING GAME', gameId.bracket());

		SETTINGS._Initialize( gameId, viewModel );
		var module_path = SETTINGS.GameMainModulePath();
		m_game = null;

		/* load game module asynchronously */
		if (USE_DYNAMIC_LOADING) {
			// this breaks with mimosa build -omp
			// require ( [module_path], m_GameInstantiate );
		} else {
			m_GameInstantiate ( DEFAULT_GAME );
		}
		// ...execution continues in m_GameInstantiate()

		
		console.groupEnd();
	}

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Called after m_GameLoad's require has loaded the module.
/*/	function m_GameInstantiate ( loadedGame ) {
		console.group('Game Startup');

		m_game = loadedGame;

		SYSLOOP.ConnectAll ( m_viewmodel );

		AUTOSYS.Initialize();
		SYSLOOP.InitializeAll();

		/* NOTE */
		/* the async assets loading is not yet working */

		AUTOSYS.LoadAssets ( m_GameConstructAndStart );
		SYSLOOP.LoadAssetsAll ( function () {} );

		// ...execution continues in m_gameConstructAndStart()

	}
	
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Resume game loading process...
/*/	function m_GameConstructAndStart () {

		SYSLOOP.ConstructAll ();

		// initialize time!
		m_current_time_ms = 0;
		SETTINGS._SetMasterTime(m_current_time_ms);

		SYSLOOP.StartAll ( m_current_time_ms );


		// game will get called on every Step() from here on out
		setInterval( m_TimeStep, m_interval_ms );
		
		console.groupEnd();
		if (DBGOUT) console.log("*** BEGIN RUN LOOP ***");
	}

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Resume game loading process...
/*/	function m_TimeStep() {
		if (!m_game) return;

		// update mastertime
		SETTINGS._SetMasterTime ( m_current_time_ms );

		// step the game
		if (m_game.IsRunning()) {
			AUTOSYS.HeartBeat( m_interval_ms );
			// there is only one master step, defined in game-main.js
			SYSLOOP.GameStep( m_interval_ms );
			// note that GameStep is responsible for calling
			// GetInput, Update, Think, etc in the correct order
		}
		
		// update mastertime counter
		m_current_time_ms += m_interval_ms;
	}


///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	return MASTER;

});
