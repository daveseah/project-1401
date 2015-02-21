/* debug.js */
define ([
], function ( 
) {

	var DBGOUT = true;

/**	Debug *******************************************************************\

	The Debug object implements utilities for debugging and documenting.
	It will eventually implement an on-screen console, but right now it's
	just a stub for some documentation routines.

/** MODULE DECLARATION ******************************************************/

	var API = {};
	API.name = "debug";


///	INSPECTION ROUTINES //////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	InspectModule() prints a list of public properties and methods for each
	require module that contains the passed string. It returns a string, so
	you will have to console.log() to see the output.
/*/	API.InspectModule = function ( str ) {
		var rm = require.s.contexts._.defined;
		var mlist = [];
		var base = 'inqsim/';
		str = (typeof str =='string') ? str : base;

		Object.keys(rm).forEach(function(key){
			var name = key.toString();
			if (name.indexOf(str)>=0) {
				mlist.push(key);
			}
		});

		var out = '\n';
		for (var i=0;i<mlist.length;i++) {
			var objName = mlist[i];
			out += objName+'\n';
			if (str!==base) {
				out+= "-----\n";
				var mod = require(objName);
				out += m_DumpObj(mod);
				out += '\n';
			}
		}
		if (mlist.length) 
			return out;
		else 
			return "module " +str.bracket()+" not found";
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	InspectObject() accepts an object and a label, and prints a list of
	all the methods and properties in it. It returns a string, so you will
	have to console.log() to see the output.
/*/	API.InspectObject = function ( obj, depth ) {
		depth = depth || 0;
		var label = obj.constructor.name || '(anonymous object)';
		var indent = "";
		var out="";
		for (var i=0;i<=depth;i++) indent+='\t';

		out+= label+'\n';
		out+= "\n";
		out += m_DumpObj(obj, depth+1);
		var proto = Object.getPrototypeOf(obj);
		if (proto) {
			out += "\n"+indent+"IN PROTO: ";
			out += API.InspectObject(proto,depth+1);
			out += "\n";
		}
		if (depth===0) out = '\n'+out;
		return out;
	};


/** SUPPORTING FUNCTIONS ****************************************************/

/*/	Support function for InspectModule() and InspectObject()
/*/	function m_DumpObj ( obj, depth ) {
		var indent = "";
		for (var i=0;i<depth;i++) indent+='\t';

		var str = "";
		Object.keys(obj).forEach(function(key){
			var prop = obj[key];
			var type = typeof prop;
			str += indent;
			str += type + '\t'+key;
			switch (type) {
				case 'function':
					var regexp = /function.*\(([^)]*)\)/;
					var args = regexp.exec(prop.toString());
					str+= ' ('+args[1]+')'; 
					break;
				default:
					break;
			}
			str += '\n';
		});	
		return str;
	}


/** RETURN MODULE ************************************************************/

	return API;

});