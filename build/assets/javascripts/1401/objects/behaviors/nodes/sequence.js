/* sequence.js */
define ([
	'1401/settings',
	'1401/objects/behaviors/nodes/base'
], function ( 
	SETTINGS,
	BaseNode
) {

	var DBGOUT = true;

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
		this.node_type = 'SEQ';
		this.name = this.node_type+this.id;
		if (DBGOUT) console.log("create",this.name);

		// Sequences evaluate left-to-right and have child nodes
		this.children = children || [];	
	}
	/*/ inheritance /*/
	SequenceNode.inheritsFrom(BaseNode);

///	'methods' ///////////////////////////////////////////////////////////////

	/* avoid heap-allocation with reusable variables */
	var blackboard;		// piece blackboard (AI memory)
	var i, status;		// counter
	var child;			// child holder
	var out;			// output holder


/// see basenode.js for overrideable methods!
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	SequenceNode.method('Tick', function ( pish, intervalMs ) {
		out = this.name.bracket();
		for (i=0;i<this.children.length;i++) {
			child = this.children[i];
			status = child.Execute(pish, intervalMs);
			if (status!==BaseNode.SUCCESS) {
				if (DBGOUT) {
					out+= ' '+child.name+'-'+status+' ABORT';
					console.log(out);
				}
				return status;
			} else {
				if (DBGOUT) out+= ' '+child.name+'-'+status;
			}
		}
		if (DBGOUT) console.log(out,"all",this.children.length,"success!");
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