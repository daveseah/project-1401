/* objects.behavior.blackboard */
define ([
	'1401/objects/data/dictionary'
], function ( 
	Dictionary
) {

	var DBGOUT = true;

/**	Behavior Blackboard *****************************************************\

	A blackboard is the memory context for a behavior tree and its nodes. 

	Each piece has a Blackboard which is used for providing a local storage
	context for each in the piece's BehaviorTree (BT). The Blackboard is
	also used to save execution context for each agent's BT.

	The blackboard itself has Get/Set methods for the overall piece.
	For nodes, their local storage is acccess with LocalMemGet/LocalMemSet.
	For all top-level trees, TreeMemGet/TreeMemSet accepts a key;

	- 

   	Project 1401's behavior tree implementation and terminology is inspired
    by Renato Pereira's Behavior Tree tutorials, adapted to use 1401's piece
    and class hierarchy. See https://github.com/behavior3/behavior3js for
    his own implementation of Behavior Trees!	


///////////////////////////////////////////////////////////////////////////////
/** OBJECT DECLARATION ******************************************************/

	/*/ constructor /*/
	function Blackboard () {
		Dictionary.call(this);
		// keep track of tree path for subtree
		this.tree_path = [];
	}
	/*/ constants /*/
	Blackboard.ISOPEN = '_open';
	/*/ inheritance /*/
	Blackboard.inheritsFrom (Dictionary);


///	OVERRIDDEN METHODS //////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('Erase', function () {
		Dictionary.prototype.Erase.call(this);
		this.tree_path = [];		
	});


/// GLOBAL TREE STORAGE /////////////////////////////////////////////////////
	var m_treemem = {};		// global all trees


/// ALL TREE SHARED MEMORY //////////////////////////////////////////////////
/// use only for shared tree properties and settings
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('TreeMemGet', function ( tree_id, key ) {
		return m_treemem[tree_id+":"+key];
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('TreeMemSet', function ( tree_id, key, value ) {
		m_treemem[tree_id+':'+key] = value;
	});


///	AGENT-WIDE MEMORY MEMORY ////////////////////////////////////////////////
/// use for AI-related agent state used by all nodes in the BT
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('AgentMemGet', function ( key ) {
		return this.Get('AM_'+key);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('AgentMemSet', function ( key, value ) {
		this.Set('AM_'+key, value);
	});


///	UNIQUE NODE MEMORY //////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('NodeMemGet', function ( node_id, key ){
		var tree_id = this.TreePath();
		return this.Get(tree_id+':'+node_id+':'+key);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('NodeMemSet', function ( node_id, key, value ){
		var tree_id = this.TreePath();
		this.Set(tree_id+':'+node_id+':'+key, value);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


/// SUBTREE PATH SUPPORT ////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('TreePathPush', function ( tree ) {
		this.tree_path.push( tree.id );
		return tree.id;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('TreePathPop', function() {
		return this.tree_path.pop();
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('TreePath', function () {
		return this.tree_path.join(':');
	});


///////////////////////////////////////////////////////////////////////////////
/** RETURN CONSTRUCTOR *******************************************************/
	return Blackboard;

});
