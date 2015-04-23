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

	piece contains aibehavior (the tree) and aimemory for tree.

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
	var pishMem;		// AIMem of piece-ish
	var pishNodeMem;	// AIMem for this node_id for this piece
	var pishState;		// AIMem state of piece-ish

/*** overrideable methods ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	BaseNode.method('Open', function ( pish, intervalMs ) {
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	BaseNode.method('Tick', function ( pish, intervalMs ) {
		if (DBGOUT) console.log('tick BT<'+this.id+"> on",pish.name.bracket());
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	BaseNode.method('Close', function ( pish, intervalMs ) {
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*** runtime status helpers ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	BaseNode.method('NeedsInit', function ( pish ) { 
		pishState = pish.AI.NodeMemory.state;
		if (pishState) {
			return pishState===BaseNode.INIT_ME
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