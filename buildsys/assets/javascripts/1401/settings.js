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
	/* additional functions */
	SETTINGS.Set = function ( key, value ) { 
		if (PROP[key]) console.log ('overwriting',key.bracket(),'with new value');
		PROP[key]=value;
	};


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/
	
	var PROP = {};

///	GAME LOCATIONS ///////////////////////////////////////////////////////////
///	pathnames

	PROP.PATH_GAMES = '/javascripts/1401-games';				// this should be set in main.js
	PROP.PATH_RUNFILE = 'game-main.js';		// the default entry point


///	MASTER TIME //////////////////////////////////////////////////////////////
///	The timestep established in master.js uses these variables

	PROP.FPS = 30;
	PROP.TIMESTEP = 1000 / PROP.FPS;


///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	// settings is a FUNCTION that can be invoked. weird, right?
	return SETTINGS;

});
