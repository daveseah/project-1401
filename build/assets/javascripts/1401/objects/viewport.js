/* viewport.js */
define ([
	'three',
], function ( 
	THREE
) {

/****************************************************************************\

	VIEWPORT is our "fixed-size pixel space", which matches the
	resolution of the WebGLRenderer. This resolution is also the
	base resolution for bitmapped images used as backgrounds and
	sprites. 

\****************************************************************************/

///	PRIVATE VARIABLES ////////////////////////////////////////////////////////

	var instance;
	var viewport_count = 0;

///	OBJECT DECLARATIONS //////////////////////////////////////////////////////

	/* constructor */
	function Viewport ( name ) {
		this.name = name || "viewport"+(viewport_count++);
		// viewport 
		this.width 			= null;		// pixels
		this.height 		= null;		// pixels
		this.aspect 		= null;
		this.containerId 	= null;
		this.webGL 			= null;
		// world
		this.worldOrigin 	= null;		// where world cams are looking
		this.worldWidth		= null;		// x-range of world values to frame in camera
		this.worldDepth 	= null;		// y-range of world values to frame in camera
		this.worldAspect	= null;		// computed world aspect ratio for 3d cams
		this.worldUp	 	= null;		// up-vector for orienting world cams
		// cameras
		this.camBG 			= null;		// background image (pixel coords)
		this.camWORLD 		= null;		// pieces (world coords) set to...
		this.cam2D			= null;		// ...2d orthographic (world coords)
		this.cam3D			= null;		// ...3d perspective (world coords)
		this.camSCREEN 		= null;		// screen (pixel coords)
	}
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('InitializeRenderer', function ( width, height, containerId ) {
		if (this.webGL) {
			console.error("Renderer already initialized");
			return;
		}
		if (!(width && height && containerId)) {
			console.error("Call InitializeRenderer() with cwidth, cheight, containerId");
			return;
		}
		if (typeof containerId !== 'string') {
			console.error("Provide a valid selector");
			return;
		}
		var $container = $(containerId);
		if (!$container) {
			console.error("container",containerId,"does not exist");
			return;
		}

		// save values
		this.width = width;
		this.height = height;
		this.containerId = containerId;

		// create renderer, then attach it
		this.webGL = new THREE.WebGLRenderer();
		this.webGL.autoClear = false;
		$container.append(this.webGL.domElement);

		// set the renderer size
		this.webGL.setSize(this.width,this.height);
		// set the container dimensions as well
		$container.css('width',this.width);
		$container.css('height',this.height);

	});
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('InitializeWorld', function ( worldUnits ) {
		if (!this.webGL) {
			console.error("Call InitializeViewport() before calling InitializeWorld()");
			return;
		}
		if (!worldUnits) {
			console.error("Call with worldUnits, the min");
			return;
		}
		// save world values
		this.worldOrigin = new THREE.Vector3(0,0,0);
		this.worldUp = new THREE.Vector3(0,1,0);	// y-axis is up, camera looks on XY
		this.worldUnits = worldUnits;
		this.worldScale = Math.min(this.width/worldUnits,this.height/worldUnits);
	});
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('InitializeCameras', function () {
		if (!this.worldScale) {
			console.error("Call InitializeWorld() before calling InitializeCameras()");
		}
		var hw = this.width/2;
		var hh = this.height/2;
		this.camBG = new THREE.OrthographicCamera(-hw,hw,hh,-hh,0,1000);
		this.camSCREEN = new THREE.OrthographicCamera(-hw,hw,hh,-hh,0,1000);
		var whw = this.width * this.worldScale / 2;
		var whh = this.height * this.worldScale / 2;
		var wox = this.worldOrigin.x;
		var woy = this.worldOrigin.y;
		this.cam2D = new THREE.OrthographicCamera(-whw+wox,whw+wox,whh+woy,-whh+woy,0,1000);
		this.cam2D.position.set(wox,woy,10);
		this.cam2D.lookAt(this.worldOrigin);
		this.cam3D = new THREE.PerspectiveCamera ( 53.1, this.aspect, 0,1000);
		this.cam3D.position.set(wox,woy,10);
		this.cam3D.lookAt(this.worldOrigin);
		this.camSCREEN = new THREE.OrthographicCamera(-hw,hw,hh,-hh,0,1000);
		// assign default world camera as 2D
		this.camWORLD = this.cam2D;
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('SetViewportDimensions',function ( width, height ){
		if (!this.webGL) {
			console.error("WebGL is not initialized");
			return;
		}
		if (!width) width = this.width;
		if (!height) height = this.height;
		if (!(width && height && this.webGL)) {
			console.error("ViewPort requires valid width and height. Did you InitializeRenderer()?");
		}
		this.aspect = width/height;
		this.UpdateViewportCameras();
	});
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('UpdateWorldCameras', function () {
		var safety = 0.5;

		var whw = this.worldWidth/2;
		var whh = this.worldDepth/2;
		var wox = this.worldOrigin.x;
		var woy = this.worldOrigin.y;

		// update world2d camera
		this.cam2D.left  	= -whw+wox;
		this.cam2D.right 	= +whw+wox;
		this.cam2D.top 		= +whh+woy;
		this.cam2D.bottom 	= -whh+woy;

		// update world3d camera by positioning it
		// to default see the entire world
		var deg2rad = 180 / Math.PI;
		var hfov = deg2rad * (this.cam3D.fov / 2);
		var tan = Math.tan(hfov);
		var d = Math.max ( whw/tan, whh/tan );

		this.cam3D.position.z = d;
		this.cam2D.position.z = d;

		CAM.world2d.updateProjectionMatrix();
		CAM.world3d.updateProjectionMatrix();

	});
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('UpdateViewportCameras', function () {
		var hw = this.width/2;
		var hh = this.height/2;
		this.camBG.left 	= -hw;
		this.camBG.right	= +hw;
		this.camBG.top		= +hh;
		this.camBG.bottom	= -hh;

		this.camSCREEN.left 	= -hw;
		this.camSCREEN.right	= +hw;
		this.camSCREEN.top		= +hh;
		this.camSCREEN.bottom	= -hh;

		this.camBG.updateProjectionMatrix();
		this.camSCREEN.updateProjectionMatrix();
	});
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('GetAspectRatio', function () {
		return this.aspect;
	});
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('GetBackgroundCam', function () { return this.camBG; });
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('GetWorldCam', function () { return this.camWORLD; });
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('GetScreenCam', function () { return this.camSCREEN; });
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('Clear', function () { this.webGL.clear(); });
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('ClearDepth', function () { this.webGL.clearDepth(); });
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	Viewport.method('Render', function ( rpass ) { 
		this.webGL.render(rpass,rpass.camera);
	});


///	RETURN SINGLETON /////////////////////////////////////////////////////////

	if (instance===undefined) instance = new Viewport();
	return instance;

});
