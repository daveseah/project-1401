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

	BaseNode is not created directly, but is subclassed into the Action,
	Sequence, Priority, Decorator, and Condition node types.

	There are 5 types of events that are propagated through a BehaviorTree
	for every "tick" of the AI clock through a call to Execute()
		Enter - called first
		Open - called once when node is first entered
		Tick - returns RUNNING, SUCCESS, or FAIL
		Close - called when SUCCESS or FAIL condition met
		Exit - called last
	The piece and interval_ms since the last call are passed to each event.

	All behavior node instances are REUSABLE across behavior trees, so it's
	important NOT to store state as instance properties inheriting classes.
	Use the blackboard! 
		this.BBGet (pish, key) 
		this.Set (pish, key, value)
	The Get/Set methods in BaseNode use the tree and node ids to create a unique
	key hash within the blackboard. See blackboard.js for more information.

	To avoid growing the heap, avoid declaring var in any of the events.

	Project 1401's behavior tree implementation and terminology is inspired
	by Renato Pereira's behavior3js library, adapted to use 1401's piece
	and class hierarchy. See https://github.com/renatopp/behavior3js


/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function BaseNode ( tree_id ) {
		// each node has a unique id and an associated tree
		this.id = BaseNode.idCounter++;
		this.tree_id = tree_id || 0;
		// each node potentially has children
		this.children = [];

		// each node has a name and description
		this.name = 'bsn'+this.id.zeroPad(3);
		this.description = 'basenode';
	}

///	'static' properties /////////////////////////////////////////////////////
	BaseNode.idCounter = 1;

///	'enums' /////////////////////////////////////////////////////////////////
	BaseNode.RUNNING 	= 1;
	BaseNode.SUCCESS 	= 2;
	BaseNode.FAILURE 	= 3;
///	'flags' /////////////////////////////////////////////////////////////////
	BaseNode.IS_OPEN	= '_isopen';


///	'methods' ///////////////////////////////////////////////////////////////

	/* avoid heap-allocation with reusable variables */
	/* values are not persistent; must refresh every tick! */
	var x_blackboard;		// scratch memory for AI in piece
	var x_tree_id;			// scratch variable for tree id
	var x_state;			// running state of piece-ish


///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Set the TreeID that owns this basenode, which is used to create a hash
	key for indexing into the blackboard (necessary for subtree support)
/*/	BaseNode.method('SetTreeID', function ( treeID ) {
		this.tree_id = treeID;
		return "TREE["+treeID+"] -->"+this.name.bracket();
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Return the children node array for this basenode. It may be empty.
/*/	BaseNode.method('Children', function () {
		return this.children;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Utility to return length of the children node array
/*/	BaseNode.method('HasChildren', function () {
		return (this.children.length > 0);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Utility to return the master time from SETTINGS
/*/	BaseNode.method('MasterTime', function () {
		return SETTINGS.MasterTime();
	});

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	wrapper for blackboard.GetLocal to simplify access during authoring
/*/	BaseNode.method('BBGet', function ( pish, key ) {
		// console.log(pish.ai.behavior.id+':'+this.id+':'+key);
		return pish.ai.blackboard.GetLocal(pish.ai.behavior.id, this.id, key);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	wrapper for blackboard.SetLocal to simplify access during authoring
/*/	BaseNode.method('BBSet', function ( pish, key, value ) {
		// console.log(pish.ai.behavior.id+':'+this.id+':'+key);
		pish.ai.blackboard.SetLocal(pish.ai.behavior.id, this.id, key, value);
	});


///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Main method for handling "ticks" to the AI. There are five events:
	enter, open, tick, close, and exit.
	Note: 
	.. pish.ai has .blackboard store unique to the piece-ish.
	.. Execute is propagated to every child BT node
	.. Tick does work and returns status, but does not propagate the signal
	.. node state is stored in pish.ai.blackboard[tree_id+node_id] 	
/*/ BaseNode.method('Execute', function ( pish, interval_ms ) {

		// always call "enter"
		this.Enter(pish);

		// if first-time running, call "open"
		if (!this.BBGet(pish, BaseNode.IS_OPEN)) {
			this.BBSet(pish, BaseNode.IS_OPEN, true);
			this.Open(pish);
		}

		// execute the behavior code and check if it succeeded
		state = this.Tick(pish);

		// if the node isn't still running, then call "close"
		if (state !== BaseNode.RUNNING) {
			this.BBSet(pish, BaseNode.IS_OPEN, false);
			this.Close(pish);
		}

		// always call "exit"
		this.Exit(pish);

		// return state to whoever called Execute.
		return state; 

	});


/// OVERRIDEABLE METHODS /////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	do execution management on entry of this node
/*/	BaseNode.method('Enter', function ( pish ) {
		// code that happens before every tick
		// console.log(this.id,"enter",pish.name.bracket());
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	initialize the node data structures in prep for running
/*/	BaseNode.method('Open', function ( pish ) {
		// setup that happens just once
		// console.log(this.id,"open",pish.name.bracket());
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	call periodically if RUNNING until return SUCCESS, FAILURE
/*/	BaseNode.method('Tick', function ( pish ) {
		// execute every tick, must return status
		// console.log("this.id,tick",pish.name.bracket());
		return BaseNode.RUNNING;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	clean up node data structures when run has completed SUCCESS or FAIL
/*/	BaseNode.method('Close', function ( pish ) {
		// console.log(this.id,"close",pish.name.bracket());
		// cleanup that happens once success/failure occurs
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	do execution management on exit of this node
/*/	BaseNode.method('Exit', function ( pish ) {
		// console.log(this.id,"exit",pish.name.bracket());
		// code that happens after every tick
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


///////////////////////////////////////////////////////////////////////////////
/** BEHAVIOR PRIVATE FUNCTIONS ***********************************************/



/** RETURN CONSTRUCTOR *******************************************************/

	return BaseNode;

});