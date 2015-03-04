/* renderer.js */
define ([
	'three',
	'1401/objects/viewport',
	'1401/settings'
], function ( 
	THREE,
	VIEWPORT,
	SETTINGS
) {

	var DBGOUT = true;

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

		// assign default cameras to renderpasses
		RP_BG.camera = VIEWPORT.BackgroundCam();
		RP_WORLD.camera = VIEWPORT.WorldCam();
		RP_WORLD2.camera = VIEWPORT.WorldCam();
		RP_UI.camera = VIEWPORT.ScreenCam();
		RP_OVER.camera = VIEWPORT.ScreenCam();

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
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ called by Master.Step() prior to Game.MasterStep()
/*/	API.HeartBeat = function ( interval_ms ) {
		// do system-related cleanup and processing
	};


///	RENDERPASSES /////////////////////////////////////////////////////////////
/*/	These routines are useful for adding/removing a single visual (which is
	a THREE object3d) at a time.
/*/
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddWorldVisual = function ( visual ) {
		RP_WORLD.add(visual);
		if (DBGOUT) console.log("added "+visual.id,">>> RP_WORLD");
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddWorldOverlayVisual = function ( visual ) {
		RP_WORLD2.add(visual);
		if (DBGOUT) console.log("added "+visual.id,">>> RP_WORLD2");
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddBackgroundVisual = function ( visual ) {
		RP_BG.add(visual);
		if (DBGOUT) console.log("added "+visual.id,">>> RP_BG");
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddUIVisual = function ( visual ) {
		RP_UI.add(visual);
		if (DBGOUT) console.log("added "+visual.id,">>> RP_UI");
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddScreenOverlayVisual = function ( visual ) {
		RP_OVER.add(visual);
		if (DBGOUT) console.log("added "+visual.id,">>> RP_OVER");
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveWorldVisual = function ( visual ) {
		RP_WORLD.remove(visual);
		if (DBGOUT) console.log("RP_WORLD >>>",visual.id.toString(),"removed");
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveWorldVisual = function ( visual ) {
		RP_WORLD2.remove(visual);
		if (DBGOUT) console.log("RP_WORLD2 >>>",visual.id.toString(),"removed");
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveBackgroundVisual = function ( visual ) {
		RP_BG.remove(visual);
		if (DBGOUT) console.log("RP_BG >>>",visual.id.toString(),"removed");
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveUIVisual = function ( visual ) {
		RP_UI.remove(visual);
		if (DBGOUT) console.log("RP_UI >>>",visual.id.toString(),"removed");
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveScreenOverlayVisual = function ( visual ) {
		RP_OVER.remove(visual);
		if (DBGOUT) console.log("RP_OVER >>>",visual.id.toString(),"removed");
	};


///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.SelectWorld2D = function ( index ) {
		VIEWPORT.SelectWorld2D();
		RP_WORLD.camera = VIEWPORT.WorldCam();
		RP_WORLD2.camera = VIEWPORT.WorldCam();
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.SelectWorld3D = function ( index ) {
		VIEWPORT.SelectWorld3D();
		RP_WORLD.camera = VIEWPORT.WorldCam();
		RP_WORLD2.camera = VIEWPORT.WorldCam();
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.Viewport = function ( index ) {
		return VIEWPORT;
	};



///	BACKGROUND IMAGE /////////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.SetBackgroundImage = function ( textureName, callback, callee ) {

		var bgMap = THREE.ImageUtils.loadTexture(textureName,THREE.UVMAPPING, mi_SaveHeight);
		var bgMat = new THREE.SpriteMaterial( {map:bgMap} );
		if (BG_SPRITE) rpass.remove(BG_SPRITE);
		BG_SPRITE = new THREE.Sprite(bgMat);
		BG_SPRITE.position.set(0,0,-1000); // clip for 2D is 1000
		this.AddBackgroundVisual(BG_SPRITE);
	
		function mi_SaveHeight(texture) {
			BG_SPRITE.scale.set(texture.image.width,texture.image.height,1);
			if (callback) callback.call(callee, texture);
		}

	};


 
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	return API;

});