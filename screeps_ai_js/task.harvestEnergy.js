var taskManager = require('task.manager');
var task = 'harvest';

var harvestEnergy = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // when on another task, return;
        if ( creep.memory.task && creep.memory.task !== task ) {
            return;
        }
	    if ( creep.store.getFreeCapacity() > 0 ) {
	        taskManager.startTask(creep, task);
	        var closestSource = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if ( creep.harvest(closestSource) == ERR_NOT_IN_RANGE ) {
                var moveRes = creep.moveTo(closestSource, { reusePath : 4, visualizePathStyle: {stroke: '#ffaa00'}});
                if ( moveRes === ERR_NO_PATH )
                    console.log("task.harvestEnergy: no path " + creep.name);
                else if ( moveRes !== 0 && moveRes !== ERR_TIRED ) {
                    console.log("task.harvestEnergy: moveTo failed with error " + moveRes + " for creep " + creep.name);
                }
            }
        } else {
            taskManager.finishTask(creep);
        }
	}
};

module.exports = harvestEnergy;