/* behaviorfactory.js */
define ([
	'1401/settings',
	'1401/objects/behaviors/tree',
	'1401/objects/behaviors/basenode',
	'1401/objects/behaviors/action',
	'1401/objects/behaviors/sequence',
	'1401/objects/behaviors/priority',
	'1401/objects/behaviors/blackboard'

], function ( 
	SETTINGS,
	BehaviorTree,
	BaseNode,
	ActionNode,
	SequenceNode,
	PriorityNode,
	Blackboard
) {

	var DBGOUT = true;


/**	BehaviorFactory **********************************************************\

	This module implements behavior assigments and manages piece-ish (pish)
	properties. This keeps AI-specific code out of the Piece classes.

	BehaviorFactory uses the Piece.ai property, attaching a "BehaviorTree"
	and a "Blackboard" as ai.behavior and ai.blackboard respectively.

	There are two main methods:

*	DefineBehavior() stores a named behavior tree (BT) for use by multiple
	pieces. Only one instance of a particular named BT exists at a time,
	though multiple pieces may use it. Because there is only a single BT
	instance, local variables can't be implemented in the usual way; the
	blackboard data structure provides this.

*	AssignBehavior() assigns a previously-defined BT to a piece, initializing
	its ai.behavior and ai.blackboard properties. The blackboard is cleared
	whenever a BT is assigned to a piece.

	BehaviorFactory is also used to gain access to the various constructors for
	BT nodes. They can be extended to create custom action, decorator, and
	condition nodes:

		function MyActionNode () {
			// call parent constructor
			BehaviorFactory.ActionNode.call(this);
			...
		}
		// set up inheritance
		MyActionNode.inheritsFrom(BehaviorFactory.ActionNode);
		// define or override new methods
		MyActionNode.method('Open',function(){...});

	BehaviorFactory may eventually handle loading/saving of behavior trees,
	though I am not sure how that would work with actual authoring.

	Project 1401's behavior tree implementation and terminology is inspired
	by Renato Pereira's behavior3js library, adapted to use 1401's piece
	and class hierarchy. See https://github.com/renatopp/behavior3js


/** MODULE PRIVATE VARIABLES *************************************************/



/** PUBLIC API ***************************************************************/

	var API = {};
	API.name = "behaviorfactory";
	API.SUCCESS = BaseNode.SUCCESS;
	API.FAILURE = BaseNode.FAILURE;
	API.RUNNING = BaseNode.RUNNING;

	// store behavior tree roots in an indexed array for speed
	// dictionary looks-up indexes in m_trees
	var m_behaviors = [];

	// create a default dumb tree object
	// TODO: should use an action node
	var m_default_tree = {};
	m_default_tree.Tick = function ( pish, interval_ms ) {
		console.log(pish.name,"null behavior tick",interval_ms);
	};

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Called by Master to initialize logic systems 
/*/	API.Initialize = function () {
	};

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	define a named behavior with a name and a btreeRoot
/*/	API.DefineBehavior = function ( name, btreeRoot ) {
		if ( !(name && btreeRoot) ) {
			console.error("Must pass a Name and a BehaviorTree. Aborting.");
			return;
		}
		// create tree
		name = name.toLowerCase();
		var btree = new BehaviorTree ( name, btreeRoot );
		if (m_behaviors[name]) {
			console.error("'"+name+"' already defined. Aborting.");
			return;
		}
		if (DBGOUT) console.log("creating behavior",name.bracket());
		/* imprint nodes with treeid */
		btree.ImprintNodes();
		/* add behaviorTree */
		m_behaviors[name] = btree;
	};

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	assign behavior to piece. 
/*/	API.AssignBehavior = function ( name, pish ) {
		if ( !(pish && name) ) {
			console.error("Must pass the Name of behavior and a piece. Aborting.");
			return;
		}
		name = name.toLowerCase();
		/* create behavior memory if it doesn't exist yet */
		if (pish.ai===null) {
			if (DBGOUT) console.log("creating blackboard for",pish.name.bracket());
			pish.ai = {};
			pish.ai.blackboard = new Blackboard ();
		}
		// reset the blackboard to be blank
		pish.ai.blackboard.Erase();

		// retrieve the named behavior tree and assign it
		var bt = m_behaviors[name];
		if (bt) {
			pish.ai.behavior = bt;
			console.log("assigned behavior",name.bracket(),"to",pish.name.bracket());
		} else {
			console.error("behavior",name.squote(),"does not exist. Assigning null behavior to piece",pish.name.bracket());
			pish.ai.behavior = m_default_tree;		
		}
	};

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.Sequence = function ( children ) {
		return new SequenceNode(children);
	};
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.Priority = function ( children ) {
		return new PriorityNode(children);
	};
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.Action = function ( testflag ) {
		return new ActionNode(testflag);
	};


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/

	function m_GetBehaviorTreeByName(name) {
		name = name.toLowerCase();
		var index = m_behavior_names[name];
		if (index!==undefined) {
				// store behavior tree roots in an indexed array for speed of lookup
				// 
			return m_trees[index];
		} else {
			return undefined;
		}
	}
		

/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	return API;


});