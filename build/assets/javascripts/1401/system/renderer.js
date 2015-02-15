/* renderer.js */
define ([
	'three',
	'1401/system/renderer-bg'
], function ( 
	THREE_STUB,
	BG
) {

/**	RENDERER *****************************************************************\

	ThreeJS-based rendering system


///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	var API = {};
	API.name = "gamesys.renderer";


///	RENDERSYSTEM CONTROL /////////////////////////////////////////////////////
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Initialize Rendersystem 
/*/	API.Initialize = function (spec) {
		API_Initialize(spec);
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


///	CAMERA & VIEWPORT ////////////////////////////////////////////////////////
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.Camera = function () {
		return m_camera_main;
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.Viewport = function () {
		return {
			base_width: m_viewport.base_width,
			base_height: m_viewport.base_width,
			width: m_viewport.width,
			height: m_viewport.height,
			aspect: m_viewport.aspect,
			bg_image: BG.GetBackgroundStillSprite()
		};
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.SetBackgroundStill = function ( textureFile ) {
		var param = {
			viewport: m_viewport,
			textureName: '/images/bg.png'
		};

		if ( textureFile !== undefined ) {
			param.textureName = textureFile;
		}
		BG.ShowBackgroundStill(m_GetRenderPass(RP_BG), param);
	};


///	RENDERPASS: ADD //////////////////////////////////////////////////////////
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddVisualToBG = function (visual, layername) {
		m_AddVisualToRenderPass(visual,RP_BG,layername);
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddVisualToPreWorld = function (visual, layername) {
		m_AddVisualToRenderPass(visual,RP_PREWORLD,layername);
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddVisualToWorld = function (visual, layername) {
		m_AddVisualToRenderPass(visual,RP_WORLD,layername);
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddVisual = function (visual, layername) {
		m_AddVisualToRenderPass(visual,RP_PIECES,layername);
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddVisualToHUD = function (visual, layername) {
		m_AddVisualToRenderPass(visual,RP_HUD,layername);
	};

///	RENDERPASS: REMOVE ///////////////////////////////////////////////////////
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.RemoveVisual = function ( visual ) {
		m_RemoveVisualFromRenderPass ( visual );
	};

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//	Piece Pass Add
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.AddPiece = function (piece) {
		m_AddVisualToRenderPass(piece.Visual(),RP_PIECES);
	};




/** H1 BLOCK COMMENT ********************************************************/
///	H2 BLOCK COMMENT /////////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
///	subsection divider
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	extended function description
/*/
/****************************************************************************\
	extended block comment 
\****************************************************************************/


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/

var	m_dom_container;	// dom element to which renderer will attach
var m_three;			// THREEJS Renderer instance
var m_rpass;			// renderpasses: scenelists for bg, world, pieces, hud

var m_viewmode;
var VIEWMODE_2D = '2d';
var VIEWMODE_3D = '3d';

var m_viewport;			// width, height, auto_fill, aspect, 
var m_camera_ui;
var m_camera_main;

var _timer_resizing;

var RP_BG = 'background';
var RP_PREWORLD = 'preworld';
var RP_WORLD = 'world';
var RP_PIECES = 'pieces';
var RP_HUD = 'hud';


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/


function API_Initialize( vp_spec ) {

	console.info(API.name.bracket(),"initialize");

	vp_spec = vp_spec || {};

	vp_spec.auto_fill = vp_spec.auto_fill || true;
	vp_spec.width = vp_spec.width || 1024;
	vp_spec.height = vp_spec.height || 683;
	vp_spec.position = vp_spec.position || new THREE.Vector3(0, 3, 13);
	vp_spec.lookAt = vp_spec.lookAt || new THREE.Vector3(0, 1, 0);
	vp_spec.fov = vp_spec.fov || 53.1;
	vp_spec.near = vp_spec.near || -1;	// ensures that sprites plotted at z=0 work
	vp_spec.far = vp_spec.far || 10000;

	// check global viewmode for activity
	// vp_spec.view_mode = InqSim.Activity.Settings.Get(VIEWMODE_SETTING) || VIEWMODE_3D;
	vp_spec.view_mode = vp_spec.view_mode || VIEWMODE_3D;

	// on init, assume that width,height are the "base width"
	// width and height will vary by container size subsequently
	vp_spec.base_width = vp_spec.width;
	vp_spec.base_height = vp_spec.height;
	// set the view mode
	m_viewmode = vp_spec.view_mode;


	// create renderer
	if (m_three) {
		console.log(this, "*** Initialize using existing THREE instance");
	} else {
		m_three = new THREE.WebGLRenderer();
		m_three.autoClear = false;
	}
	// attach renderer
	// attach renderer
	if (!document.getElementById("container")) {
		console.warn(API.name.bracket(),"warning: div#container does not exist, rendering is invisible.");
	}
	m_dom_container = $('#container');
	m_dom_container.empty();
	m_dom_container.append(m_three.domElement);

	// set renderer viewport
	m_SetViewPort (vp_spec);

	// initialize data structures
	m_rpass = {};
	m_rpass.background = [];
	m_rpass.background[0] = m_NewSceneObject('-');
	m_rpass.preworld = [];
	m_rpass.preworld[0] = m_NewSceneObject('-');
	m_rpass.world = [];
	m_rpass.world[0] = m_NewSceneObject('-');
	m_rpass.pieces = [];
	m_rpass.pieces[0] = m_NewSceneObject('-');
	m_rpass.hud = [];
	m_rpass.hud[0] = m_NewSceneObject('-');

	// resize viewport on browser resize after 250ms
	// $(window).resize(function () {
	// 	clearTimeout(_timer_resizing);
	// 	_timer_resizing = setTimeout(m_SetViewPort,250);
	// });

	// create cameras
	if (m_viewmode===undefined) m_viewmode = API.VIEWMODE_3D;
	if (m_viewmode===API.VIEWMODE_2D) {
		// 2D Camera
			// note that sprites are drawn fixed-size in orthoa mode
			// note that sprites for orthographic views need a non-zero Z position
			// e.g.  robotPiece.SetPositionXYZ( 0, 0, -1);	// Z can't be 0
		console.log('Setting camera to 2D');
		m_camera_main = new THREE.OrthographicCamera (
			-(m_viewport.width) / 2,
			m_viewport.width / 2,
			m_viewport.height / 2,
			-(m_viewport.height) / 2,
			m_viewport.near,
			m_viewport.far
		);
		m_camera_main.position.Z = 300;
	} else {
		// 3D Camera
		console.log(API.name.bracket(),'setting camera to 3D');
		m_camera_main = new THREE.PerspectiveCamera (
			m_viewport.fov,
			m_viewport.width/m_viewport.height,
			m_viewport.near,
			m_viewport.far
		);	
		m_camera_main.position = m_viewport.position;
		m_camera_main.lookAt(m_viewport.lookAt);
	}
	m_camera_main.updateProjectionMatrix();

	m_camera_ui = new THREE.OrthographicCamera (
		-(m_viewport.width) / 2,
		m_viewport.width / 2,
		m_viewport.height / 2,
		-(m_viewport.height) / 2,
		m_viewport.near,
		m_viewport.far
	);
	m_camera_ui.position.Z = 300;
	m_camera_ui.updateProjectionMatrix();
}

// set the width/height based on auto_fill property
// calculates aspect and sets renderer size based on width of #container
function m_SetViewPort( vp ) {
	if (!m_viewport) m_viewport = {};
	if (!vp) vp = {};

	// always copy the values into m_viewport instead of assigning directly
	m_viewport.auto_fill = vp.auto_fill || m_viewport.auto_fill;
	m_viewport.width = vp.width || m_viewport.width;
	m_viewport.height = vp.height || m_viewport.height;
	m_viewport.position = vp.position || m_viewport.position;
	m_viewport.lookAt = vp.lookAt || m_viewport.lookAt;
	m_viewport.fov = vp.fov || m_viewport.fov;
	m_viewport.near = vp.near || m_viewport.near;
	m_viewport.far = vp.far || m_viewport.far;
	m_viewport.view_mode = vp.view_mode || m_viewport.view_mode;
	if (vp.base_width) m_viewport.base_width = vp.base_width;
	if (vp.base_height) m_viewport.base_height = vp.base_height;

	m_viewport.aspect = m_viewport.width / m_viewport.height;
	if (m_viewport.auto_fill) {
		var aspect = m_viewport.width / m_viewport.height;
		m_viewport.width = m_dom_container.width();
		m_viewport.height = m_viewport.width / aspect;
	}
	m_three.setSize ( m_viewport.width, m_viewport.height );

	// update ortho camera origin
	if (m_camera_ui) {
		m_camera_ui.left		= -(m_viewport.width / 2);
		m_camera_ui.right		= (m_viewport.width / 2);
		m_camera_ui.top		= (m_viewport.height / 2);
		m_camera_ui.bottom	= -(m_viewport.height / 2);
	}
	
}

// create a new SceneObject (AKA display list) for renderpasses
function m_NewSceneObject ( name ) {
	var scene = new THREE.Scene();
	if (name) scene.name = name;
	return scene;
}

// returns scene object from renderpass with optional named layer
// will return defaults if parameters not passed
// creates layer in specified renderpass if it doesn't exist
function m_GetRenderPass ( rpassName, layerName ) {
	try {
		// return default piece scene if no renderpass specified
		if (!rpassName) return m_rpass.pieces[0];

		// check for valid renderpass name
		var pass = m_rpass[rpassName];
		if (!pass) throw "invalid renderpass name (try world, pieces, or hud)";
		// return default layer 0 if no layerName specified
		if (!layerName) return pass[0];
		for (var i=0;i<pass.length;i++) {
			if (pass[i].name == layerName) return pass[i];
		}
		// make new layer in designated pass if it doesn't exist
		var createdLayer = m_NewSceneObject(layerName);
		pass[pass.length] = createdLayer;
		return createdLayer;
	} catch (err) {
		INQBUG.error(this,err);
	}
}

// add visual to scene renderpass/layer 
function m_AddVisualToRenderPass ( visual, rpassName, layerName ) {
	// save parameters for easy removal if we have to
	visual.rpass = rpassName;
	visual.rpasslayer = layerName;
	//m_GetRenderPass creates the pass if it doesn't exist. TRICKY.
	m_GetRenderPass(rpassName,layerName).add(visual);
}

// remove visual using saved creation information
function m_RemoveVisualFromRenderPass( visual ) {
	var rpassName = visual.rpass;
	var layerName = visual.rpasslayer;
	console.assert(rpassName,"Missing 'rpass' property in visual");
	console.assert(layerName,"Missing 'rpasslayer' property in visual");
	m_GetRenderPass(rpassName,layerName).remove(visual);
}


/** RENDER LOOP **************************************************************/	

function m_RenderAll () {
	BG.Update();
	m_three.clear();
	var i;
	// render background objects
	for (i=0;i<m_rpass.background.length;i++) {
		m_three.render(m_rpass.background[i],m_camera_ui);
	}

	// draw on top of background, so clear depth buffer
	m_three.clearDepth();

	// render preworld objects
	for (i=0;i<m_rpass.preworld.length;i++) {
		m_three.render(m_rpass.preworld[i],m_camera_main);
	}

	// render world objects
	for (i=0;i<m_rpass.world.length;i++) {
		m_three.render(m_rpass.world[i],m_camera_main);
	}

	// render piece objects
	for (i=0;i<m_rpass.pieces.length;i++) {
		m_three.render(m_rpass.pieces[i],m_camera_main);
	}

	// draw HUD elements on top of everything
	m_three.clearDepth();

	// render hud objects
	for (i=0;i<m_rpass.hud.length;i++) {
		m_three.render(m_rpass.hud[i],m_camera_ui);
	}
}

 
///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return API;

});