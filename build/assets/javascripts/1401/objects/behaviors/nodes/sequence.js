/* sequence.js */
define ([
	'1401/settings',
	'1401/objects/behaviors/nodes/base'
], function ( 
	SETTINGS,
	BaseNode
) {

	var DBGOUT = false;

/**	BehaviorTree Sequence ***************************************************\

	A SequenceNode is a type of composite that returns SUCCESS ONLY IF all its
	children return are successful. Each child is executed one after the
	other.

		var node = SequenceNode ([
			Suceeder(),
			Failer()
		]);

	node.Tick() would return FAIL because one of its children reports fail. By
	comparison, the PriorityNode type is more forgiving, returning SUCCESS if
	any of its children are successful.
	

/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function SequenceNode ( children ) {
		//	call the parent constructor		
		BaseNode.call (this);

		// each node has a name
		this.name = 'seq'+this.id.zeroPad(3);
		this.description = 'sequence node';

		// Sequences evaluate left-to-right and have child nodes
		this.children = children || [];	
	}
	/*/ inheritance /*/
	SequenceNode.inheritsFrom(BaseNode);

///	'methods' ///////////////////////////////////////////////////////////////

	/* avoid heap-allocation with reusable variables */
	var blackboard;		// piece blackboard (AI memory)
	var i, status;		// counter


/*** see basenode.js for overrideable methods ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SequenceNode.method('Tick', function ( pish, intervalMs ) {
		for (i=0;i<this.children.length;i++) {
			status = this.children[i].Execute(pish,intervalMs);
			if (status!==BaseNode.SUCCESS) {
				if (DBGOUT) console.log(i,"FAILED. Aborting FAIL");
				return status;
			} else {
				if (DBGOUT) console.log(i,"SUCCEED...");
			}
		}
		if (DBGOUT) console.log("all",this.children.length,"succeeded!");
		return BaseNode.SUCCESS;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


///////////////////////////////////////////////////////////////////////////////
/** BEHAVIOR PRIVATE FUNCTIONS ***********************************************/

	// Functions should receive entire state in parameters, as stored values
	// in the object instances are not persistent because the same behavior
	// tree's nodes can be used across multiple agents. The blackboard is
	// what provides persistent memory


/** RETURN CONSTRUCTOR *******************************************************/

	return SequenceNode;

});