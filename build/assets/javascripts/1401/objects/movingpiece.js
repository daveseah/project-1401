/* movingpiece.js */
define ([
	'three',
	'1401/objects/piece'
], function ( 
	THREE,
	Piece
) {

	var DBGOUT = true;

/**	MovingPiece **************************************************************\

	A MovingPiece implements the dynamic movement of a piece. The parent
	Piece class, by comparison, only has the notion of position and visual
	representation. Pieces have more features, of course, but MovingPiece
	builds upon them. 

	NOTES

	This module is designed to be imported and used as a based for creating
	extended Piece classes in a constructor chain. 


/** OBJECT DECLARATION ******************************************************/

///	MOVING PIECE /////////////////////////////////////////////////////////////
///	implements dynamic movement

	/*/ constructor /*/
	function MovingPiece ( name ) {

	//	call the parent constructor		
		Piece.call (this, name);

	//	position and orientation
	//	this.position - defined in Piece
	//	this.rotation - defined in Piece

	//	utility position data
	//	this.position0 - defined in Piece
	//	this.position1 - defined in Piece
	//	this.position2 - defined in Piece

	//	physics features via physics engine
	//	this.body = null;

	//	initialize default values
		m_InitializeDefaults(this);

	}
	/*/ inheritance /*/
	MovingPiece.inheritsFrom(Piece);


///	BASIC LIFECYCLE METHODS ///////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Override Piece.Update() as necessary
/*/	MovingPiece.method ('Update', function ( interval_ms ) {

		// call overridden Update() method directly
		Piece.superCall('Update', this, interval_ms);

	});


/** UTILITY FUNCTIONS ********************************************************/

	function m_InitializeDefaults ( piece ) {
		// moving piece defaults
	}

/** RETURN CONSTRUCTOR *******************************************************/

	return MovingPiece;

});