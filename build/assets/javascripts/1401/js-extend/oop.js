/* OOP */
define (function () {

/**	JAVASCRIPT EXTENSIONS ***************************************************\

	These are extensions to the built-Javascript objects that make my life
	a tiny bit better.

\****************************************************************************/

/// OBJECT INHERITANCE ///////////////////////////////////////////////////////

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Add 'method' method to all functions, so there is less mucking about with
	ugly prototype assignments. Compare:

	Piece.prototype.fooMethod = function() { ... };
	...to...
	Piece.method('foo',function() { ... });	

/*/	if (!Function.prototype.method) {	
		Function.prototype.method = function (name, func) {
			// 'this' = constructor function object
			// 'this.prototype' = function object w/ methods
			// add the method
			this.prototype[name] = func;
			// add lame "super" support
			var sup = this.superproto;
			if (sup && sup[name]) {
				// save the function call of overridden method
				// access via contructorfunction.superMethod['method'].call()
				if (!this.superMethod) this.superMethod = {};
				this.superMethod[name] = sup[name];
			}
			// return the function object for assignment
			return this;
		};
	} else {
		console.warn('JSHACKS: Function.prototype.method already exists');
	}

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Likewise for object inheritance, replace:
	MovingPiece.prototype = Object.create(Piece.prototype);
	MovingPiece.prototype.constructor = MovingPiece;
	...with...
	MovingPiece.inheritsFrom(Piece);

	inheritsFrom() operates on constructor function objects. It creates a new
	prototype object from the passed constructor function, which allows
	Javascript inheritance to work.

	We also save superproto, which points to the prototype of the parent 
	constructor function containing all its methods so we can save a reference 
	to it in the 'method' function above, which gives us something of an
	ability to use a 'super()' style call in methods.
/*/
	if (!Function.prototype.inheritsFrom) {
		Function.prototype.inheritsFrom = function ( otherConstructor ) {
			// 'this' = constructor function object, not created instance
			// create function prototype chain
			this.prototype = Object.create ( otherConstructor.prototype );
			this.prototype.constructor = this;
			this.superproto = otherConstructor.prototype;
		};
	} else {
		console.warn('JSHACKS: Function.prototype.inheritsFrom already exists');
	}

///////////////////////////////////////////////////////////////////////////////
/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	// we're just executing code during master.js init, which makes these
	// extensions available globally. No need to return a "real" module
	
	return {};
	
});