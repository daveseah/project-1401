/* sequence.js */
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
	function SequenceNode ( children ) {

		//	call the parent constructor		
		BaseNode.call (this);

		// each node has a name
		this.name = 'sequence'+this.id.zeroPad(3);
		this.description = 'sequence node';

		// Sequences evaluate left-to-right and have child nodes
		this.children = children || [];	
		// store childindex in piece.aimemory

	}
	/*/ inheritance /*/
	SequenceNode.inheritsFrom(BaseNode);

///	'methods' ///////////////////////////////////////////////////////////////

	/* avoid heap-allocation with reusable variables */
	var pishMem;		// AIMem of piece-ish
	var pishNodeMem;	// AIMem for this node_id for this piece
	var pishState;		// AIMem state of piece-ish
	var i, status;		// counter

/*** overrideable methods ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SequenceNode.method('Open', function ( pish, intervalMs ) {
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SequenceNode.method('Tick', function ( pish, intervalMs ) {
		// if (DBGOUT) console.log('seq BT<'+this.id+"> on",pish.name.bracket());
		for (i=0;i<this.children.length;i++) {
			status = this.children[i].Tick(pish,intervalMs);
		}
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SequenceNode.method('Close', function ( pish, intervalMs ) {
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/** RETURN CONSTRUCTOR *******************************************************/

	return SequenceNode;

});