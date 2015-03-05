/* demo/test/03.js */
define ([
	'1401/objects/sysloop',
	'1401/settings',
	'1401/system/renderer',
	'1401/system/visualfactory',
	'1401/system/piecefactory',
], function ( 
	SYSLOOP,
	SETTINGS,
	RENDERER,
	VISUALFACTORY,
	PIECEFACTORY
) {

	var DBGOUT = true;

///////////////////////////////////////////////////////////////////////////////
/**	SUBMODULE TEST01 *********************************************************\

	This submodule of demogame constructs some test shapes. It is hooked-in
	to the master lifecycle through SYSLOOP, receiving events that it has
	opted-in to receive.

		Connect
		LoadAssets
		Initialize
		Construct
		Start
	
		GetInput
		Update
		Think
		OverThink
		Execute

	Note that the handlers for GetInput(), Update(), and the AI methods
	Think(), OverThink(), and Execute() have to be explicitly enabled. These
	events are also not passed UNLESS game-main


///////////////////////////////////////////////////////////////////////////////
/** MODULE DECLARATION *******************************************************/

	var MOD = SYSLOOP.New("Test03");
	MOD.EnableUpdate( true );

	MOD.SetHandler( 'Start', m_Start );
	MOD.SetHandler( 'Construct', m_Construct );
	MOD.SetHandler( 'Update', m_Update);


///////////////////////////////////////////////////////////////////////////////
/** PRIVATE VARS *************************************************************/

	var crixa;
	var starfields = [];


///////////////////////////////////////////////////////////////////////////////
/** MODULE HANDLER FUNCTIONS *************************************************/

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_Construct() {

		console.group("Starfield");

			/* make starfield */
			var starSpec = {
				color: new THREE.Color(1,1,1),
				parallax: 1
			};		
			starfields = [];
			for (var i=0;i<3;i++) {
				starSpec.color.multiplyScalar(0.7);
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
	        shipSprite.PlaySequence("flicker");
	        crixa = PIECEFACTORY.NewPiece("crixa");
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

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_Start() {
	}	

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	var counter = 0;
	var dx = 3;
	function m_Update ( interval_ms ) {

		/* move ship */
		var x = crixa.position.x + dx;
		if ((x > 2000)||(x < -2000)) {
			dx = dx * -1;
			var rot = (dx>0) ? 0 : Math.PI;
			crixa.SetRotationZ(rot);
		}
		crixa.SetPositionX(x);

		var vp = RENDERER.Viewport();
		vp.Track(crixa.Position());

		/* rotate stars */	
		var layers = starfields.length;
		for (var i=0;i<starfields.length;i++){
			var sf = starfields[i];
			sf.TrackX(x);
		}

		counter += interval_ms;
	}


///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MOD;

});
