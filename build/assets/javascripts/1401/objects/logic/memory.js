/* objects.logic.memory */
define ([
], function ( 
) {

	var DBGOUT = true;

/**	Memory ******************************************************************\

	Implementation of a dictionary, useful baseclass for Behavior NodeMemory,
	but possibly useful in other situations.


/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function Memory () {
		this.S = {};
	}

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Set the value of a key
/*/	Memory.method('Set', function ( key, value ) { 
		this.S[key] = value;
	});

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Get the value of a key
/*/	Memory.method('Get', function ( key ) {
		return this.S[key];
	});


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/



/** RETURN CONSTRUCTOR *******************************************************/

	return Memory;

});
