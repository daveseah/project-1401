/* demo/test/002.js */
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
/**	SUBMODULE TEST 002 *******************************************************\

	Finite Starfield Test

///////////////////////////////////////////////////////////////////////////////
/** MODULE DECLARATION *******************************************************/

	var MOD = SYSLOOP.New("Test02");
	MOD.EnableUpdate( true );

	MOD.SetHandler( 'Construct', m_Construct );
	MOD.SetHandler( 'Start', m_Start );
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
			var spec = {
				color: new THREE.Color(1,1,1),
				width: 10,
				height: 10
			};
			starfields = [];
			for (var i=0;i<3;i++) {
				spec.color.multiplyScalar(0.7);
				var sf = VISUALFACTORY.MakeStarField( spec );
				sf.scale.set(1000,1000,1);
				sf.position.set(0,0,-100-i);
				RENDERER.AddWorldVisual(sf);
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
	        shipSprite.DefineSequences(SETTINGS.AssetPath('resources/crixa.png'),seq);
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
		window.DBG_Out( "TEST 002 <b>Finite Star Scroll Parallax</b>" );
		window.DBG_Out( "<tt>game-main include: 1401-games/demo/tests/002</tt>" );
	}	

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	var counter = 0;
	var dx = 3;
	function m_Update ( interval_ms ) {

		var vp = RENDERER.Viewport();
		var dim = vp.Dimensions();
		var width = dim.width/2;
		/* move ship */
		var x = crixa.position.x + dx;
		if ((x > width)||(x < -width)) {
			dx = dx * -1;
			var rot = (dx>0) ? 0 : Math.PI;
			crixa.SetRotationZ(rot);
		}
		crixa.SetPositionX(x);

		vp.Track(crixa.Position());

		/* rotate stars */	
		var layers = starfields.length;
		for (var i=0;i<starfields.length;i++){
			var mult = i/layers;
			var sf = starfields[i];
			sf.position.x = x*mult;
		}

		counter += interval_ms;
	}


///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MOD;

});
