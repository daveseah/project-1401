/* demo/test/007.js */
define ([
	'keypress',
	'physicsjs',
	'1401/objects/sysloop',
	'1401/settings',
	'1401/system/renderer',
	'1401/system/visualfactory',
	'1401/objects/logic/checkinmonitor'
], function (
	KEY,
	PHYSICS,
	SYSLOOP,
	SETTINGS,
	RENDERER,
	VISUALFACTORY,
	CheckInMonitor
) {

	var DBGOUT = true;

///////////////////////////////////////////////////////////////////////////////
/**	SUBMODULE TEST 007 *******************************************************\

	Test SYSLOOP.LoadAssets() calls

///////////////////////////////////////////////////////////////////////////////
/** MODULE DECLARATION *******************************************************/

	var MOD = SYSLOOP.New("Test07");

	MOD.SetHandler( 'LoadAssets', m_LoadAssets );
	MOD.SetHandler( 'Construct', m_Construct );
	MOD.SetHandler( 'Start', m_Start );

	var that = this;

///////////////////////////////////////////////////////////////////////////////
/** MODULE HANDLER FUNCTIONS *************************************************/

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_LoadAssets( checkIn ) {
		console.group("LoadAssets");

		// create list of yaml to load
		var yamls = [];
		yamls.push(SETTINGS.GamePath('config/config01.yaml'));
		yamls.push(SETTINGS.GamePath('config/config02.yaml'));
		yamls.push(SETTINGS.GamePath('config/config03.yaml'));

		// create a new CheckInMonitor to handle our subyaml loads
		var mycim = new CheckInMonitor( that, f_LoadComplete );
		mycim.ShowDebug(true);
		for (var i=0;i<yamls.length;i++) {
			SETTINGS.ManagedLoad( yamls[i], mycim.NewCheckIn('yaml'+i) );
		}
		// when the loads are all queued, activate the monitor
		mycim.Activate();

		// this is called when the monitored loads are done
		function f_LoadComplete () {
			console.log("DONE! SETTINGS('gamemeta') is:",SETTINGS('gamemeta'));
			console.log('Arbitrary delay 3000 milliseconds before firing notify...');
			// CRITICAL: tell master notify we're done!
			setTimeout(function(){
				checkIn.Notify();
				console.log('.. master startup continues!');
				mycim.ShowDebug(false);
			}, 3000);
		}

		console.groupEnd();
	}
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_Construct() {
		console.group("Construct");
		console.groupEnd();
	}

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	function m_Start() {
		console.group("Start");

		window.DBG_Out( "TEST 007 <b>Synchronized LoadAssets Test</b>" );
		window.DBG_Out( "See console for debug test messages" );

		console.groupEnd();
	}	




///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
	return MOD;

});
