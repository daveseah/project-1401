/* piece.js */
define ([
	'three',
	'1401/objects/pieces/protopiece'
], function ( 
	THREE,
	ProtoPiece
) {

	var DBGOUT = false;

/**	Piece ********************************************************************\

	A piece is an autonomous actor within the system, and the various piece 
	classes add various capabilities. 

	The model for using a piece is to set its properties directly during 
	initialization and give it a role to tell it what goals/behaviors it should
	work on. These goals and behaviors are changed as needed by managers or its 
	own robot ai. This decouples the need to directly set parameters with
	some outside subroutine.

	NOTES

	This module is designed to be imported and used as a based for creating
	extended Piece classes in a constructor chain. 

	Since Javascript does not have multiple inheritance, advanced functions
	like Physics, ai, etc are composed into properties.

	The Piece.Update, Think, and Execute methods are called every frame. Pieces
	are updated automatically; there is no need to call them yourself.


/** OBJECT DECLARATION ******************************************************/

///	PIECE /////////////////////////////////////////////////////////////////////
///	stores position, visual, event queues, and behavior hooks

	/*/ constructor /*/
	function Piece ( name ) {

	//	call the parent constructor		
		ProtoPiece.call (this, name);

	//	position and orientation
		this.position = null;
		this.rotation = null;

	//	utility position data
		this.position0 = null;	// last posiiton
		this.position1 = null;	// start position
		this.position2 = null;	// end position

	//	visual representation
		this.visual = null;

	//	physics features via physics engine
		this.body = null;

	//	autonomous features via state manager
		this.state = null;

	//	thinking features via ai
		this.ai = null;

	// 	override functions (useful for temp testing)
		this.updateFunc = null;
		this.thinkFunc = null;
		this.executeFunc = null;

	//	initialize default values
		m_InitializeDefaults(this);

	}
	/*/ inheritance /*/
	Piece.inheritsFrom(ProtoPiece);


///	BASIC LIFECYCLE METHODS ///////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('Update', function ( interval_ms ) {

		var override = false;
		if (this.updateFunc) {
			override = this.updateFunc.call (this, interval_ms);
			if (override) return;
		}
		if (this.State) this.State.Update (interval_ms);
		if (this.ai) this.ai.Update (interval_ms);

	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('Think', function ( interval_ms ) {

		var override = false;
		if (this.thinkFunc) {
			override = this.thinkFunc.call( this, interval_ms );
			if (override) return;
		}
		if (this.ai) this.ai.Think(interval_ms);

	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('Execute', function ( interval_ms ) {

		var override = false;
		if (this.executeFunc) {
			override = this.executeFunc.call( this, interval_ms );
			if (override) return;
		}
		if (this.ai) this.ai.Execute(interval_ms);

	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('OverrideUpdate', function ( func ) {
		if (typeof func!=='function') {
			console.error("not a function");
			return;
		}
		this.updateFunc = func;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('OverrideThink', function ( func ) {
		if (typeof func!=='function') {
			console.error("not a function");
			return;
		}
		this.thinkFunc = func;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('OverrideExecute', function ( func ) {
		if (typeof func!=='function') {
			console.error("not a function");
			return;
		}
		this.executeFunc = func;
	});

///	POSITION ACCESS METHODS //////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Position() - preferred way to read position of piece 
/*/	Piece.method ('Position', function () {
		// return a copy, so callee can manipulate it without borking
		// the piece's actual position.
		return this.position.clone();
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	SetPosition() - preferred way to set the position of the piece 
/*/	Piece.method ('SetPosition', function ( vector3 ) {

		// note we are copying values instead of assigning objects
		// to avoid object reuse bugs in vector operations

		this.position.x = vector3.x;
		this.position.y = vector3.y;
		this.position.z = vector3.z;

		// NOTE: visuals are THREE.object3d instances
		if (this.visual) {
			this.visual.position.x = vector3.x;
			this.visual.position.y = vector3.y;
			this.visual.position.z = vector3.z;
		}

		// NOTE: MatterJS is a verlet physics engine so this may create
		// a sudden jump. might be a better way of setting this.
		if (this.body) {
			// this.body.position.x = vector3.x;
			// this.body.position.y = vector3.y;
		}

		// return the value as clone, not the actual one
		// again to avoid object reference bugs when vector calcs
		// are performed
		return this.position.clone();
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetPositionXYZ', function ( x, y, z ) {
		this.SetPosition( new THREE.Vector3( x, y, z ) );
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetPositionXY', function ( x, y ) {
		this.SetPosition( new THREE.Vector3( x, y, this.position.z ) );
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetPositionX', function ( x ) {
		this.SetPosition(
			new THREE.Vector3( x, this.position.y, this.position.z)
		);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetPositionY', function ( y ) {
		this.SetPosition(
			new THREE.Vector3( this.position.x, y, this.position.z)
		);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetPositionZ', function ( z ) {
		this.SetPosition(
			new THREE.Vector3( this.position.x, this.position.y, z )
		);
	});


///	VISUAL METHODS ////////////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('Visual', function () {
		return this.visual;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetVisual', function ( vis ) {

		if (vis===undefined) {
			console.warn("To unset visual, use value of 'null' instead of 'undefined");
			return;
		}
		if (vis===null) { 
			// clear the current visual
			if (this.visual) {
				var pieceId = this.visual.pieceId;
				if (this.visual.pieceId) {
					if (DBGOUT) 
						console.log('removed visual',this.visual.pieceId,'from',pieceId);
					this.visual.pieceId = null;
				}
			}
			this.visual = null;
		} else { 
			// assign new visual to this piece
			if (vis.pieceId) // is already assigned or not null 
				console.warn("visual",vis.id,"is being assigned again to piece",this.id);
			this.visual = vis;
			this.visual.pieceId = this.id;
		}
	});


/** UTILITY FUNCTIONS ********************************************************/

	function m_InitializeDefaults ( piece ) {
		piece.position = new THREE.Vector3(0,0,0);
		piece.rotation = 0;
	}

/** RETURN CONSTRUCTOR *******************************************************/

	return Piece;

});