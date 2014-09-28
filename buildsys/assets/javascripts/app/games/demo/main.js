/* filename of this module */
define ([
	'gamesys/api/gameloop',
	'gamesys/api/gamestep'
], function ( 
	API_GLOOP,
	API_GSTEP
) {

///////////////////////////////////////////////////////////////////////////////
/**	NAME OF MODULE **********************************************************\

	This file, main.js, is the starting point of the game. It uses the API
	for Game Loops.

	NOTES: PieceFactory example below is how the loaded modules would work!
	System Modules and Players use API GameStep.



///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	// create a game loop handler object with all necessary functions
	var MAIN = API_GLOOP.New('GameDemoMain');

	var PIECEFACTORY = API_GSTEP.New('PieceFactory');

	// add handlers as needed
	MAIN.HandleStep(function(time_ms){
		// custom step function calls modules in a specific order
		PIECEFACTORY.Input(time_ms);
		PIECEFACTORY.Update(time_ms);
		PIECEFACTORY.Think(time_ms);
		PIECEFACTORY.OverThink(time_ms);
		PIECEFACTORY.Execute(time_ms);
	});


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/



///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MAIN;

});
