/* behaviorfactory.js */
define ([
	'1401/settings',
	'1401/objects/behaviors/tree',
	'1401/objects/behaviors/action',
	'1401/objects/behaviors/sequence',
	'1401/objects/behaviors/nodememory',
	'1401/objects/behaviors/treememory'

], function ( 
	SETTINGS,
	BehaviorTree,
	ActionNode,
	SequenceNode,
	NodeMemory,
	TreeMemory
) {

	var DBGOUT = true;


/**	BehaviorFactory **********************************************************\

	This module implements behavior assigments and manages piece-ish (pish)
	properties.


/** MODULE PRIVATE VARIABLES *************************************************/



/** PUBLIC API ***************************************************************/

	var API = {};
	API.name = "behaviorfactory";

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
		/* add behaviorTree */
		m_behaviors[name] = btree;
		if (DBGOUT) console.log("created",name.bracket());
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
			if (DBGOUT) console.log("creating AI memory for",pish.name.bracket());
			pish.ai = {};
			pish.ai.nodeMemory = new NodeMemory();
			pish.ai.treeMemory = new TreeMemory();
		}
		var bt = m_behaviors[name];
		if (bt) {
			pish.ai.behavior = bt;
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
	API.Action = function () {
		return new ActionNode();
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