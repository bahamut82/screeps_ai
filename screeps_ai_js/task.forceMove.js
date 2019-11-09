var taskManager = require('task.manager');
var task = 'forceMove';
var maxRetries = 5;

// snippet:
// var forceMove = require("task.forceMove"); forceMove.run(Game.creeps["name"], { x: 0, y: 0 });

var forceMove = {

    /** @param {Creep} creep **/
    run: function(creep, pos) {

        // abort other tasks
        if ( creep.memory.task && creep.memory.task !== task ) {
            taskManager.finishTask(creep);
        }
        
        // emergency abort :-D
        if ( false ) {
            taskManager.finishTask(creep);
            return;
        }
        
        taskManager.startTask(creep, task);
        if ( !creep.memory.taskMemory ) {
            if (pos === { x: -1, y: -1 }) {
                console.log("task.forceMove: invalid destination (-1/-1)!");
                taskManager.finishTask(creep);
                return;
            }
            creep.memory.taskMemory = { retriesRemaining : maxRetries, dest : pos };
        } else {
            pos.x = creep.memory.taskMemory.dest.x;
            pos.y = creep.memory.taskMemory.dest.y;
        }

        if ( creep.pos.x === creep.memory.taskMemory.dest.x &&  creep.pos.y === creep.memory.taskMemory.dest.y) {
            console.log('task.forceMove: ' + creep.name + " reached his destination.");
            taskManager.finishTask(creep);
            return;
        }
        
        if ( creep.memory.taskMemory.retriesRemaining < 1 ) {
            console.log('task.forceMove: WARNING Task aborted for ' + creep.name + ". Couldn't reach his destination after" + maxRetries + " retries.");
            taskManager.finishTask(creep);
            return;
        }
        
        var res = creep.moveTo(pos.x, pos.y, { reusePath: 4, visualizePathStyle: {stroke: '#ffffff'}});
        
        if ( res === 0 ) {
            creep.memory.taskMemory.retriesRemaining = maxRetries;
        } else if ( res != ERR_TIRED ) {
            creep.memory.taskMemory.retriesRemaining--;
            console.log("task.forceMove: moveTo failed with code " + res + " (remaining retries: " + creep.memory.taskMemory.retriesRemaining +  ")")
        }
        
	}
};

module.exports = forceMove;