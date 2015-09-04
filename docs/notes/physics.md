# The Challenge of Agent Guidance

I didn't expect motion control of pieces to be so confusing. I figured there must be obvious and well-known approaches to applying forces to a body in a two-dimensional space. I didn't find this to be the case, but here's what I've discovered.

1. The equations that allow us to prediction motion based on distance, velocity, acceleration, and time are called **kinematics**. This is what we learned in high school, solving for these quantities given a set of initial conditions to find an **exact answer**. 

2. I thought that I could trivially solve the kinematics equations to find the forces that lead to an optimal path. This is not the case. Most of the guides I found in text books and online references did the following:

	A. Applied a scaling factor to a computed desired velocity vector, and updated the position directly without using forces or acceleration. 
	B. Used calculated paths to set position directly.

From what I can tell, there is no easy analytic solution that lends itself to a simple implementation. Too many variables and unknowns; one would need to search the solution space of forces, angles, accelerations using numerical methods. I am not familiar enough with the mathematics to really tell.

3. On a related note, there are a few common approaches to solving the problem of guidance in a video game.

* In the world of video games, there is something called **[steering behaviors][steering]**, which are a set of algorithms for SEEK, ARRIVE, FLEE, PURSUE, and so forth. The mathematics in the tutorials follow the model of 2A, not using a physics-based approach.

* In the real world, there is a general control system concept known as Proportional-Integral-Derivative (PID). [PID controllers][pid] work by varying a control based on sensors that measure the error between desire outcome and current state; it is a combination of the current error, the accumulated errors (I) to now, and future errors (D). It does NOT guarantee an optimal solution, but in practice it can be used to [control a force-based simulation][pid-game] that is tuned to work well-enough. For [optimal control][optimal], one must solve a series of differential equations. 

* Game developers have also taken simpler [control approaches][controllers], such as calculating [counter acting forces][steering-physics] and incorporating [prediction][steering-prediction] into the steering algorithms. 

A good overview of different approaches to all these kinds of problems can be found in the online course material provided by Thomas Schwartz. In particular, the [movement in games][movement] powerpoint deck is really helpful in understanding the kinds of problems. The book "Artificial Intelligence for Games, 2nd Edition" is also part of his syllabus (ordered).

[controllers]:http://en.wikipedia.org/wiki/Controller_(control_theory)#Types_of_controller
[steering]:http://gamedevelopment.tutsplus.com/series/understanding-steering-behaviors--gamedev-12732
[steering-physics]:http://gamedev.stackexchange.com/questions/72186/how-to-apply-steering-to-a-physics-body-correctly-when-using-a-physics-engine
[steering-prediction]:http://www.iforce2d.net/b2dtut/rotate-to-angle
[pid]:http://en.wikipedia.org/wiki/PID_controller
[pid-game]:http://www.gamedev.net/page/resources/_/technical/math-and-physics/pid-control-of-physics-bodies-r3885
[optimal]:http://en.wikipedia.org/wiki/Optimal_control
[tschwartz196]:http://www.cse.scu.edu/~tschwarz/COEN196_13/ln.html
[tschwartz266]:http://www.cse.scu.edu/~tschwarz/coen266_09/ln.html
[movement]:http://www.cse.scu.edu/~tschwarz/coen266_09/PPT/Movement%20for%20Gaming.ppt


# KINEMATIC EQUATION NOTES

kinematics describe motion. The big 4:

d = vi*t + 1/2 at^2
vf^2 = vi^2 + 2ad
vf = vi + at
d = (vi+vf)/2 * t

vi =  initial velocity
vf = final velocity


# STEERING BEHAVIOR NOTES

SEEK - will overshoot
    desired_velocity = normalize (position - target) * max_speed
    steering = desired_velocity - velocity

ARRIVAL - will scale vector
    target_offset = target - position
    distance = length (target_offset)
    ramped_speed = max_speed * (distance / slowing_distance)
    clipped_speed = minimum (ramped_speed, max_speed)
    desired_velocity = (clipped_speed / distance) * target_offset
    steering = desired_velocity - velocity

THere apparently is not much literature on combining steering behaviors with rigid body physics. This is a difficult controller problem, not one that can be solved easily. The way people seem to solve it is through direct application of forces.
Rather than calculate counter-thrust, they use damping.

Applying the approach in 3. and 4 seems to work. The approach seems to be:

1. calculate steering vector
2. calculate, based on current linear and angular velocity, what the next timestep's distance and angle will be
3. calculate difference between steering vector and predicted vector
4. apply counteracting forces based on "closing" (reduced) or "clamped"

