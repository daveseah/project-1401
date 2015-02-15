define ([
	'1401/settings'
], function (
	SETTINGS
) {

///////////////////////////////////////////////////////////////////////////////
/**	GAME MASTER *************************************************************\

	Initializes and launches the game system.
	The system loads "activities" 


///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	var MASTER = {};

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	This is called by the associated viewmodel on composition.Complete
	The viewModel and gameId are passed for safekeeping
/*/	MASTER.Start = function ( viewModel, gameId ) {
		API_Start(viewModel, gameId);
	};


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/

	var m_game_path = null;		// current path to game
	var m_game = null;			// current game
	var m_viewmodel = null;		// parent viewmodel
	var m_game_counter = 0;		// module-wide instance counter


	var m_current_time_ms = 0;	// global timer
	var m_interval_ms = SETTINGS('TIMESTEP');

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Initialize and run game system.
/*/	function API_Start( viewModel, gameSpec ) {

		console.group('Master Startup');

		// save viewmodel to talk to later
		console.assert(viewModel,"Master.Start: ViewModel required");
		m_viewmodel = viewModel || {};

		// add utilities for viewmodel object
		m_viewmodel.GamePath = function ( extra ) {
			extra = extra || '';
			if (!m_game_path) {
				console.log(m_game_path,"GamePath() is valid after GameLoop.Connect");
			} else {
				return m_game_path + extra;
			}
		}

		// select game to load
		m_GameLoad ( gameSpec.game );

		console.groupEnd();

	}

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
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MASTER;

});
