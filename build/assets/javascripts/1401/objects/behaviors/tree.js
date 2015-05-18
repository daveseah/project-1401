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

	The code that iterates through the nodes is in BaseNode, not here

/** OBJECT DECLARATION ******************************************************/

	/* constructor */
	function BehaviorTree ( name, rootNode ) {
		this.id = BehaviorTree.idCounter++;
		this.name = name || 'behavior'+this.id.zeroPad(3);
		this.root = rootNode || null;
	}

///	'static' properties //////////////////////////////////////////////////////
	BehaviorTree.idCounter = 1;

///	'enums' //////////////////////////////////////////////////////////////////

///	'methods' ///////////////////////////////////////////////////////////////

	BehaviorTree.method('RootNode', function () {
		return this.root;
	});
	BehaviorTree.method('Load', function ( benode ) {
	});
	BehaviorTree.method('Save', function ( benode ) {
	});


///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/** RETURN CONSTRUCTOR *******************************************************/

	return BehaviorTree;

});