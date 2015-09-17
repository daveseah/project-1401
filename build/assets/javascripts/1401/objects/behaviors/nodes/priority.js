/* priority.js */
define ([
	'1401/settings',
	'1401/objects/behaviors/nodes/base'
], function ( 
	SETTINGS,
	BaseNode
) {

	var DBGOUT = false;

/**	BehaviorTree Priority ***************************************************\
	
	A PriorityNode is a type of composite that returns SUCCESS if any one of
	its children is successful. It returns RUNNING until  all children have
	reported in.

		var node = PriorityNode ([
			Failer(),
			Failer(),
			Suceeder(),
			Failer()
		]);

	node.Tick() would return SUCCESS because one of its children
	reports success. By comparison, the SequenceNode is far less forgiving,
	running SUCCESS only if ALL its children report success, one after
	the other.


/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function PriorityNode ( children ) {
		//	call the parent constructor		
		BaseNode.call (this);

		// each node has a name
		this.name = 'pri'+this.id.zeroPad(3);
		this.description = 'priority node';

		// Priority evaluate left-to-right and have child nodes
		this.children = children || [];	
	}
	/*/ inheritance /*/
	PriorityNode.inheritsFrom(BaseNode);

///	'methods' ///////////////////////////////////////////////////////////////

	/* avoid heap-allocation with reusable variables */
	var blackboard;		// piece blackboard (AI memory)
	var i, status;		// counter


/*** see basenode.js for overrideable methods ***/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	PriorityNode.method('Tick', function ( pish, intervalMs ) {
		for (i=0;i<this.children.length;i++) {
			status = this.children[i].Execute(pish,intervalMs);
			if (status!==BaseNode.FAILURE) {
				if (DBGOUT) console.log(i,"succeeded! returning SUCCESS");
				return status;
			} else {
				if (DBGOUT) console.log(i,"failed...trying next");
			}
		}
		if (DBGOUT) console.log("all",this.children.length,"failed! return FAILURE");
		return BaseNode.FAILURE;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


///////////////////////////////////////////////////////////////////////////////
/** BEHAVIOR PRIVATE FUNCTIONS ***********************************************/

	// Functions should receive entire state in parameters, as stored values
	// in the object instances are not persistent because the same behavior
	// tree's nodes can be used across multiple agents. The blackboard is
	// what provides persistent memory


/** RETURN CONSTRUCTOR *******************************************************/

	return PriorityNode;

});