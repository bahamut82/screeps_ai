var taskManager = require('task.manager');
var taskHarvestEnergy = require('task.harvestEnergy');
var taskUnload = require('task.unload');
var taskBuild = require('task.build');
var taskUpgrade = require('task.upgrade');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.task === 'forceMove') {
            taskForceMove.run(creep, { x: -1, y: -1 });
            return;
        }
        
        taskManager.executeTaskSequence(creep, [taskHarvestEnergy, taskUnload, taskBuild, taskUpgrade]);
        
        /*
        taskHarvestEnergy.run(creep);
        taskUnload.run(creep);
        taskBuild.run(creep);
        taskUpgrade.run(creep);
        */
	}
};

module.exports = roleHarvester;