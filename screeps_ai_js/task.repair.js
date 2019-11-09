var taskManager = require('task.manager');
var task = 'repair';

var doRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // when on another task, return;
        if ( creep.memory.task && creep.memory.task !== task ) {
            return;
        }
        
        
        var closestDamagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, { ignoreCreeps: true,
            filter: (structure) => (structure.structureType !== STRUCTURE_WALL) && (structure.hits < structure.hitsMax)
        });
        
        if ( !closestDamagedStructure || creep.store[RESOURCE_ENERGY] < 1 ) {
            taskManager.finishTask(creep);
            return;
        }
        
        taskManager.startTask(creep, task);
        var repairResult = creep.repair(closestDamagedStructure);
        if ( repairResult === 0 )
            return;
            
        if ( repairResult === ERR_NOT_IN_RANGE ) {
            var moveToResult = creep.moveTo(closestDamagedStructure, { reusePath: 4, visualizePathStyle: {stroke: '#ffffff'}});
            if (moveToResult !== 0) {
                if ( moveToResult === ERR_NO_PATH ) {
                    console.log("task.repair: No path for repairing " + closestDamagedStructure.id + " by creep " + creep.name);
                } else {
                    console.log("task.repair: unhandled moveToResult for repairing " + closestDamagedStructure.id + " by creep " + creep.name);
                }
            }
        } else {
            console.log("task.repair: unhandled repairResult: " + repairResult);
        }
        
	}
};

module.exports = doRepair;