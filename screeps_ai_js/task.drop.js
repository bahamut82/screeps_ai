var taskManager = require('task.manager');
var task = 'drop';

var dropResource = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // when on another task, return;
        if ( creep.memory.task && creep.memory.task !== task ) {
            return;
        }
	    if ( creep.store.getFreeCapacity() === 0 ) {
	        taskManager.startTask(creep, task);
	        creep.drop(RESOURCE_ENERGY);
        } else {
            taskManager.finishTask(creep);
        }
	}
};

module.exports = dropResource;