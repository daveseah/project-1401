/* piecefactory.js */
define ([
	'1401/settings',
	'1401/objects/protopiece',
	'1401/objects/piece'
], function ( 
	SETTINGS,
	ProtoPiece,
	Piece
) {

	var DBGOUT = true;

/**	PIECEFACTORY *************************************************************\

	piece creation and management

/** MODULE PRIVATE VARIABLES *************************************************/


/** PUBLIC API ***************************************************************/

	var API = {};
	API.name = "piecefactory";

	API.NewPiece = function ( name ) {
		var p = new Piece(name);
		return p;
	};

/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	return API;

});