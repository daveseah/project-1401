/* timer .js */
define ([
	'1401/settings'
], function ( 
	SETTINGS
) {

	var DBGOUT = true;

/**	Timer *******************************************************************\

	Constructor function Timer() also has some utility functions attached
	as static, global class management.

	SetNotifyDelayed ( f )
	SetNotifyComplete ( f) 
	SetNotifyRepeat ( f )

	SetModeCounter ()
	SetModeTimer ()
	SetModeOneShot ()
	SetModeRepeat ( count )

	Start ( period, delay )
	Reset ( f )
	Pause ()
	UnPause()
	TogglePause()

	IsComplete()
	IsDelayed()
	IsRunning()
	IsPaused()

	TimeElapsed()
	TimeRemaining()

	Count()
	CountRemaining()

	Update(elapsed_ms)
	Dispose () -- this is a module-level thing.

/** OBJECT DECLARATION ******************************************************/

///	Timer ////////////////////////////////////////////////////////////////////

	/* constructor */
	function Timer () {
		this.id = ++Timer.idCounter;
		this.Reset();
	}
	/* class id counter */
	Timer.idCounter = 0;
	/* class constants - mode */
	Timer.MODE_ONESHOT 		= 1;	// timer complete at end of period
	Timer.MODE_REPEAT 		= 2;	// timer repeats every period
	Timer.MODE_LOOP 		= 3;	// timer repeats every period N times
	Timer.MODE_TIMER		= 4;	// timer just keeps track of time
	Timer.MODE_COUNTER		= 5;	// counter counts every period
	/* class constants - timer state */
	Timer.WAITING			= 10;	// created but not initialized
	Timer.READY 			= 11;	// initialized and ready to go
	Timer.DELAYED			= 12;	// 
	Timer.RUNNING 			= 13;	// actively timing
	Timer.COMPLETE 			= 14;	// timing completed
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('SetModeCounter', function () {
		this.mode = Timer.MODE_COUNTER;
		this.loop_count = 0;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('SetModeTimer', function () {
		this.mode = Timer.MODE_TIMER;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('SetModeOneShot', function () {
		this.mode = Timer.MODE_ONESHOT;
		this.loop_count = 0;
		this.loop_max = 1;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('SetModeRepeat', function ( count ) {
		if (count) {
			this.mode = Timer.MODE_LOOP;
			this.loop_count = 0;
			this.loop_max = count;
		} else {
			this.mode = Timer.MODE_REPEAT;
			this.loop_count = 0;
			this.loop_max = -1; // this doesn't affect any calculations
		}
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('SetNotifyDelayed', function ( f ) {
		if (!f) {
			this.notifyDelayed = null;
		} else {
			console.assert (f && (typeof f == 'function'),"need function or null!");
			this.notifyDelayed = f;
		}
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('SetNotifyComplete', function ( f ) {
		if (!f) {
			this.notifyComplete = null;
		} else {
			console.assert (f && (typeof f == 'function'),"need function or null!");
			this.notifyComplete = f;
		}
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('SetNotifyRepeat', function ( f ) {
		if (!f) {
			this.notifyRepeat = null;
		} else {
			console.assert (f && (typeof f == 'function'),"need function or null!");
			this.notifyRepeat = f;
		}
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	Start the timer
/*/	Timer.method('Start', function ( period, delay ) {
		console.assert(period,"Timer.Start: Defaulting to 3000ms");
		period = period || 3000;
		delay = delay || 0;
		this.period = period;
		this.delay = delay;
		this.time_start = SETTINGS.MasterTime();
		this.status = Timer.READY;
		if (this.delay!==0) {
			this.time_end = this.time_start + this.delay;
			this.status = Timer.DELAYED;
		} else {
			this.time_end = this.time_start + this.period;
			this.status = Timer.RUNNING;
		}
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('Reset', function ( f ) {
		this.mode = Timer.MODE_ONESHOT;
		this.status = Timer.WAITING;
		this.isPaused = false;

		this.period = 3000;	// duration/period in milliseconds
		this.delay = 0;		// delay in milliseconds
		
		this.time_start = null;
		this.time_end = null;
		this.loop_max = 1;
		this.loop_count = 0;
		
		this.notifyRepeat = null;
		this.notifyComplete = null;
		this.notifyDelayed = null;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('Pause', function () { this.isPaused = true; });
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('UnPause', function () { this.isPaused = false; });
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('TogglePause', function () { this.isPaused = !this.isPaused; });
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('IsComplete', function () {
		return (this.status===Timer.COMPLETE);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('IsDelayed', function () {
		return (this.status===Timer.DELAYED);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('IsRunning', function () {
		return (this.status===Timer.RUNNING);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('IsPaused', function () {
		return (this.isPaused);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('TimeElapsed', function () {
		return m_GetSystemTimestep() - this.time_start;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('TimeRemaining', function () {
		// in timer mode, there's ALWAYS more time...
		if (this.mode==Timer.MODE_TIMER) return 1;
		// otherwise, return positive remaining time in milliseconds
		var tt = this.time_end - m_GetSystemTimestep();
		if (tt<0) tt = 0;
		return tt;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('Count', function () {
		return this.loop_count;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('CountRemaining', function () {
		// in counter mode, there's always one more
		if (this.mode==Timer.MODE_COUNTER) return 1;
		if (this.mode==Timer.MODE_REPEAT) return 1;

		// otherwise, return remaining count
		return this.loop_max - this.loop_count;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/*/	internal method to update timer state, called by m_Update()
/*/	Timer.method('Update', function ( elapsed_ms ) {

		// are we paused? extend the time_end by current interval
		if (this.isPaused) {
			this.time_end += elapsed_ms;
			return;
		}
		// nothing to do? then just return
		if (this.status===Timer.WAITING) return;
		if (this.status===Timer.COMPLETE) return;

		var current_time = m_GetSystemTimestep();

		// otherwise, do timer magic!
		switch (this.status) {
			case Timer.DELAYED:
				if (current_time > this.time_end) {
					this.time_end = this.time_end + this.period;
					this.status = Timer.RUNNING;
					if (this.notifyDelayed)
						this.notifyDelayed.call({});
				}
				break;
			case Timer.RUNNING:
				if (this.mode == Timer.MODE_TIMER) break;
				if (current_time > this.time_end) {
					switch (this.mode) {
						case Timer.MODE_ONESHOT:
							this.status = Timer.COMPLETE;
							if (this.notifyComplete) 
								this.notifyComplete.call({});
							break;
						case Timer.MODE_REPEAT:
							this.status = Timer.RUNNING;
							this.time_start = current_time;
							this.time_end = this.time_start + this.period;
							if (this.notifyRepeat)
								this.notifyRepeat.call({});
							break;
						case Timer.MODE_LOOP:
							if (++this.loop_count < this.loop_max) {
								this.status = Timer.RUNNING;
								this.time_start = current_time;
								this.time_end = this.time_start + this.period;
								if (this.notifyRepeat)
									this.notifyRepeat.call({});
							} else {
								this.status = Timer.COMPLETE;
								if (this.notifyComplete) 
									this.notifyComplete.call({});
							}
							break;
						case Timer.MODE_COUNTER:
							++this.loop_count;
							this.time_start = current_time;
							this.time_end = this.time_start + this.period;
							if (this.notifyRepeat)
								this.notifyRepeat.call({});
							break;

					} // switch: mode
				}
				break;
		} // switch: status

	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.method('Dispose', function () {
		m_DisposeTimer(this);
	});



/** MODULE DATA STRUCTURES ***************************************************/

	Timer.pool_size = 100;
	Timer.pool = [];
	Timer.pool_index = 0;

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.InitializePool = function ( psize ) {
		Timer.pool_size = psize || Timer.pool_size;
		for (var i=0;i<Timer.pool_size;i++){
			var tobj = {
				timer: new Timer(),
				allocated: false,
				index: i
			};
			Timer.pool[i] = tobj;
		}
	};

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.NewTimer = function ( period, delay ) {
		var timer = null;
		var tobj;
		for (var i=0;i<Timer.pool_size;i++) {
			tobj = Timer.pool[Timer.pool_index];
			if (!tobj.allocated) {
				tobj.allocated = true;
				timer = tobj.timer;
				timer.Reset();
				break;
			}
			Timer.pool_index++;
			if (Timer.pool_index>Timer.pool_size) Timer.pool_index = 0;
		}
		console.assert(timer,"*** ERR *** all timers allocated");
		if (DBGOUT) console.log("Timer.NewTimer: timer",timer.id,"allocated");
		return timer;
	};

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.DisposeTimer = function ( timer ) {

		var found = false;
		var tobj = null;
		for (var i=0;i<Timer.pool_size;i++) {
			tobj = Timer.pool[Timer.pool_index];
			if (tobj.timer===timer) {
				tobj.allocated = false;
				tobj.timer.Reset();
				found = true;
				break;
			}
			Timer.pool_index++;
			if (Timer.pool_index >= Timer.pool_size) Timer.pool_index = 0;		
		}
		if (DBGOUT) {
			if (found) 
				console.log("Timer.DisposeTimer: timer",tobj.timer.id,"released");
			else 
				console.log("Timer.DisposeTimer: timer",timer.id,"was not found in pool");
		}
	};
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Timer.HeartBeat = function ( interval_ms ) {
		for (var i=0;i<Timer.pool_size;i++) {
			tobj = Timer.pool[Timer.pool_index];
			if (tobj.allocated) tobj.Update ( interval_ms );
		}
	};


/** RETURN CONSTRUCTOR *******************************************************/

	return Timer;

});