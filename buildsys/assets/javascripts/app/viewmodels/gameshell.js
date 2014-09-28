/* gameshell.js */
define ([ 
    'durandal/app', 
    'knockout', 
    'gamesys/master' 
], function (
    app, 
    ko, 
    MASTER
) {


///////////////////////////////////////////////////////////////////////////////
/** PUBLIC API **************************************************************/

    var MOD = {};
    MOD.displayName = 'GameShell';
    MOD.description = 'Game system testing code';
    MOD.compositionComplete = function () {
        var spec = {
            game: 'demo'
        };
        MASTER.Start( this, spec );
    };

///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/
    return MOD;

});


