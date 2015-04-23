/* action.js */
define ([
	'1401/settings',
	'1401/objects/behaviors/basenode'
], function ( 
	SETTINGS,
	BaseNode
) {

	var DBGOUT = true;

/**	BehaviorTree Sequence ***************************************************\


/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function ActionNode () {

		//	call the parent constructor		
		BaseNode.call (this);

		// each node has a name
		this.name = 'action'+this.id.zeroPad(3);
		this.description = 'action node';

	}
	/*/ inheritance /*/
	ActionNode.inheritsFrom(BaseNode);

///	'methods' ///////////////////////////////////////////////////////////////

	/* avoid heap-allocation with reusable variables */
	var pishMem;		// AIMem of piece-ish
	var pishNodeMem;	// AIMem for this node_id for this piece
	var pishState;		// AIMem state of piece-ish

/*** overrideable methods ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	ActionNode.method('Open', function ( pish, intervalMs ) {
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	ActionNode.method('Tick', function ( pish, intervalMs ) {
		// if (DBGOUT) console.log('action BT<'+this.id+"> on",pish.name.bracket());
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	ActionNode.method('Close', function ( pish, intervalMs ) {
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/** RETURN CONSTRUCTOR *******************************************************/

	return ActionNode;

});