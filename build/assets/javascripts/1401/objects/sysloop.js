/* sysloop.js */
define ([
], function ( 
) {

	var DBGOUT = false;

///////////////////////////////////////////////////////////////////////////////
/**	API SYSLOOP *************************************************************\

	This module creates a "SysLoop" object that codifies the main lifetime
	and runtime events for the game system so you don't have to type out a
	lot of boilerplate. 

	The order of LIFETIME operations in the game loop is as follows:

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
	
	Additionally, the RUNTIME operations that are supported are:

	GetInput 	received input notification
	Update 		Called from within Step after GetInput and before Think.
	Think 		time to process AI on your module
	OverThink 	time to override any thoughts of managed pieces
	Execute 	time to execute actual action commands

	Note that you need to call EnableUpdate(), EnableInput() and EnableAI() for
	runtime calls to be made. 

	EXAMPLE:

	Assuming module is imported as SYSLOOP:
		var OBJ = SYSLOOP.New ('name')
		OBJ.SetHandler('Connect', function_object );
		etc...

	SYSLOOP keeps track of all loop objects that have been created, and MASTER
	calls module's ConnectAll(), InitializeAll(), etc so game-main.js doesn't
	have to. If you use SYSLOOP to create your own modules, you also don't
	have to worry about it either. You do have to be mindful, though, that
	the order of phases (e.g. input, update, think) is not guaranteed.
	If you need to be sure, don't use SYSLOOP for your module, and implement 
	the calls yourself.

	IMPORTANT:

	The game-main.js file should use the following call to establish itself
	as the prime game loop:

		var MAIN = SYSLOOP.InitializeGame('name');

	This ensures that it is always called before all other SYSLOOP modules.
	It should only be called once in the lifetime of the game.


///////////////////////////////////////////////////////////////////////////////
/** SUPPORT CLASS ************************************************************/

	/* constructor */
	function SysLoop ( name ) {
		if (typeof name === 'string') {
			this.name = name;
		} else {
			console.error("SysLoop constructor requires string");
		}
		// lifetime
		this.HandleConnect = null;
		this.HandleInitialize = null;
		this.HandleLoadAssets = null;
		this.HandleConstruct = null;
		this.HandleStart = null;
		this.HandleStep = null;
		this.HandleStop = null;
		this.HandlePause = null;
		// runtime
		this.processInput = false;
		this.processAI = false;
		this.processUpdate = false;
		this.HandleInput = null;
		this.HandleUpdate = null;
		this.HandleThink = null;
		this.HandleOverThink = null;
		this.HandleExecute = null;
		// events
		this.HandleChangeStage = null;
		// current runmode
		this._runmode = SysLoop.RUNMODE_INIT;
	}
	/* constants */
	SysLoop.RUNMODE_INIT 	= 0;
	SysLoop.RUNMODE_RUNNING = 1;
	SysLoop.RUNMODE_PAUSED 	= 2;
	SysLoop.RUNMODE_EXITING = 3;
	SysLoop.RUNMODE_STOPPED = 4;
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('IsRunning', function () { 
		return (this._runmode==SysLoop.RUNMODE_RUNNING);
	});

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('SetHandler', function ( type, f ) {
		console.assert(typeof f === 'function',"must past a function handler!");
		type = type || 'undefined';
		type = type.toLowerCase();
		switch (type) {
			// lifetime
			case 'connect':
				this.HandleConnect = f;
				break;
			case 'initialize':
				this.HandleInitialize = f;
				break;
			case 'loadassets':
				this.HandleLoadAssets = f;
				break;
			case 'construct':
				this.HandleConstruct = f;
				break;
			case 'start':
				this.HandleStart = f;
				break;
			case 'step':
				this.HandleStep = f;
				break;
			// runtime
			case 'update':
				this.HandleUpdate = f;
				break;
			case 'getinput':
				this.HandleInput = f;
				break;
			case 'think':
				this.HandleThink = f;
				break;
			case 'overthink':
				this.HandleOverThink = f;
				break;
			case 'execute':
				this.HandleExecute = f;
				break;
			default:
				console.error('SYSTEMLOOP:','unknown handler',type.bracket());
				break;
		}
	});	

/**	FEATURE ENABLING FUNCTIONS **********************************************/
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('EnableAI', function ( flag ) {
		flag = flag || true;
		this.processAI = flag;
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('EnableInput', function ( flag ) {
		flag = flag || true;
		this.processInput = flag;
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('EnableUpdate', function ( flag ) {
		flag = flag || true;
		this.processUpdate = flag;
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('EnableDebug', function ( flag ) {
		flag = flag || true;
		DBGOUT = flag;
	});

/**	INITIALIZATION FUNCTIONS ************************************************/
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('Connect', function ( viewModel ) {
		if (this.HandleConnect) {
			this.HandleConnect.call(this,viewModel);
		} else {
			console.log(this.name,"Connect: no handler defined");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('Initialize', function () {
		if (this.HandleInitialize) {
			this.HandleInitialize.call(this);
		} else {
			if (DBGOUT) console.log(this.name,"Initialize: no handler defined");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('LoadAssets', function ( doneFunc ) {
		if (this.HandleLoadAssets) {
			this.HandleLoadAssets.call(this, doneFunc);
		} else {
			if (DBGOUT) console.log(this.name,"LoadAssets: no handler defined");
			doneFunc.call(this);
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('Construct', function () {
		if (this.HandleConstruct) {
			this.HandleConstruct.call(this);
		} else {
			if (DBGOUT) console.log(this.name,"Construct: no handler defined");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('Start', function ( startTimeMs ) {
		this._runmode = SysLoop.RUNMODE_RUNNING;
		if (this.HandleStart) {
			this.HandleStart.call(this, startTimeMs);
		} else {
			if (DBGOUT) console.log(this.name,"Start: no handler defined");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('Step', function ( intervalMs ) {
		if (this.HandleStep) {
			this.HandleStep.call(this, intervalMs);
		} else {
			if (DBGOUT) console.log(this.name,"Step: no handler defined");
		}
	});

/**	STEP FUNCTIONS **********************************************************/
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('GetInput', function ( intervalMs ) {
		if (!this.processInput) return;
		if (this.HandleInput) {
			this.HandleInput.call(this, intervalMs);
		} else {
			if (DBGOUT) console.log(this.name,"GetInput: no handler defined");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('Update', function ( intervalMs ) {
		if (!this.processUpdate) return;
		if (this.HandleUpdate) {
			this.HandleUpdate.call(this, intervalMs);
		} else {
			if (DBGOUT) console.log(this.name,"Update: no handler defined");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('Think', function ( intervalMs ) {
		if (!this.processAI) return;
		if (this.HandleThink) {
			this.HandleThink.call(this, intervalMs);
		} else {
			if (DBGOUT) console.log(this.name,"Think: no handler defined");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('OverThink', function ( intervalMs ) {
		if (!this.processAI) return;
		if (this.HandleOverThink) {
			this.HandleOverThink.call(this, intervalMs);
		} else {
			if (DBGOUT) console.log(this.name,"OverThink: no handler defined");
		}
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('Execute', function ( intervalMs ) {
		if (!this.processAI) return;
		if (this.HandleExecute) {
			this.HandleExecute.call(this, intervalMs);
		} else {
			if (DBGOUT) console.log(this.name,"Execute: no handler defined");
		}
	});


//////////////////////////////////////////////////////////////////////////////
/**	EVENT FUNCTIONS *********************************************************/

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	ChangeStage() stub for levels
/*/	SysLoop.method('ChangeStage', function ( stage_id ) {
		if (this.HandleChangeStage) {
			this.HandleChangeStage.call(this, stage_id);
		} else {
			if (DBGOUT) console.log(this.name,"ChangeStage: no handler defined");
		}
	});


//////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	var FACTORY = {};	// MGR, FACTORY, or CLASS
	FACTORY.name = "SysLoop";


///	SysLoop CREATION ///////////////////////////////////////////////////////

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Returns a pre-made SysLoop object to handle the MasterJS standard
	with defaults; just override with your own methods.
/*/	FACTORY.New = function ( name ) {
		return m_AddNewSysLoop (name);
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	The Main Loop is executed first!
/*/	FACTORY.InitializeGame = function ( name ) {
		if (m_master_loop) {
			console.error('Game already initialized; did you mean to call "New" instead?');
			return;
		}
		m_master_loop = new SysLoop(name);
		console.info("master game loop",m_master_loop.name,"initialized!");
		return m_master_loop;
	};


///	STAGE CHANGE EVERYONG ///////////////////////////////////////////////////
	FACTORY.ChangeStageAll = function ( stage_id ) {
		m_master_loop.ChangeStage(stage_id);
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].ChangeStage(stage_id);
		}
	};

///	SYSTEM CALL EVERYONE ////////////////////////////////////////////////////
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FACTORY.ConnectAll = function ( viewmodel ) {
		m_master_loop.Connect(viewmodel);
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].Connect(viewmodel);
		}
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FACTORY.InitializeAll = function ( ) {
		m_master_loop.Initialize();
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].Initialize();
		}
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FACTORY.LoadAssetsAll = function ( doneCallback ) {
		m_master_loop.LoadAssets(doneCallback);
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].LoadAssets(doneCallback);
		}
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FACTORY.ConstructAll = function ( ) {
		m_master_loop.Construct();
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].Construct();
		}
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FACTORY.StartAll = function ( start_ms ) {
		m_master_loop.Start(start_ms);
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].Start(start_ms);
		}
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FACTORY.GetInputAll = function ( ms ) {
		m_master_loop.GetInput(ms);
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].GetInput(ms);
		}
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FACTORY.UpdateAll = function ( ms ) {
		m_master_loop.Update(ms);
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].Update(ms);
		}
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FACTORY.ThinkAll = function ( ms ) {
		m_master_loop.Think(ms);
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].Think(ms);
		}
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FACTORY.OverThinkAll = function ( ms ) {
		m_master_loop.OverThink(ms);
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].OverThink(ms);
		}
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	FACTORY.ExecuteAll = function ( ms ) {
		m_master_loop.Execute(ms);
		var arr = m_LoopsArray();
		for (var i=0;i<arr.length;i++) {
			m_loops[arr[i]].Execute(ms);
		}
	};


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/

	var m_master_loop;		// the master loop that is run first
	var m_loops = {};		// loop collection to ensure uniqueness


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_AddNewSysLoop ( name ) {
		var loop = m_loops[name];
		if (loop) {
			console.error("A loop module named",name.bracket(),"already declared");
			return null;
		} else {
			loop = new SysLoop(name);
			m_loops[name] = loop;
			return loop;
		}
	}
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_LoopsArray () {
		return Object.keys(m_loops);
	}


///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return FACTORY;
	
});
