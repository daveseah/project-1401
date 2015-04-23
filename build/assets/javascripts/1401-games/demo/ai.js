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
	var tree;
	var blackboard;
	var target;
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	AI.PieceTest = function (p) {

		console.group("AI PieceTest");

		var t = LOGICFACTORY.NewTimer();
		t.Start(1000,1000);
		LOGICFACTORY.DisposeTimer(t);
		console.log(t);

		console.groupEnd();

	};

	AI.BehaviorInitialize = function ( piece ) {
		console.log("\n\n*** creating behavior tree ***");
		var b = BF.Sequence([
			BF.Action(),
			BF.Action()
		]);
		BF.DefineBehaviorTree('testMe',b);
		BF.AssignBehavior( piece, 'testme');
	};

	AI.BehaviorTick = function ( interval_ms ) {

	};

///////////////////////////////////////////////////////////////////////////////
/** MODULE HANDLER FUNCTIONS *************************************************/



///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return AI;

});
