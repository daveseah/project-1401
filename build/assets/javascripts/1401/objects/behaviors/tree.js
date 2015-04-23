/* tree.js */
define ([
	'1401/settings'
], function ( 
	SETTINGS
) {

	var DBGOUT = true;

/**	Behavior Tree ***********************************************************\

	Things that a BT does:
	has a ROOT
	has a bunch of NODES added to the root
	can READ a tree
	can WRITE a tree

/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function BehaviorTree ( name ) {
		this.id = BehaviorTree.idCounter++;
		this.name = name || 'betree'+this.id.ZeroPad(3);

		this.root = null;

	}

///	'static' properties //////////////////////////////////////////////////////
	BehaviorTree.idCounter = 1;

///	'enums' //////////////////////////////////////////////////////////////////




/** PRIVATE SUPPORT METHODS **************************************************/

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

/** RETURN CONSTRUCTOR *******************************************************/

	return BehaviorTree;

});