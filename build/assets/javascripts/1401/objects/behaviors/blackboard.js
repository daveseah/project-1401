/* objects.behavior.blackboard */
define ([
	'1401/objects/data/dictionary'
], function ( 
	Dictionary
) {

	var DBGOUT = true;

/**	Behavior Blackboard *****************************************************\

	A blackboard is the memory context for a behavior tree and its nodee, 
	since trees and nodes are reusable code instances that are reused by
	multiple agents.

	Each piece has a blackboard. The blackboard is erased when a new behavior
	tree is assigned. The piece properties itself can maintain persistent
	state.

	The blackboard itself has Get/Set methods for the overall tree (the
	behavior tree that's running) and GetLocal/SetLocal for the specific
	node, which takes tree_id and node_id. It's called from the BaseNode
	utility versions of Get/Set, invisibly passing these parameters so
	BT authors can assume its local memory. 

	Project 1401's behavior tree implementation and terminology is inspired
	by Renato Pereira's behavior3js library, adapted to use 1401's piece
	and class hierarchy. See https://github.com/renatopp/behavior3js
	

/** OBJECT DECLARATION ******************************************************/

	/*/ constructor /*/
	function Blackboard () {
		Dictionary.call(this);

		// defined in Dictionary
		// this.S = {};

	}
	/*/ constants /*/
	Blackboard.ISOPEN = '_open';
	/*/ inheritance /*/
	Blackboard.inheritsFrom (Dictionary);

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
///	Dictionary.method('Set', function ( key, value )
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
///	Dictionary.method('Get', function ( key ) 
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('GetLocal', function ( tree_id, node_id, key ){
		return this.Get(tree_id+':'+node_id+':'+key);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Blackboard.method('SetLocal', function ( tree_id, node_id, key, value ){
		this.Set(tree_id+':'+node_id+':'+key, value);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/



/** RETURN CONSTRUCTOR *******************************************************/

	return Blackboard;

});
