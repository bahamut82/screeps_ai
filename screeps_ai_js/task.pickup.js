var taskManager = require('task.manager');
var task = 'pickup';

var cleanup = function(creep) {
	if ( creep.Memory.pickupTarget ) {
		if ( !Game.getObjectById(creep.Memory.pickupTarget) )
			delete creep.room.Memory.taggedTargets[creep.Memory.pickupTarget];
		else
			creep.room.Memory.taggedTargets[creep.Memory.pickupTarget]--;
	}
	delete creep.Memory.pickupTarget;
};

var pickupResource = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // when on another task, return;
        if ( creep.memory.task && creep.memory.task !== task ) {
            return;
        }
	    if ( creep.store.getFreeCapacity() > 0 ) {
	        taskManager.startTask(creep, task);
	        var target = undefined;

	        var previousTargetId = creep.Memory.pickupTarget;
	        if ( previousTargetId ) {
	        	target = Game.getObjectById( previousTargetId );
	        }

	        // TODO: add other resource types (initial implementation made only for RESOURCE_ENERGY)
	        if ( !target ) {
	        	if ( previousTargetId ) {
	        		// remove previous target from room-memory's taggedTargets
	        		if ( creep.room.Memory.taggedTargets[previousTargetId] )
	        			delete creep.room.Memory.taggedTargets[previousTargetId];
	        	}
		        // find non-empty, untagged tombstone
		        target = creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter : function(tomb) { 
			        	return creep.room.Memory.taggedTargets && creep.room.Memory.taggedTargets[tomb.id] < 1
			        		&& tomb.store[RESOURCE_ENERGY] > 0
			        }
			    });
	        }

	        if ( !target ) {
	        	// find untagged resource (for now only RESOURCE_ENERGY)
	        	target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: function(resource) {
		        		return creep.room.Memory.taggedTargets && creep.room.Memory.taggedTargets[resource.id] < 1
		        			&& resource.resourceType === RESOURCE_ENERGY
		        	}
	        	});
	        }

	        // abort task when no more target can be found
	        if ( !target ) {
	        	cleanup(creep);
	        	taskManager.finishTask(creep);
	        	return;
	        }

	        creep.Memory.pickupTarget = target.id;
	        if ( creep.room.Memory.taggedTargets ) {
	        	creep.room.Memory.taggedTargets[target.id] = 1;
	        }


	        var pickupResult = undefined;
	        if ( target instanceof Tombstone ) {
	        	pickupResult = creep.withdraw(target, RESOURCE_ENERGY);
	        } else {
	        	pickupResult = creep.pickup(target);
	        }
        	if ( pickupResult === ERR_NOT_IN_RANGE ) {
        		creep.moveTo(target);
        	} else if ( pickupResult === ERR_FULL ) {
        		cleanup(creep);
        		taskManager.finishTask(creep);
        	} else if ( pickupResult !== OK ) {
        		console.log("task.pickup: unhandled withdrawResult = " + withdrawResult);
        	}

            return;
        }

   		cleanup(creep);
        taskManager.finishTask(creep);

	}
};

module.exports = pickupResource;