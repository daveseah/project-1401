/* demo/test/04.js */
define ([
	'keypress',
	'physicsjs',
	'1401/objects/sysloop',
	'1401/settings',
	'1401/system/renderer',
	'1401/system/visualfactory',
	'1401/system/piecefactory',
	'1401-games/demo/controls'
], function ( 
	KEY,
	PHYSICS,
	SYSLOOP,
	SETTINGS,
	RENDERER,
	VISUALFACTORY,
	PIECEFACTORY,
	SHIPCONTROLS
) {

	var DBGOUT = true;

///////////////////////////////////////////////////////////////////////////////
/**	SUBMODULE TEST 004 *******************************************************\

	Add Physics and Controls


///////////////////////////////////////////////////////////////////////////////
/** MODULE DECLARATION *******************************************************/

	var MOD = SYSLOOP.New("Test03");
	MOD.EnableUpdate( true );
	MOD.EnableInput( true );

	MOD.SetHandler( 'GetInput', m_GetInput);
	MOD.SetHandler( 'Start', m_Start );
	MOD.SetHandler( 'Construct', m_Construct );
	MOD.SetHandler( 'Update', m_Update);


///////////////////////////////////////////////////////////////////////////////
/** PRIVATE VARS *************************************************************/

	var crixa;				// ship piece
	var crixa_inputs;		// encoded controller inputs
	var starfields = [];	// parallax starfield layersey


///////////////////////////////////////////////////////////////////////////////
/** MODULE HANDLER FUNCTIONS *************************************************/

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_Construct() {

		console.group("Starfield");

			/* make starfield */
			var starBright = [ 
				new THREE.Color( 1.0, 1.0, 1.0 ),
				new THREE.Color( 0.5, 0.5, 0.7 ),
				new THREE.Color( 0.3, 0.3, 0.5 )
			];
			var starSpec = {
				parallax: 1
			};		
			starfields = [];
			for (var i=0;i<3;i++) {
				starSpec.color=starBright[i];
				var sf = VISUALFACTORY.MakeStarField( starSpec );
				starSpec.parallax *= 0.5;
				sf.position.set(0,0,-100-i);
				RENDERER.AddBackgroundVisual(sf);
				starfields.push(sf);
			}

			/* make crixa ship */
			var shipSprite = VISUALFACTORY.MakeDefaultSprite();
			RENDERER.AddWorldVisual(shipSprite);
			var seq = {
	            grid: { columns:2, rows:1, stacked:true },
	            sequences: [
	                { name: 'flicker', framecount: 2, fps:4 }
	            ]
	        };
	        shipSprite.DefineSequences(SETTINGS.GamePath('resources/crixa.png'),seq);
	       	// shipSprite.PlaySequence("flicker");
	        crixa = PIECEFACTORY.NewMovingPiece("crixa");
	        crixa.SetVisual(shipSprite);
	        crixa.SetPositionXY(0,0);

	        /* add lights so mesh colors show */
			var ambientLight = new THREE.AmbientLight(0x222222);
	      	RENDERER.AddWorldVisual(ambientLight);

			var directionalLight = new THREE.DirectionalLight(0xffffff);
			directionalLight.position.set(1, 1, 1).normalize();
			RENDERER.AddWorldVisual(directionalLight);

		console.groupEnd();

		// console.info("NOTE: WorldCam is set between 2D and 3D modes every few seconds, which creates a visual jump\n\n");
	}

///	HEAP-SAVING PRE-ALLOCATED VARIABLES /////////////////////////////////////

	var x, rot, vp, layers, i, sf;
	var cin;

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_Start() {
		SHIPCONTROLS.BindKeys();
	}	

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_GetInput ( interval_ms ) {
		cin = crixa_inputs = SHIPCONTROLS.GetInput();
		if (!!crixa_inputs.forward_acc) {
			crixa.Visual().GoSequence("flicker",1);
		} else {
			crixa.Visual().GoSequence("flicker",0);
		}
		crixa.Accelerate(cin.forward_acc,cin.side_acc);
		crixa.Brake(crixa_inputs.brake_lin);
		crixa.AccelerateRotation(cin.rot_acc);
		crixa.BrakeRotation(crixa_inputs.brake_rot);
	}

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	var counter = 0;
	var dx = 3;
	function m_Update ( interval_ms ) {

		vp = RENDERER.Viewport();
		vp.Track(crixa.Position());


		/* rotate stars */	
		layers = starfields.length;
		for (i=0;i<starfields.length;i++){
			sf = starfields[i];
			sf.Track(crixa.Position());
		}

		counter += interval_ms;
	}


///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MOD;

});
