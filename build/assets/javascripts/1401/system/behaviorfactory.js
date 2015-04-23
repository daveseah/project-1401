/* behaviorfactory.js */
define ([
	'1401/settings',
	'1401/objects/behaviors/action',
	'1401/objects/behaviors/sequence'
], function ( 
	SETTINGS,
	ActionNode,
	SequenceNode
) {

	var DBGOUT = true;


/**	BehaviorFactory **********************************************************\

	This module implements behavior assigments and manages piece-ish (pish)
	properties.


/** MODULE PRIVATE VARIABLES *************************************************/



/** PUBLIC API ***************************************************************/

	var API = {};
	API.name = "behaviorfactory";

	var m_behaviors = [];
	var m_behaviornames = {};
	var m_defaultBehaviorTree = {};
	m_defaultBehaviorTree.Tick = function ( pish, interval_ms ) {
		console.log(pish.name,"null behavior tick",interval_ms);
	};

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Called by Master to initialize logic systems 
/*/	API.Initialize = function () {
	};

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.DefineBehaviorTree = function ( name, behaviorTree ) {
		if (!(name&&behaviorTree)) {
			console.error("Must pass a Name and a BehaviorTree. Aborting.");
			return;
		}
		name = name.toLowerCase();
		if (m_behaviornames[name]) {
			console.error("'"+name+"' already defined. Aborting.");
			return;
		}
		/* add behaviorTree */
		var index = m_behaviors.length;
		m_behaviors.push(behaviorTree);
		m_behaviornames[name]=index;
		if (DBGOUT) console.log("created",name.bracket(),"behavior id",index)
	};

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	assign behavior to piece. 
/*/	API.AssignBehavior = function ( pish, behaviorName ) {
		if (!(pish&&behaviorName)) {
			console.error("Must pass a Piece and Behavior Name. Aborting.");
			return;
		}
		behaviorName = behaviorName.toLowerCase();
		/* create behavior memory if it doesn't exist yet */
		if (pish.ai===null) {
			if (DBGOUT) console.log("creating AI memory for",pish.name.bracket());
			pish.ai = {};
			pish.ai.nodeMemory = {};
			pish.ai.treeMemory = {};
		}
		var bt = m_GetBehaviorTreeByName(behaviorName);
		if (bt) {
			pish.ai.behavior = bt;
		} else {
			console.error("behavior",behaviorName.squote(),"does not exist. Assigning null behavior to piece",pish.name.bracket());
			pish.ai.behavior = m_defaultBehaviorTree;		
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


	function m_GetBehaviorTreeByName(name) {
		name = name.toLowerCase();
		var index = m_behaviornames[name];
		if (index!==undefined) {
			return m_behaviors[index];
		} else {
			return undefined;
		}
	}

	/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	return API;


});