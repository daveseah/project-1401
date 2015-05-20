/* behavior/tree.js */
define ([
	'1401/settings'
], function ( 
	SETTINGS
) {

	var DBGOUT = true;

/**	Behavior Tree ***********************************************************\

	A Behavior Tree (BT) structures a set of robot control nodes that are
	evaluated in a well-defined order. The control types are: 

		SELECTOR / PRIORITY - composite nodes that have children
		DECORATOR / CONDITION - modify SUCCESS/FAIL/RUNNING of children
		ACTION - where stuff it gets done! 

	BT children are evaluated from left-to-right, and always report one of
	three conditions: SUCCESS, FAIL or RUNNING. The reported conditions
	are propagated up from the leaf nodes of the BT.

	Project 1401's behavior tree implementation and terminology is inspired
	by Renato Pereira's behavior3js library, adapted to use 1401's piece
	and class hierarchy. See https://github.com/renatopp/behavior3js

	In 1401, the BehaviorTree object stores a root node and provides
	some convenience functions. The Execute() function is called during the
	global Piece.Update(). 


/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function BehaviorTree ( name, rootNode ) {
		this.id = BehaviorTree.idCounter++;
		this.name = name || 'behavior'+this.id.zeroPad(3);
		this.rootNode = rootNode || null;
	}

///	'static' properties //////////////////////////////////////////////////////
	BehaviorTree.idCounter = 1;

///	'enums' //////////////////////////////////////////////////////////////////

///	'methods' ///////////////////////////////////////////////////////////////

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Accessor for returning RootNode 
/*/	BehaviorTree.method('RootNode', function () {
		return this.rootNode;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Set all basenodes belonging to this tree to tree_id, which is used by
	BT nodes to create a unique object store
/*/	BehaviorTree.method('ImprintNodes', function () {
		m_temp = ".";
		m_RecursiveSetTreeID(this.id, this.rootNode);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	convenient way to do the Execute tick on the root node
/*/	BehaviorTree.method('Execute', function ( pish, interval_ms ){
		this.rootNode.Execute ( pish, interval_ms );
	});


///////////////////////////////////////////////////////////////////////////////
/** BEHAVIOR PRIVATE FUNCTIONS ***********************************************/

	// Functions should receive entire state in parameters, as stored values
	// in the object instances are not persistent because the same behavior
	// tree's nodes can be used across multiple agents. The blackboard is
	// what provides persistent memory

	var m_temp;
	function m_RecursiveSetTreeID ( treeID, node ) {
		console.log(m_temp,node.SetTreeID(treeID));
		var children = node.Children();
		m_temp += "..";
		for (var i=0;i<children.length;i++) {
			var child = children[i];
			console.log(m_temp,child.SetTreeID(treeID));
			if (child.HasChildren()) m_RecursiveSetTreeID(treeID, child);
		}
	}


///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/** RETURN CONSTRUCTOR *******************************************************/

	return BehaviorTree;

});