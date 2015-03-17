AI NOTES

Let's start with the idea of a SHIP ON PATROL, and give it the following orders:

DEFAULT ORDER
* ship will go from A to B to C and then return to A. 
* ship will choose its own speed

REPORTING ORDER
* if it is determined that the default order can not be executed, or it's overriden by a higher-priority order, then execute either a HOLD or RETURN TO BASE command.

STANDING ORDERS
* preserve self - if fuel, health, or threat detected, assess and choose most valuable course of action. This happens every so often
* attack enemies - if an enemy is detected, add to "threat list" and invoke attack algorithm
* avoid enemies - if under fire, add to "attacker list" and invoke manuevering commands
* discover anomalies - if a target of interest is within range, invoke an algorithm appropriate to the ship's capabilities and target type
* respond to sos - if a nearby ally is in trouble, then go to its aid
* broadcast status - when attacked, attacking, or discovering, inform command

RADIO SYSTEM
SELF EVALUATION
COMMAND PRIORITIZING
ALGORITHM FOR DOING THINGS
MODE ATTACK
MODE EVADE

Now, let's try working through Robot Behaviors

DEFAULT ORDERING
* robot waits for command to shield, spray, or move
* robot animates self based on state
* robot receives command
* robot animates self, signals when it is done
* robot waits for receipt of command to proceed
* robot updates its state, and repeats cycle

STANDING ORDER
* animate self based on its program stage and state.

ROBOT PROGRAM

initialize state, initialize event handlers

check run mode...execute command or interrupt active?
if command, then:
	wait command, read command state
	select animation sequence to run
	:shield :spray :move :noaction
	initiate animation sequence, signal on complete (robot has flags)
	read self state (hits, progress, etc)
if interrupt, then:
	assess priority queues
	react to highest priority
	.. read associated interrupt state variables (health, hit, attacked by)
	.. issue commands, queue resolution n seconds in the future


HOW TO DEFINE ALL THIS STUFF?

need to define associated properties
.. continuous property
.. filtered continuous property
.. detected condition
.. detected condition, filtered
.. control input
.. sensor input
.. collision notification
.. damage notification
.. override notification
need to define basic operations in terms of the piece itself
targeting: act on these / intents (locationish, pieceish)
targeting: acting on this piece
abort program:
mission program:
standing directives:
.. preserve
.. attack
.. gather
prioritizing system in overthink
many piece utilities to deliver information necessary for making decisions
.. locations of pieces
.. locations of key areas
.. path planning
.. nearby pieces
.. nearby points of interest
.. targeting
.. guidance
.. logical querying
.. visible objects
.. communication system between pieces
.. interaction system between pieces and coordinated visual action
.. .. collisions
.. .. handoffs
.. .. synchronized animations

BREAKING IT DOWN

action:
a named codefragment that runs to completion until it's done. accepts a piece and necessary parameters to run. fire and forget. It might sleep before and after firing.

checked action:
a named codefragement that runs to completion, looping and executing until it detects the condition that allows it to complete. It might sleep before executing again, or checking again

condition: 
a named codefragment that returns a true/false value, accepting parameters that include the piece. These are piece, system or game logic level events, not the code you run to actually check things. 

sensor:
a named codefragement that returns a value of some kind. might return a list of pieces, or an array of data objects, depending on the instrument.

filter:
a named codefragment that runs over a property, converting continuous data to impulse data and vice versa, maintaining state and tracking asynchronous events. 

program:
a named sequence of actions, conditions, and sensors that perform something useful. 

signal event:
an event packet emitted by the program at certain events, which updates the piece's internal state 

state event:
an event packed received by the piece that updates the piece's logical state properties. typical ones might be damage received.

program queues:
mission, standing, timeout, abort program queues make up the AI

states:
data structure that can take one of several modes. Types might be count, elevated, waiting, sequence, reset, set, multiset, advance. Might be similar to triggers.

priority decision queue:
code that evalutes all program queues and assigns urgency, choosing which command to run through to completion.


