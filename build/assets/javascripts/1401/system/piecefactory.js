/* piecefactory.js */
define ([
	'1401/settings',
	'1401/objects/piece/protopiece',
	'1401/objects/piece/piece',
	'1401/objects/piece/movingpiece'
], function ( 
	SETTINGS,
	ProtoPiece,
	Piece,
	MovingPiece
) {

	var DBGOUT = true;

/**	PIECEFACTORY *************************************************************\

	piece creation and management

/** MODULE PRIVATE VARIABLES *************************************************/


/** PUBLIC API ***************************************************************/

	var API = {};
	API.name = "piecefactory";


///	SYSTEM INTERFACES ////////////////////////////////////////////////////////

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	API.HeartBeat = function ( interval_ms ) {
		ProtoPiece.UpdateAll( interval_ms );
	};


///	FACTORY METHODS //////////////////////////////////////////////////////////

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	API.NewPiece = function ( name ) {
		var p = new Piece(name);
		return p;
	};

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	API.NewMovingPiece = function ( name ) {
		var p = new MovingPiece(name);
		return p;
	};


/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	return API;

});