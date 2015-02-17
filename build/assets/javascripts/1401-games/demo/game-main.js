/* demo/game-main.js */
define ([
	'1401/settings',
	'1401/objects/sysloop',
	'1401/system/renderer',
	'1401/system/visualfactory'
], function ( 
	SETTINGS,
	SYSLOOP,
	RENDERER,
	VISUALFACTORY
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
		spr01 = VISUALFACTORY.MakeDefaultSprite();
		spr02 = VISUALFACTORY.MakeDefaultSprite();
		spr03 = VISUALFACTORY.MakeDefaultSprite();
		spr01.position.x = -350;
		spr02.position.x = 350;

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

	}

	function API_HandleStep () {
		// sprite rotate by rotating the material
		var mat = spr01.material;
			mat.rotation += 0.05;
			mat = spr02.material;
			mat.rotation -= 0.01;
			mat = spr03.material;
			mat.rotation -= 0.02;
	}

///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MAIN;

});
