/* gamesys.settings */
define ([
], function ( 
) {

///////////////////////////////////////////////////////////////////////////////
/**	MASTER SETTINGS *********************************************************\
	
	Contains global settings, properties, constants

	The actual global values are stored in an inaccessible object called
	PROP, which the Property() method checks.


///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	var SETTINGS;

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	This checks if a property actually exists 
/*/	SETTINGS = function ( propName ) {
		var value = PROP[propName];
		console.assert(value,"Requested property '"+propName+"' exists");
		return value;
	};

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	SETTINGS.Set = function ( key, value ) { 
		if (PROP[key]) console.log ('overwriting',key.bracket(),'with new value');
		PROP[key]=value;
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	SETTINGS.SetMasterTime = function ( current_time_ms ) {
		if (current_time_ms!==undefined) {
			CURRENT_TIME_MS = current_time_ms;
		}
		return CURRENT_TIME_MS;
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	SETTINGS.SetGamePath = function ( path ) {
		if (path!==undefined) {
			CURRENT_GAME_PATH = path;
		}
		return CURRENT_GAME_PATH;
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	SETTINGS.SetSystemPath = function ( path ) {
		if (path!==undefined) {
			SYSTEM_PATH = path;
		}
		return SYSTEM_PATH;
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	SETTINGS.MasterTime = function () {
		if (CURRENT_TIME_MS===undefined) console.error("Use of MasterTime before Start() is invalid!");
		return CURRENT_TIME_MS;
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	SETTINGS.GamePath = function ( extra ) {
		extra = extra || '';
		if (CURRENT_GAME_PATH===undefined) console.error("Use of GamePath before Start() is invalid!");
		return CURRENT_GAME_PATH+extra;
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	SETTINGS.SystemPath = function ( extra ) {
		extra = extra || '';
		if (SYSTEM_PATH===undefined) console.error("Use of SystemPath before Start() is invalid!");
		return SYSTEM_PATH+extra;
	};



///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/

	var CURRENT_TIME_MS;
	var CURRENT_GAME_PATH;
	var SYSTEM_PATH;
	
	var PROP = {};

///	IMPORTANT PATHS ///////////////////////////////////////////////////////////

	PROP.PATH_GAMES = '/javascripts/1401-games';	// this should be set in main.js
	PROP.PATH_RUNFILE = 'game-main.js';				// the default entry point
	PROP.PATH_SYSTEM = '/javascripts/1401';			// default system path


///	MASTER TIME //////////////////////////////////////////////////////////////
///	The timestep established in master.js uses these variables

	PROP.FPS = 30;
	PROP.TIMESTEP = 1000 / PROP.FPS;


//////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	// settings is a FUNCTION that can be invoked. weird, right?
	return SETTINGS;

});
