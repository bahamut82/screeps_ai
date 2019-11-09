var taskManager = require('task.manager');
var task = 'build';

var doBuild = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // when on another task, return;
        if ( creep.memory.task && creep.memory.task !== task ) {
            return;
        }
        
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	    if( targets.length && creep.store[RESOURCE_ENERGY] > 0) {
	        taskManager.startTask(creep, task);
	        var tar = creep.pos.findClosestByPath(targets);
	        if ( !tar ) {
	            console.log("task.build: No path from creep " + creep.name +  "to any of the " + targets.length + " construction sites.");
	            return;
	        }
            if(creep.build(tar) == ERR_NOT_IN_RANGE) {
                creep.moveTo(tar, {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    } else {
	        taskManager.finishTask(creep);
	    }
	}
};

module.exports = doBuild;