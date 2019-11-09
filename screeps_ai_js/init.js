/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('init');
 * mod.thing == 'a thing'; // true
 */

// force init:
// var init = require('init'); init.run(true);

// set desired role count
// Memory.desiredCreepCount['builder'] = 2

var init = {
    run : function(forceInit){
        if (!forceInit && Memory.isInitialized) {
            return;
        }
            
        console.log("initializing");
        Memory.roles = ["harvester", "upgrader", "builder"];
        Memory.creepCount = new Object();
        Memory.desiredCreepCount = new Object();
        console.log("initializing desired creep count for all roles...");
        for (var role of Memory.roles) {
            Memory.desiredCreepCount[role] = 1;
        }

        Memory.isInitialized = true;
    }
}

module.exports = init;