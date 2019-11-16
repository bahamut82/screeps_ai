var taskManager = require('task.manager');
var task = 'pickup';

var pickupResource = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // when on another task, return;
        if ( creep.memory.task && creep.memory.task !== task ) {
            return;
        }
	    if ( creep.store.getFreeCapacity() > 0 ) {
	        taskManager.startTask(creep, task);
	        // TODO: add other resource types (initial implementation made only for RESOURCE_ENERGY)
	        var isTombstone = true;
	        var target = undefined;
	        // find non-empty tombstone (at least 10 energy)
	        target = creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter : function(tomb) { return tomb.store[RESOURCE_ENERGY] > 10 } });

	        if ( !target ) {
	        	isTombstone = false;
	        	target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: function(resource) { return resource.resourceType === RESOURCE_ENERGY } } );
	        }

	        if ( !target ) {
	        	taskManager.finishTask(creep);
	        	return;
	        }

	        var pickupResult = undefined;
	        if ( isTombstone ) {
	        	pickupResult = creep.withdraw(target, RESOURCE_ENERGY);
	        } else {
	        	pickupResult = creep.pickup(target);
	        }
        	if ( pickupResult === ERR_NOT_IN_RANGE ) {
        		creep.moveTo(target);
        	} else if ( pickupResult === ERR_FULL ) {
        		taskManager.finishTask(creep);
        	} else if ( pickupResult !== OK ) {
        		console.log("task.pickup: unhandled withdrawResult = " + withdrawResult);
        	}

            return;
        }

        taskManager.finishTask(creep);

	}
};

module.exports = pickupResource;