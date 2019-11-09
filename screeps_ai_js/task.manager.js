var taskManager = {
    startTask : function(creep, task) {
        if (creep.memory.task === task)
            return;
        if (task)
            creep.say('+' + task);
        creep.memory.task = task;
    },
    
    finishTask : function(creep) {
        if (creep.memory.task)
            creep.say('-' + creep.memory.task);
        creep.memory.task = undefined;
        delete creep.memory.taskMemory;
    },
    
    executeTaskSequence : function(creep, taskList) {
        // two passes to finish old task and begin new task in the same tick
        var passes = 0;
        do {
            for (var task of taskList) {
                task.run(creep);
            }
            passes++;
        } while ( !creep.memory.task && passes < 2 );
        if (!creep.memory.task) {
            console.log("Couldn't find any task for creep " + creep.name);
        }
    }
    
}

module.exports = taskManager;