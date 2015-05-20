/* 1401.settings */
define ([
	'yaml'
], function ( 
	yaml
) {

///////////////////////////////////////////////////////////////////////////////
/**	MASTER SETTINGS *********************************************************\
//////////////////////////////////////////////////////////////////////////////
	
	Contains global settings, properties, constants

	The actual global values are stored in an inaccessible object called
	S. 

	Note that this module returns a FUNCTION, which also has additional
	functions attached to it. To retrieve/set a property:
		var val = SETTINGS('propname');
		SETTINGS.Set('propname', value);



///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/
//////////////////////////////////////////////////////////////////////////////


///	BASIC PROPERTY SETTING/GETTING
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Retrieve value of associated property
/*/	var SETTINGS = function ( key ) {
		var value = S[key];
		if (!value)
			console.error("Requested key",key.bracket(),"doesn't exist!");
		return value;
	};
	SETTINGS.name = "1401.settings";
	
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Set the value of a key
/*/	SETTINGS.Set = function ( key, value ) { 
		if (S[key]) 
			console.warn ('overwriting',key.bracket(),'with new value ['+value+']');
		S[key]=value;
	};


/// SYSTEM INITIALIZATION ////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SETTINGS._Initialize = function ( gameId, viewModel ) {
		m_InitializeMeta ( gameId, viewModel );
		m_InitializePaths();

	};


/// SYSTEM PROPERTIES ////////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	called from master step every frame to update master time. 
/*/	SETTINGS._SetMasterTime = function ( current_time_ms ) {
		if (current_time_ms!==undefined) {
			CURRENT_TIME_MS = current_time_ms;
		}
		return CURRENT_TIME_MS;
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Return the master time, in milliseconds. Used by system-related services;
	Games should use the Timer class instead.
/*/	SETTINGS.MasterTime = function () {
		if (CURRENT_TIME_MS===undefined) {
			console.log("*** WARN *** MasterTime() was called before system startup. Returning 0ms.");
			return 0;
		}
		return CURRENT_TIME_MS;
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Return current game directory path, with <extra> added.
	Useful for loading assets in the game directory.
/*/	SETTINGS.GamePath = function ( extra ) {
		extra = extra || '';
		if (PATH_GAME===undefined) 
			console.error("GamePath is invalid before MasterGameLoad");
		return PATH_GAME+extra;
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Return current 1401 system path, with <extra> added.
	Useful for loading assets in the 1401 system directory.
/*/	SETTINGS.SystemPath = function ( extra ) {
		extra = extra || '';
		if (PATH_SYSTEM===undefined) 
			console.error("SystemPath is invalid before MasterGameLoad");
		return PATH_SYSTEM+extra;
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Return path to game module "main" file.
/*/	SETTINGS.GameMainModulePath = function () {
		if (PATH_GAME===undefined) 
			console.error("GameMainModule is invalid before MasterGameLoad");
		return PATH_GAME+PATH_RUNFILE;
	};



//////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/
//////////////////////////////////////////////////////////////////////////////

	// these variables are dereferenced from S object for
	// speed (though it's probably not important at all to do this)

	var CURRENT_TIME_MS;	// current time in milliseconds
	var PATH_GAME;			// specific game path
	var PATH_SYSTEM;		// 1401 system path

	var VIEW_MODEL;			// durandal viewmodel reference
	var GAME_ID;			// game id string (e.g. "demo")


///	ADD DEFAULT KEY,VALUES ///////////////////////////////////////////////////

	var S = {};		// global system property object

	/* master timimg */
	S.FPS = 30;
	S.TIMESTEP = Math.floor(1000 / S.FPS);



//////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/
//////////////////////////////////////////////////////////////////////////////

	function m_InitializeMeta ( gameId, viewModel ) {
		GAME_ID = gameId;
		VIEW_MODEL = viewModel;
	}

	function m_InitializePaths() {

		/* system paths and main file */
		PATH_SYSTEM = '/javascripts/1401/';				// default system dir
		PATH_GAMESDIR = '/javascripts/1401-games/';		// default games dir
		PATH_RUNFILE = 'game-main.js';					// default entry point

		// game path (inside gamesdir)
		PATH_GAME = PATH_GAMESDIR + GAME_ID + '/';
	}


//////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS **********************************/
//////////////////////////////////////////////////////////////////////////////

	// settings is a FUNCTION that can be invoked. weird, right?
	return SETTINGS;

});
