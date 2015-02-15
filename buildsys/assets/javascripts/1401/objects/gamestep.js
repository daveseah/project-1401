/* *gamestep.js */
define ([
], function ( 
) {

///////////////////////////////////////////////////////////////////////////////
/**	API GAMESTEP ************************************************************\

	Implements a generic GameStep object, which is used by GameLoop when
	handling the GameLoop.Step() function. Every step executes the following
	specific order of events:

	-- 	advance world state 
		PLAYER.GetInputs(ms);		read all control input
		PIECES.UpdatePhysics();		update all pieces with physics

	-- 	update modules with autonomous functions that depend on world state 
		EVTT.Update(ms);		update timers and triggers
		WORLD.Update(ms);		update world autonomous functions, detect state
		PIECES.Update(ms);		update piece autonomous functions, detect state
		PLAYER.Update(ms);		update player autonomous functions, detect state
	
	--	AI gets chance to set autonomous intentions via fly-by-wire commands
		PIECES.Think(ms);		piece behavior pre-think what to do?
		PLAYER.Think(ms);

	-- 	Player AI gets to override pieces if it needs to
		PLAYER.OverThink(ms);	player override pieces if necessary

	--	Pieces actually execute the command set in Think/Override
		PIECES.Execute(ms);		piece execute its commands

	-- 	Update GUI
	--	Record Frame

	The update function for the main game loop will carefully construct
	the specific order, but should obey the general order of operations
	

///////////////////////////////////////////////////////////////////////////////
/** SUPPORT CLASS ************************************************************/

	/* constructor */
	function GameStep ( name ) {
		this._req_obj = {};
		if (typeof name === 'string') {
			this._req_obj.name = name;
		} else {
			console.error("GameStep constructor requires string");
		}
		this._inputs = null;
		this._update = null;
		this._think = null;
		this._overthink = null;
		this._execute = null;
	}
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameStep.method('Input', function ( time_ms ) {
		if (this._inputs) {
			this._inputs.call(this, time_ms);
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameStep.method('Update', function ( time_ms ) {
		if (this._update) {
			this._update.call(this, time_ms);
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameStep.method('Think', function ( time_ms ) {
		if (this._think) {
			this._think.call(this, time_ms);
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameStep.method('OverThink', function ( time_ms ) {
		if (this._overthink) {
			this._overthink.call(this, time_ms);
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameStep.method('Execute', function ( time_ms ) {
		if (this._execute) {
			this._execute.call(this, time_ms);
		}
	});


///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	var FACTORY = {};	// MGR, FACTORY, or CLASS
	FACTORY.name = "gamesys.api.gamestep";


///	GameStep CREATION ///////////////////////////////////////////////////////

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Returns a pre-made GameStep object to handle the MasterJS standard
	with defaults; just override with your own methods.
/*/	FACTORY.New = function ( name ) {
		return m_AddNewGameStep (name);
	};


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/

	var m_steps = {};		// step collection to ensure uniqueness


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/

	function m_AddNewGameStep ( name ) {
		var step = m_steps[name];
		if (step) {
			console.error("GameStep:",name.bracket(),"already exists");
			return null;
		} else {
			step = new GameStep(name);
			m_steps[name] = step;
			return step;
		}
	}


///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return FACTORY;
	
});
