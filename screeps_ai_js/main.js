var init = require('init');
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var spawnCreepGeneric = require('spawn.creep');
var towerAi = require('tower.ai');

module.exports.loop = function () {
    init.run(false);
    var roles = Memory.roles;
    
    towerAi.run();

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    // reset creep role counter
    for(var r of roles) {
        if (r)
            Memory.creepCount[r] = 0;
    }
    

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var r = creep.memory.role

        switch (r) {
            case 'harvester': roleHarvester.run(creep); break;
            case 'builder': roleBuilder.run(creep); break;
            case 'upgrader': roleUpgrader.run(creep); break;
        }
        
        if( creep.ticksToLive > 5 ) {
            if (r)
                Memory.creepCount[r]++;
            else
                console.log("WTF... role undefined for " + creep.name);
        }
    }
    
    // spawn as many creeps of each role as defined in Memory.desiredCreepCount
    for(var r of roles) {
        if ( Memory.creepCount[r] < Memory.desiredCreepCount[r] ) {
            spawnCreepGeneric.run(r);
            break; // prevent from trying to build several at once
        }
    }

}