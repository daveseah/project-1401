/* objects.behavior.treememory */
define ([
	'1401/objects/logic/memory'
], function ( 
	Memory
) {

	var DBGOUT = true;

/**	TreeMemory **************************************************************\

	Derived from Memory (a dictionary), TreeMemory is used to manage tree-
	level memory operations for behavior trees.


/** OBJECT DECLARATION ******************************************************/

	/*/ constructor /*/
	function TreeMemory () {
		// call parent constructor
		Memory.call(this);
		// defined in Memory
		// this.S = {};
	}
	/*/ constants /*/
	/*/ inheritance /*/
	TreeMemory.inheritsFrom(Memory);
	// Set ( key, value )
	// Get ( key )


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/



/** RETURN CONSTRUCTOR *******************************************************/

	return TreeMemory;

});
