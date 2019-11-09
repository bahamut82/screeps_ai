var taskManager = require('task.manager');
var taskHarvestEnergy = require('task.harvestEnergy');
var taskUnload = require('task.unload');
var taskBuild = require('task.build');
var taskRepair = require('task.repair');
var taskUpgrade = require('task.upgrade');
var taskForceMove = require('task.forceMove');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.task === 'forceMove') {
            taskForceMove.run(creep, { x: -1, y: -1 });
            return;
        }
        
        taskManager.executeTaskSequence(creep, [taskHarvestEnergy, taskBuild, taskUnload, taskRepair, taskUpgrade]);
        
        /*
        taskHarvestEnergy.run(creep);
        taskBuild.run(creep);
        taskUnload.run(creep);
        taskUpgrade.run(creep);
        */
	}
};

module.exports = roleBuilder;