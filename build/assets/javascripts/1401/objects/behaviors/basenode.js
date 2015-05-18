/* basenode.js */
define ([
	'1401/settings'
], function ( 
	SETTINGS
) {

	var DBGOUT = true;

/**	Behavior BaseNode *******************************************************\

	The BaseNode implements the common runtime functions of a BehaviorTree-
	style node. Each node is like a mini program, and it needs a reference
	to the parent behavior tree, the piece instance, and the time. 

	note: piece contains aibehavior (the tree) and aimemory for tree.

	Every basenode is initialized at game starts by calling it Initialize()
	state.

	All behavior node instances are reusable across behavior trees, so it's
	important not to store state as properties in the class or its inheriting
	classes. Store them in the piece's aimem.


/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function BaseNode () {
		// each node has a unique id for piece.aimemory
		this.id = BaseNode.idCounter++;
		// each node has a name
		this.name = 'basenode'+this.id.zeroPad(3);
		this.description = 'basenode';
		
		/* initial state */
		// store state in piece.aimemory
		// see m_GetNodeMemory

	}

///	'static' properties /////////////////////////////////////////////////////
	BaseNode.idCounter = 1;

///	'enums' /////////////////////////////////////////////////////////////////
	BaseNode.INIT_ME 	= 0;
	BaseNode.RUNNING 	= 1;
	BaseNode.SUCCESS 	= 2;
	BaseNode.FAILURE 	= 3;


///	'methods' ///////////////////////////////////////////////////////////////

	/* avoid heap-allocation with reusable variables */
	var pishTreeMem;	// AIMem of piece-ish
	var pishNodeMem;	// AIMem for this node_id for this piece
	var pishState;		// running state of piece-ish

/*** master execute method ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Main method for handling "ticks" to the AI. There are five events:
	enter, open, tick, close, and exit.
	Note that pish.ai has .treeMemory and .nodeMemory stores.
	Execute is propagated to every child node.
	Tick is the method that does work and returns status, but tick does
	not propagate the signal. 	
/*/ BaseNode.method('Execute', function ( pish, interval_ms ) {
		
		pishTreeMem = pish.ai.treeMemory;
		pishNodeMem = pish.ai.nodeMemory;

		if ( pishTreeMem && pishNodeMem ) {

			// always call "enter" for sys maintenance
			this.Enter(pish);

			// if first-time running, call "open"
			if (!pishNodeMem.OpenFlag()) {
				this.Open(pish);
				pishNodeMem.OpenFlagSet(false);
			}

			// execute the behavior code and check if it succeeded
			pishState = this.Tick(pish);

			// if the node isn't still running, then call "close"
			if (pishState !== BaseNode.RUNNING) this.Close(pish);

			// always call "exit" to do sys maintenance
			this.Exit(pish);

			// return state to whoever called Execute.
			return pishState; 

		} else {

			console.error(pish.name.bracket(),"does not have ai memory");

		}

	});
/*** overrideable methods ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	do execution management on entry of this node
/*/	BaseNode.method('Enter', function ( pish ) {
		// if (DBGOUT) console.log('enter BT<'+this.id+'> on',pish.name.bracket());
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	initialize the node data structures in prep for running
/*/	BaseNode.method('Open', function ( pish ) {
		if (DBGOUT) console.log('open BT<'+this.id+'> on',pish.name.bracket());
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	call periodically if RUNNING until return SUCCESS, FAILURE
/*/	BaseNode.method('Tick', function ( pish ) {
		if (DBGOUT) console.log('tick BT<'+this.id+'> on',pish.name.bracket());
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	clean up node data structures when run has completed SUCCESS or FAIL
/*/	BaseNode.method('Close', function ( pish ) {
		if (DBGOUT) console.log('close BT<'+this.id+'> on',pish.name.bracket());
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	do execution management on exit of this node
/*/	BaseNode.method('Exit', function ( pish ) {
		// if (DBGOUT) console.log('exit BT<'+this.id+'> on',pish.name.bracket());
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*** runtime status helpers ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	BaseNode.method('NeedsInit', function ( pish ) { 
		pishState = pish.AI.NodeMemory.state;
		if (pishState) {
			return pishState===BaseNode.INIT_ME;
		} else {
			if (DBGOUT) console.error("undefined piece-ish AIMem state");
		}
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	BaseNode.method('IsRunning', function ( pish ) {
		pishState = pish.AI.NodeMemory.state;
		if (pishState) {
			return pishState===BaseNode.RUNNING;
		} else {
			if (DBGOUT) console.error("undefined piece-ish AIMem state");
		}
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	BaseNode.method('IsSucceed', function ( pish ) {
		pishState = pish.AI.NodeMemory.state;
		if (pishState) {
			return pishState===BaseNode.SUCCESS;
		} else {
			if (DBGOUT) console.error("undefined piece-ish AIMem state");
		}
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	BaseNode.method('IsFail', function ( pish ) {
		pishState = pish.AI.NodeMemory.state;
		if (pishState) {
			return pishState===BaseNode.FAILURE;
		} else {
			if (DBGOUT) console.error("undefined piece-ish AIMem state");
		}
	});


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/



/** RETURN CONSTRUCTOR *******************************************************/

	return BaseNode;

});