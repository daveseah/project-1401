/* system-loop.js */
define ([
], function ( 
) {

	var DBGOUT = false;

///////////////////////////////////////////////////////////////////////////////
/**	API SYSLOOP *************************************************************\

	This module creates a "SysLoop" object that is used by any module
	that needs to manage asset loading and connections with other high-level
	game modules and systems. Typically this is "Activity", and any activity
	submodules. It provides pre-defined handlers so you can 
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
	function SysLoop ( name ) {
		if (typeof name === 'string') {
			this.name = name;
		} else {
			console.error("SysLoop constructor requires string");
		}
		this.HandleConnect = null;
		this.HandleInitialize = null;
		this.HandleLoadAssets = null;
		this.HandleConstruct = null;
		this.HandleStart = null;
		this.HandleUpdate = null;
		this.processInput = false;
		this.HandleInput = null;
		this.processAI = false;
		this.HandleThink = null;
		this.HandleOverThink = null;
		this.HandleExecute = null;
		this.HandleChangeStage = null;

		this._runmode = SysLoop.RUNMODE_INIT;
	}
	/* constants */
	SysLoop.RUNMODE_INIT = 0;
	SysLoop.RUNMODE_RUNNING = 1;
	SysLoop.RUNMODE_PAUSED = 2;
	SysLoop.RUNMODE_EXIT = 3;
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
			case 'update':
				this.HandleUpdate = f;
				break;
			default:
				console.error('SYSTEMLOOP:','unknown handler',type.bracket());
				break;
		}
	});	

/**	FEATURE ENABLING FUNCTIONS **********************************************/
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('EnableAI', function ( flag ) {
		if (flag===undefined) flag = true;
		this.processAI = flag;
	});
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SysLoop.method('EnableInput', function ( flag ) {
		if (flag===undefined) flag = true;
		this.processInput = flag;
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
/*/	ChangeStage() is called indirectly via onChange of the current
	stage selector dropdown, which is handled by activity.js which
	eventually calls SYSLOOP.ChangeStageAll(). This calls all the ChangeStage
	handlers it knows about, and is dispatcehd through this method.
	It is also called after Sysloop.Construct(), but before Sysloop.Start().
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

	var m_loops = {};		// loop collection to ensure uniqueness
	var m_master_loop;		// the master loop that is run first


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
