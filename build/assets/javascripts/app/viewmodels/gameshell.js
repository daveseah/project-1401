/* gameshell.js */
define ([ 
	'durandal/app', 
	'knockout', 
	'1401/master',
	'1401/js-extend/oop',		// returns empty object
	'1401/js-extend/format',	// returns empty object

], function (
	app, 
	ko, 
	MASTER,
	js_oop,
	js_format
) {


///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	var MOD = {};
	MOD.displayName = 'GameShell';
	MOD.description = 'Game system testing code';
	MOD.compositionComplete = function () {
		var spec = {
			game: 'demo'
		};
		MASTER.Start( this, spec );
	};

///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MOD;

});


