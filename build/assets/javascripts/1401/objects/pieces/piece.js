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

	//	position and orientationS
		this.position = null;	// initialized later
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


/// PRE-ALLOCATED HEAP-SAVING VARIABLES ///////////////////////////////////////

	var override;


///	BASIC LIFECYCLE METHODS ///////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('Update', function ( interval_ms ) {

		override = false;
		if (this.updateFunc) {
			override = this.updateFunc.call (this, interval_ms);
			if (override) return;
		}
		if (this.state) this.state.Update( interval_ms );

	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('Think', function ( interval_ms ) {

		override = false;
		if (this.thinkFunc) {
			override = this.thinkFunc.call( this, interval_ms );
			if (override) return;
		}
		// behavior tree
		if (this.ai) this.ai.behavior.RootNode().Execute( this, interval_ms );

	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('Execute', function ( interval_ms ) {

		override = false;
		if (this.executeFunc) {
			override = this.executeFunc.call( this, interval_ms );
			if (override) return;
		}

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
/*/	
/*/	Piece.method('Rotation', function () {
		return this.rotation.clone();
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	
/*/	Piece.method('SetRotation', function ( vector3 ) {	
		if (vector3===undefined) console.error("rotation vector is undefined");
		if (typeof vector3!=='object') console.error('SetRotation requires Vector3, not',typeof vector3);

		this.rotation.x = vector3.x;
		this.rotation.y = vector3.y;
		this.rotation.z = vector3.z;

		// NOTE: visuals are THREE.object3d instances
		if (this.visual) {
			this.visual.rotation.x = vector3.x;
			this.visual.rotation.y = vector3.y;
			this.visual.rotation.z = vector3.z;
			if (this.visual.inqsprite) {
				this.visual.Rotate(vector3.z);
			}
		}

	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	
/*/	Piece.method('SetRotationX', function ( rot ) {	
		if (rot===undefined) console.error("rotationX is undefined");
		this.SetRotation(
			new THREE.Vector3( rot, this.position.y, this.position.x )
		);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	
/*/	Piece.method('SetRotationY', function ( rot ) {	
		if (rot===undefined) console.error("rotationY is undefined");
		this.SetRotation(
			new THREE.Vector3( this.position.x, rot, this.position.z )
		);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	
/*/	Piece.method('SetRotationZ', function ( rot ) {
		if (rot===undefined) console.error("rotationZ is undefined");
		this.SetRotation(
			new THREE.Vector3( this.position.x, this.position.y, rot )
		);
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
		this.SetPositionXYZ(vector3.x,vector3.y,vector3.z);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetPositionXYZ', function ( x, y, z ) {
		// copy position into current vector
		this.position.x = x;
		this.position.y = y;
		this.position.z = z;
		// NOTE: visuals are THREE.object3d instances
		if (this.visual) {
			this.visual.position.x = x;
			this.visual.position.y = y;
			this.visual.position.z = z;
		}
		// NOTE: physics engine hooks also exist in movingpiece.js
		if (this.body) {
			// this.body.position.x = vector3.x;
			// this.body.position.y = vector3.y;
		}
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetPositionXY', function ( x, y ) {
		this.SetPositionXYZ( x, y, this.position.z );
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetPositionX', function ( x ) {
		this.SetPositionXYZ( x, this.position.y, this.position.z );
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetPositionY', function ( y ) {
		this.SetPositionXYZ(this.position.x, y, this.position.z);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Piece.method ('SetPositionZ', function ( z ) {
		this.SetPositionXYZ( this.position.x, this.position.y, z );
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
		piece.rotation = new THREE.Vector3(0,0,0);
	}

/** RETURN CONSTRUCTOR *******************************************************/

	return Piece;

});