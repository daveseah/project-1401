/* renderer.js */
define ([
	'three',
	'1401/objects/viewport',
	'1401/settings',
	'1401/system/loader'
], function ( 
	THREE,
	VIEWPORT,
	SETTINGS,
	LOADER
) {

/**	RENDERER *****************************************************************\

	ThreeJS-based rendering system

/** MODULE PRIVATE VARIABLES *************************************************/

	var _timer_resizing;

	var RP_BG 		= new THREE.Scene();	// drawn with camBG
	var RP_WORLD 	= new THREE.Scene();	// drawn with camWORLD
	var RP_WORLD2 	= new THREE.Scene();	// drawn with camWORLD
	var RP_UI 		= new THREE.Scene();	// drawn with camSCREEN
	var RP_OVER 	= new THREE.Scene();	// drawn with camSCREEN

	var BG_SPRITE 	= null;


/** PUBLIC API ***************************************************************/

	var API = {};
	API.name = "renderer";

///	RENDER INIT & CONTROL ////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Initialize Rendersystem 
/*/	API.Initialize = function ( parm ) {

		// order of initialization is important
		VIEWPORT.InitializeRenderer(
			parm.renderWidth,
			parm.renderHeight,
			parm.attachTo
		);
		VIEWPORT.InitializeWorld(
			parm.worldUnits
		);
		VIEWPORT.InitializeCameras();

		// assign default cameras
		RP_BG.camera = VIEWPORT.GetBackgroundCam();
		RP_WORLD.camera = VIEWPORT.GetWorldCam();
		RP_WORLD2.camera = VIEWPORT.GetWorldCam();
		RP_UI.camera = VIEWPORT.GetScreenCam();
		RP_OVER.camera = VIEWPORT.GetScreenCam();

	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ for manually rendering on every update with explicit call
/*/	API.Render = function () {

		VIEWPORT.Clear();
		VIEWPORT.Render ( RP_BG );

		VIEWPORT.ClearDepth();
		VIEWPORT.Render ( RP_WORLD );

		VIEWPORT.ClearDepth();
		VIEWPORT.Render ( RP_WORLD2 );

		VIEWPORT.ClearDepth();
		VIEWPORT.Render ( RP_UI );

		VIEWPORT.ClearDepth();
		VIEWPORT.Render ( RP_OVER );

	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ call once to start auto drawing with no need to call on update
/*/	API.AutoRender = function () {
		requestAnimationFrame( API.AutoRender );
		API.Render();
	};


///	RENDERPASSES /////////////////////////////////////////////////////////////
/*/	These routines are useful for adding/removing a single visual (which is
	a THREE object3d) at a time.
/*/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddWorldVisual = function ( visual ) {
		RP_WORLD.add(visual);
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddWorldOverlayVisual = function ( visual ) {
		RP_WORLD2.add(visual);
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddBackgroundVisual = function ( visual ) {
		RP_BG.add(visual);
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddUIVisual = function ( visual ) {
		RP_UI.add(visual);
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddScreenOverlayVisual = function ( visual ) {
		RP_OVER.add(visual);
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveWorldVisual = function ( visual ) {
		RP_WORLD.remove(visual);
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveWorldVisual = function ( visual ) {
		RP_WORLD2.remove(visual);
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveBackgroundVisual = function ( visual ) {
		RP_BG.remove(visual);
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveUIVisual = function ( visual ) {
		RP_UI.remove(visual);
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveScreenOverlayVisual = function ( visual ) {
		RP_OVER.remove(visual);
	};


///	BACKGROUND IMAGE /////////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.SetBackgroundImage = function ( textureName, callback, callee ) {

		var bgMap = LOADER.LoadTexture(textureName,mi_SaveHeight);
		var bgMat = new THREE.SpriteMaterial( {map:bgMap} );
		if (BG_SPRITE) rpass.remove(BG_SPRITE);
		BG_SPRITE = new THREE.Sprite(bgMat);
		BG_SPRITE.position.set(0,0,-100);
		RP_BG.add(BG_SPRITE);
	
		function mi_SaveHeight(texture) {
			BG_SPRITE.scale.set(texture.image.width,texture.image.height,1);
			if (callback) callback.call(callee, texture);
		}

	};



 
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	return API;

});