/* action.js */
define ([
	'1401/settings',
	'1401/objects/behaviors/basenode'
], function ( 
	SETTINGS,
	BaseNode
) {

	var DBGOUT = true;

/**	ActionNode **************************************************************\

	This is an example implementation of an Action node, which performs
	its useful action.

	To access blackboard:

/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function ActionNode ( testflag ) {

		//	call the parent constructor		
		BaseNode.call (this);

		// each node has a name
		this.name = 'act'+this.id.zeroPad(3);
		this.description = 'action node';

		// make a "succeeder" or "failurer" or "runner"
		switch (testflag) {
			case BaseNode.SUCCESS:
			case BaseNode.FAILURE:
			case BaseNode.RUNNING:
				this.testReturn = testflag;
				break;
			default:
				this.testReturn = BaseNode.SUCCESS;
				break;
		}
	}
	/*/ inheritance /*/
	ActionNode.inheritsFrom(BaseNode);

///	'methods' ///////////////////////////////////////////////////////////////

	/* avoid heap-allocation with reusable variables */
	/* values are not persistent; must refresh every tick! */
	var blackboard;		// scratch memory for AI in piece
	var status, i;		// running state of piece-ish

/*** see basenode.js for overrideable methods ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	ActionNode.method('Tick', function ( pish, intervalMs ) {
		return this.testReturn;	
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


///////////////////////////////////////////////////////////////////////////////
/** BEHAVIOR PRIVATE FUNCTIONS ***********************************************/

	// Functions should receive entire state in parameters, as stored values
	// in the object instances are not persistent because the same behavior
	// tree's nodes can be used across multiple agents. The blackboard is
	// what provides persistent memory


/** RETURN CONSTRUCTOR *******************************************************/

	return ActionNode;

});