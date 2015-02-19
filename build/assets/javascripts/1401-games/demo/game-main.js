/* demo/game-main.js */
define ([
	'1401/settings',
	'1401/objects/sysloop',
	'1401/system/renderer',
	'1401/system/visualfactory',
	'1401/system/piecefactory'
], function ( 
	SETTINGS,
	SYSLOOP,
	RENDERER,
	VISUALFACTORY,
	PIECEFACTORY
) {

///////////////////////////////////////////////////////////////////////////////
/**	DEMO GAME ***************************************************************\

	This file, game-main.js, is the starting point of the game. It uses the 
	API for Game Loops to run under the control of master.js.

	In general, you'll be hooking into these functions as necessary.

	MAIN.SetHandler('Initialize', function () {} );
	MAIN.SetHandler('Connect', function () {} );
	MAIN.SetHandler('LoadAssets', function () {} );
	MAIN.SetHandler('Construct', function () {} );
	MAIN.SetHandler('Start', function () {} );
	MAIN.SetHandler('Step', function () {} );

	See sysloop.js for documentation.

///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

	// create a game loop handler object with all necessary functions
	var MAIN = SYSLOOP.InitializeGame('GameDemoMain');

	// add handlers as needed
	MAIN.SetHandler('Connect', API_HandleConnect);
	MAIN.SetHandler('Initialize', API_HandleInitialize);
	MAIN.SetHandler('Construct', API_HandleConstruct);
	MAIN.SetHandler('LoadAssets', API_LoadAssets);
	MAIN.SetHandler('Step', API_HandleStep);


///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE VARIABLES ************************************************/

	var m_viewmodel;	// durandal viewmodel for databinding, system props

	var spr01;
	var spr02;
	var spr03;
	var obj01;
	var obj02;

///////////////////////////////////////////////////////////////////////////////
/** MODULE PRIVATE FUNCTIONS ************************************************/

	function API_HandleConnect ( viewModel ) {
		m_viewmodel = viewModel;
	}
	function API_LoadAssets ( callback ) {
		VISUALFACTORY.LoadAssets (callback);
	}
	function API_HandleInitialize () {
		console.log("MAIN: Initializing!");
		var parm = {
			attachTo: '#container',		// WebGL attaches to this
			renderWidth: 1024,			// width of render context
			renderHeight: 768,			// height of render context
			worldUnits: 768				// world units to fit in shortest dim
		};
		RENDERER.Initialize ( parm );
		var bg_png = SETTINGS.GamePath('resources/bg.png');
		RENDERER.SetBackgroundImage ( bg_png );
		RENDERER.AutoRender();
	}

	function API_HandleConstruct() {

		console.group("constructing test pieces");

		var numpieces = 100000;
		console.log("creating",numpieces,"pieces without visuals");
		for (var i=0;i<numpieces;i++) {
			var p = PIECEFACTORY.NewPiece("test");
		}

		console.groupEnd();
		console.group("constructing test visuals");

		spr01 = VISUALFACTORY.MakeDefaultSprite();
		spr02 = VISUALFACTORY.MakeDefaultSprite();
		spr03 = VISUALFACTORY.MakeDefaultSprite();
		spr01.position.x = -512;
		spr02.position.x = 512;

		RENDERER.AddWorldVisual(spr01);
		RENDERER.AddWorldVisual(spr02);
		RENDERER.AddWorldVisual(spr03);

		var seq = {
            grid: { columns:2, rows:1, stacked:true },
            sequences: [
                { name: 'flicker', framecount: 2, fps:4 }
            ]
        };
        spr03.DefineSequences(SETTINGS.GamePath('resources/crixa.png'),seq);

        obj01 = VISUALFACTORY.MakeGroundPlane({
        	width: 800,
        	depth: 600,
        	color: 0xFF0000
        });
        obj01.position.z = -200;
        RENDERER.AddWorldVisual(obj01);

        obj02 = VISUALFACTORY.MakeSphere({
        	radius:100,
        	color: 0x00FF00
        });
        obj02.position.z = -250;
        RENDERER.AddWorldVisual(obj02);

		var ambientLight = new THREE.AmbientLight(0x222222);
      	RENDERER.AddWorldVisual(ambientLight);

		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 1, 1).normalize();
		RENDERER.AddWorldVisual(directionalLight);

		console.groupEnd();

		console.info("NOTE: WorldCam is set between 2D and 3D modes every few seconds, which creates a visual jump\n\n");


	}

	var counter = 0;
	var mode3d = true;
	function API_HandleStep ( interval_ms ) {
		// sprite rotate by rotating the material
		var mat = spr01.material;
			mat.rotation += 0.05;
			mat = spr02.material;
			mat.rotation -= 0.01;
			mat = spr03.material;
			mat.rotation -= 0.02;

		obj01.rotation.x += 0.1;

		var vp = RENDERER.GetViewport();
		var cam = vp.GetWorldCam();
		obj02.rotation.y += 0.01;

		counter += interval_ms;
		if (counter>3000) {
			counter=0;
			mode3d = !mode3d;
		}
		if (mode3d) RENDERER.SelectWorld3D();
		else RENDERER.SelectWorld2D();


	}

///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MAIN;

});
