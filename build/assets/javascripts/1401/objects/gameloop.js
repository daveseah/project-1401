/* gameloop.js */
define ([
	'1401/objects/gamestep'
], function ( 
	API_GSTEP
) {

///////////////////////////////////////////////////////////////////////////////
/**	API GAMELOOP ************************************************************\

	This module creates a "gameloop" object that is used by any module
	that needs to manage asset loading and connections with other high-level
	game modules and systems. It provides pre-defined handlers so you can 
	create a new module easily and just patch in what you need.

	The order of operation in the game loop is as follows:

	Connect 	Pass the parent Durandal viewmodel instance if the module 
				needs it for DOM access. 

	Initialize	Module can initialize data structures for itself, 
				allocate memory, set simple variables, but not
				use any other game systems yet.

	LoadAssets	Module can load any assets. When the assets are loaded,
				Module should call the passed Done() function to allow
				game initialization to proceed.

	Construct 	Module may access game systems like RENDERER and PIECEFACTORY,
				which by now are fully initialized and safe to use.

	Start 		Module may access OTHER modules and communicate with them,
				setting final parameters

	Step 		Module receives periodical timestamps, with the elapsed
				time since the last step as a parameter

	Assuming module is imported as GLOOP:
		var OBJ = GLOOP.New ('name')
		OBJ.SetConnectFunction( func );
		etc...


///////////////////////////////////////////////////////////////////////////////
/** SUPPORT CLASS ************************************************************/

	/* constructor */
	function GameLoop ( name ) {
		this._req_obj = {};
		if (typeof name === 'string') {
			this._req_obj.name = name;
		} else {
			console.error("GameLoop constructor requires string");
		}
		this.HandleConnect = null;
		this.HandleInitialize = null;
		this.HandleLoadAssets = null;
		this.HandleConstruct = null;
		this.HandleStart = null;
		this.HandleStep = null;

		this._runmode = GameLoop.RUNMODE_INIT;
	}
	/* constants */
	GameLoop.RUNMODE_INIT = 0;
	GameLoop.RUNMODE_RUNNING = 1;
	GameLoop.RUNMODE_PAUSED = 2;
	GameLoop.RUNMODE_EXIT = 3;
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('IsRunning', function () { 
		return (this._runmode==GameLoop.RUNMODE_RUNNING);
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('SetConnectFunction', function ( f ) {
		this.HandleConnect = f;
	});	
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('Connect', function ( viewModel ) {
		if (this.HandleConnect) {
			this.HandleConnect.call(this,viewModel);
		} else {
			console.log(this._req_obj.name,"Connect event");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('SetInitializeFunction', function ( f ) {
		this.HandleInitialize = f;
	});	
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('Initialize', function () {
		if (this.HandleInitialize) {
			this.HandleInitialize.call(this);
		} else {
			console.log(this._req_obj.name,"Initialize event");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('SetLoadAssetsFunction', function ( f ) {
		this.HandleLoadAssets = f;
	});	
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('LoadAssets', function ( doneFunc ) {
		if (this.HandleLoadAssets) {
			this.HandleLoadAssets.call(this, doneFunc);
		} else {
			console.log(this._req_obj.name,"LoadAssets event");
			doneFunc.call(this);
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('SetConstructFunction', function ( f ) {
		this.HandleConstruct = f;
	});	
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('Construct', function () {
		if (this.HandleConstruct) {
			this.HandleConstruct.call(this);
		} else {
			console.log(this._req_obj.name,"Construct event");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('SetStartFunction', function ( f ) {
		this.HandleStart = f;
	});	
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('Start', function ( startTimeMs ) {
		this._runmode = GameLoop.RUNMODE_RUNNING;
		if (this.HandleStart) {
			this.HandleStart.call(this, startTimeMs);
		} else {
			console.log(this._req_obj.name,"Start event");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('SetStepFunction', function ( f ) {
		this.HandleStep = f;
	});	
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	GameLoop.method('Step', function ( intervalMs ) {
		if (this.HandleStep) {
			this.HandleStep.call(this, intervalMs);
		} else {
			console.log(this._req_obj.name,"Step event");
		}
	});


///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	var FACTORY = {};	// MGR, FACTORY, or CLASS
	FACTORY.name = "gamesys.api.gameloop";


///	GAMELOOP CREATION ///////////////////////////////////////////////////////

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Returns a pre-made GameLoop object to handle the MasterJS standard
	with defaults; just override with your own methods.
/*/	FACTORY.New = function ( name ) {
		return m_AddNewGameLoop (name);
	};


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/

	var m_loops = {};		// loop collection to ensure uniqueness


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/

	function m_AddNewGameLoop ( name ) {
		var loop = m_loops[name];
		if (loop) {
			console.error("GameLoop:",name.bracket(),"already exists");
			return null;
		} else {
			loop = new GameLoop(name);
			m_loops[name] = loop;
			return loop;
		}
	}


///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return FACTORY;
	
});
