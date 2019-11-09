var taskManager = require('task.manager');
var task = 'unload';

var unload = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // when on another task, return;
        if ( creep.memory.task && creep.memory.task !== task ) {
            return;
        }
        
        if ( creep.store[RESOURCE_ENERGY] < 1 ) {
            taskManager.finishTask(creep);
            return;
        }
        
        var structTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];
        var targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return ( structTypes.includes( structure.structureType ) ) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
        });
        
        // only unload into towers when no other structures have free capacity
        if ( !targets.length ) {
            structTypes = [STRUCTURE_TOWER];
            targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return ( structTypes.includes( structure.structureType ) ) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }

        if( targets.length ) {
            //console.log("task.unload: targets = " + JSON.stringify(targets));
            taskManager.startTask(creep, task);
            var closestTar = creep.pos.findClosestByPath(targets, { ignoreCreeps : true });
            if ( !closestTar ) {
                console.log("task.unload: no path found from " + creep.name + "(" + creep.pos.x + "/" + creep.pos.y +") to all " + targets.length + " targets");
                for ( var t of targets ) {
                    console.log("\t" + t.id +"(" + t.pos.x + "/" + t.pos.y + ")");
                }
                return;
            }
            var transferResult = creep.transfer(closestTar, RESOURCE_ENERGY);
            if ( transferResult == 0 ) // success
                return;
            if( transferResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestTar, { reusePath: 4, visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                console.log("task.unload: transfer failed due to unhandled reason " + transferResult + " for creep " + creep.name + " target = " + (closestTar ? closestTar.id : "undefined"));
            }
        } else {
            taskManager.finishTask(creep);
        }
	}
};

module.exports = unload;