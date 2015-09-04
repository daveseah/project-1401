
/***************************************************************************\

	Promises are objects that manage asynchronous code bundled into
	a function object. This code is passed two function callbacks,
	resolve and reject, which are used to signal to the promise when
	it has completed. The async code can be fancy, but it is wrapped
	in a function so it can be self-contained. It just needs to call
	resolve or reject when it's done.

	resolve and reject accept a single "value". This value is optional.

	1. 	create the new promise, passing function that accepts resolve
		and reject callback parameters for signalling. The function can 
		eventually call resolve or reject with a value. 
	2.	call then() on the promise to add async, passing a function that
		accepts a value from the promise's resolve() call
	3. 	the function can then return a value to be passed, or another
		promise. 
	4. 	by returning a bunch of promises in then() chains, you immediately
		a.	create promises with each then, ready to handle resolve()
		b. 	these promises are made pending with each then, holding the
		   	deferred code that has been wrapped
		c. 	when the first resolve triggers, it runs the deferred function
		d.	alternatively, return a value to the next chain


\***************************************************************************/

function Promise (fn) {

	// passed in fn is
	// fn = function (resolve) {
	//        var value = 42;
	//        resolve(value);
	// }

	// initialize state 
	var state = 'pending';
	var value;
	var deferred = null;

 	// this function property returns a new promise
 	// which contains then, state, value, deferred
 	// it immediately calls handle()
 	// when calling then, there are two functions passed
 	// for the onResolved, onRejected parameters
 	// these are saved in a new promise, along with the
 	// parameters for the new promise so they can be passed
 	// to the promise when it's ready to run
 	// handle() is called with the object. 
 	// since the promise is pending, it stores the object as deferred
 	// in THIS promise (not the one returned). 
 	// When resolve() called some time later, 
	this.then = function ( onResolved, onRejected ) {
		return new Promise ( function ( resolve, reject ) {
			handle ({
				onResolved: onResolved,
				onRejected: onRejected,
				resolve: resolve,
				reject: reject
			});
		});
	};

	// call fn right away, passing it the resolve and reject handlers
	fn ( resolve, reject );

	// after construction, the promise is returned!

///	HELPER FUNCTIONS ////////////////////////////////////////////////////////
/*/ newValue is the single value passed back from the wrapped code.
	If newValue is a promise, the then() is called. Remember that then is
	another piece of wrapped code that accepts resolve/reject.
	In any case, the value that's passed to resolve is set as the promise's
	value. 
	If there is a deferred

/*/	function resolve ( newValue ) {
		if ( newValue && typeof newValue.then === 'function') {
			newValue.then(resolve, reject);
			return;
		}
		state = 'resolved';
		value = newValue;

		if(deferred) {
			handle(deferred);
		}
	}

	function reject(reason) {
		state = 'rejected';
		value = reason;

		if(deferred) {
			handle(deferred);
		}
	}

/*/	This is the workhorse function, called by resolve/reject and then.

	new Promise(function(resolve,reject) { 
		resolve(10); 
	}).then(function(res1){
		// do something
	}).then(function(res2)) {
		// do something else
	});

	88: anon function is called with resolve, reject.
	89: this executes right away, calling resolve on the first promise.
	90: then() takes a function as first parameter onResolved,
		which is used to return a new Promise that will call
		handle({onResolved, resolve, reject}). Since the new promise is
		pending, handle() just saves the object. When then() is called
		on this new Promise, it will continue...
	92: then() from line 90 has returned a promise, so this chain does
		the same thing as 90. It creates a new promise, etc.

	So what happens when resolve(10) is called in line 89?
	1. this 'resolve' is a function pointer to the resolve ( newValue ) function.
	newValue is 10, so the value is saved and the state is marked.
	2. resolve continues....there is a deferred handler, saved from when then() 
	was called on the first promise. onResolved is the function passed in then.
	The function fn defined by then() calls handle() with an object of the
	then-fn to execute, and it also saves the resolve PARAMETER that was
	passed in the fn.
	3. resolve continues by examining the deferred handler. the deferred
	call is the function from the then() invocation. This time, when
	handle(deferred) is called, the state is resolved, and handlerCallback
	is set to that.
	.. the value is passed to the onREsolved() call, which itself returns a value
	.. the value is passed to the resolve handler, which chains to the next fn with
	the return value. (i think)

/*/	function handle(handler) {
		// this condition happens when the then(resolve,reject) is called
		// on a promise. handler is a big fat promise object!
		// 
		if(state === 'pending') {
			deferred = handler;
			return;
		}

		// if the state isn't pending, then handle() has been
		// called directly from resolve() or reject()
		// so figure out what to do
		var handlerCallback;

		if(state === 'resolved') {
			handlerCallback = handler.onResolved;
		} else {
			handlerCallback = handler.onRejected;
		}

		// if there is no defined handler 
		if(!handlerCallback) {
			if(state === 'resolved') {
				handler.resolve(value);
			} else {
				handler.reject(value);
			}

			return;
		}

		var ret = handlerCallback(value);
		handler.resolve(ret);
	}

}

