IMPLEMENT MovingPiece functions

this.maxSpeed
this.maxAcc
this.maxRotSpeed
this.maxRotAcc - 
this.burstAcc - factor of available burst acceleration
this.burstAccTimeMS - time in milliseconds that burst 
this.burstRotAcc - rotational alleration limit
this.burstRotAccTime - time in millisconds that burst rotation is available
this.direction - normalized direction vector
this.flightmode - mode object
this.fuel - amount of fuel
this.fuelBurnRate - fuel burned per second of active thrust
this.friction - how much to reduce velocity each step

FlyTo(point, [mode]) - rotate toward point, and thrust toward
.. thrust bias: how much counter-thrust bias to apply. 0.5 is 
.. standoff: minimum range from point
.. closeness outer range to be considered "at point"
.. avoidance: 0..range whether to project collision vector from current velocity vector
.. economy: at 1 expend minimum fuel, at 0 maximize thrust
SlideTo(point, [mode]) - thrust toward point, without modifying rotation
PointAt(point, [mode]) - rotate to face point
Orbit(point, [mode]) - fly to point with intention of flying around it


AimAt(piece, [mode]) - point at piece, call lockcb when solution is targeted
Flee(piece||pieceList, [mode]) - move away from piece(s). 


ThrustForward(acc)
ThrustReverse(acc)
ThrustLeft(acc)
ThrustRight(acc)

# CALCULATE HOW MUCH ACCELERATION TO GET TO A PLACE IN TIME

The piece will have to calculate the acceleration to get from current location to desired location in the desired time remaining. 

distance(t) = velocity * time
distance(t) = acceleration * time * time
velocity(t) = v0 + acceleration * time
velocity(t) = force * time / mass
acceleration = force / mass

time to destination = distance/velocity
time to destination = sqrt(distance/acceleration )


