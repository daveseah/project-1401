/* piecefactory.js */
define ([
	'1401/settings',
	'1401/objects/pieces/protopiece',
	'1401/objects/pieces/piece',
	'1401/objects/pieces/movingpiece'
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