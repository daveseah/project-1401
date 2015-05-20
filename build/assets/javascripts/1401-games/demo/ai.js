/* demo/ai.js */
define ([
	'1401/system/debug',
	'1401/system/logicfactory',
	'1401/system/behaviorfactory'
], function ( 
	DBG,
	LOGICFACTORY,
	BF
) {

	var DBGOUT = false;

///////////////////////////////////////////////////////////////////////////////
/**	TEST AI CONCEPTS *******************************************************\



///////////////////////////////////////////////////////////////////////////////
/** PRIVATE VARS *************************************************************/


///////////////////////////////////////////////////////////////////////////////
/** MODULE DECLARATION *******************************************************/

	var AI = {};
	AI.name = "demo/aitest";

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	AI.PieceTest = function (p) {

		console.group("AI PieceTest");

		var t = LOGICFACTORY.NewTimer();
		t.Start(1000,1000);
		LOGICFACTORY.DisposeTimer(t);
		console.log(t);

		console.groupEnd();

	};

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	AI.BehaviorInitialize = function ( piece ) {
		console.log("\n\n*** TESTING BEHAVIOR TREE CREATION ***\n");
		
		var b = BF.Priority([
			BF.Action(BF.FAILURE),
			BF.Action(BF.FAILURE),
			BF.Action(BF.FAILURE),
			BF.Action(BF.SUCCESS),
			BF.Action(BF.FAILURE)
		]);

		// behavior names are case insensitive
		BF.DefineBehavior('testMe', b);
		BF.AssignBehavior('testme', piece);
	};


///////////////////////////////////////////////////////////////////////////////
/** MODULE HANDLER FUNCTIONS *************************************************/



///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return AI;

});
