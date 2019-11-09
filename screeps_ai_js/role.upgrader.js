var taskManager = require('task.manager');
var taskHarvestEnergy = require('task.harvestEnergy');
var taskUnload = require('task.unload');
var taskBuild = require('task.build');
var taskUpgrade = require('task.upgrade');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.task === 'forceMove') {
            taskForceMove.run(creep, { x: -1, y: -1 });
            return;
        }
        
        taskManager.executeTaskSequence(creep, [taskHarvestEnergy, taskUpgrade, taskBuild, taskUnload]);

        /*
        taskHarvestEnergy.run(creep);
        taskUpgrade.run(creep);
        taskBuild.run(creep);
        taskUnload.run(creep);
        */
	}
};

module.exports = roleUpgrader;