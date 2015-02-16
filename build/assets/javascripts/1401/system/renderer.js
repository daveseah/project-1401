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

///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/

	var _timer_resizing;

	var RP_BG 		= 'background';		// drawn with camBG
	var RP_WORLD 	= 'world-pieces';	// drawn with camWORLD
	var RP_HUD 		= 'world-hud';		// drawn with camWORLD
	var RP_UI 		= 'ui';				// drawn with camSCREEN
	var RP_OVER 	= 'overlay';		// drawn with camSCREEN
	var RENDERPASS 	= {};

	var BG_SPRITE 	= null;


///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	var API = {};
	API.name = "renderer";


///	SYSTEM SERVICE INTERFACE /////////////////////////////////////////////////

	API.SystemInitialize = function () {
	};
	API.SystemUpdate = function () {
	};


///	RENDERSYSTEM CONTROL /////////////////////////////////////////////////////
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Initialize Rendersystem 
/*/	API.Initialize = function ( parm ) {
		VIEWPORT.InitializeRenderer(parm.canvasWidth,parm.canvasHeight,parm.attachTo);
		VIEWPORT.InitializeWorld(parm.worldWidth,parm.worldDepth,parm);
		VIEWPORT.InitializeCameras();

		// initialize renderpasses
		var passes = [RP_BG,RP_WORLD,RP_HUD,RP_UI,RP_OVER];
		for (var i=0;i<passes.length;i++) {
			var key = passes[i];
			var rp = new THREE.Scene();
			rp.name = key;
			RENDERPASS[key] = rp;
		}
		// assign default cameras
		RENDERPASS[RP_BG].camera = VIEWPORT.GetBackgroundCam();
		RENDERPASS[RP_WORLD].camera = VIEWPORT.GetWorldCam();
		RENDERPASS[RP_HUD].camera = VIEWPORT.GetWorldCam();
		RENDERPASS[RP_UI].camera = VIEWPORT.GetScreenCam();
		RENDERPASS[RP_OVER].camera = VIEWPORT.GetScreenCam();


	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ for manually rendering on every update with explicit call
/*/	API.Render = function () {
		m_RenderAll();
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ call once to start auto drawing with no need to call on update
/*/	API.AutoRender = function () {
		requestAnimationFrame( API.AutoRender );
		m_RenderAll();
	};

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.SetBackgroundImage = function ( textureName, callback, callee ) {
		textureName = textureName || '/images/bg.png';
		var rpass = RENDERPASS[RP_BG];

		var bgMap = LOADER.LoadTexture(textureName,mi_SaveHeight);
		var bgMat = new THREE.SpriteMaterial( {map:bgMap} );
		if (BG_SPRITE) rpass.remove(BG_SPRITE);
		BG_SPRITE = new THREE.Sprite(bgMat);
		BG_SPRITE.position.set(0,0,-100);
		rpass.add(BG_SPRITE);

		function mi_SaveHeight(texture) {
			BG_SPRITE.scale.set(texture.image.width,texture.image.height,1);
			if (callback) callback.call(callee, texture);
		}
	};


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/

/** RENDER LOOP **************************************************************/	

	function m_RenderAll () {

		VIEWPORT.Clear();
		VIEWPORT.Render ( RENDERPASS[RP_BG] );

		VIEWPORT.ClearDepth();
		VIEWPORT.Render ( RENDERPASS[RP_WORLD] );

		VIEWPORT.ClearDepth();
		VIEWPORT.Render ( RENDERPASS[RP_HUD] );

		VIEWPORT.ClearDepth();
		VIEWPORT.Render ( RENDERPASS[RP_UI] );

		VIEWPORT.ClearDepth();
		VIEWPORT.Render ( RENDERPASS[RP_OVER] );

	}

 
///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return API;

});