/* objects.behavior.nodememory */
define ([
	'1401/objects/logic/memory'
], function ( 
	Memory
) {

	var DBGOUT = true;

/**	Behavior BaseNode *******************************************************\

	Implementation of a dictionary, specifically for use as AI node memory,
	but possibly useful in other situations.


/** OBJECT DECLARATION ******************************************************/

	/*/ constructor /*/
	function NodeMemory () {
		// call parent constructor
		Memory.call(this);
		// defined in Memory
		// this.S = {};

		// nodememory-specific settings
		this.S[NodeMemory.ISOPEN] = false;
	}
	/*/ constants /*/
	NodeMemory.ISOPEN = '_open';
	/*/ inheritance /*/
	NodeMemory.inheritsFrom(Memory);
	// Set ( key, value )
	// Get ( key )


///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	NodeMemory.method('OpenFlag', function () {
		return this.S[NodeMemory.ISOPEN];
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	NodeMemory.method('OpenFlagSet', function ( val ) {
		this.S[NodeMemory.ISOPEN] = val;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	NodeMemory.method('ResetAllFlags', function () {
		this.S[NodeMemory.ISOPEN] = false;
	});


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/



/** RETURN CONSTRUCTOR *******************************************************/

	return NodeMemory;

});
