/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower.ai');
 * mod.thing == 'a thing'; // true
 */

var towerAi = {
    run : function(){
        for (var roomName in Game.rooms) {
            var curRoom = Game.rooms[roomName];
            var towers = curRoom.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER }});
            for (var tower of towers) {
                if(tower) {
                    // repair only when at least x% energy in tower
                    // always keeps some energy for defending against attackers
                    if ( tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY) * 0.3 ) {
                        // 
                        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (str) => (str.structureType !== STRUCTURE_WALL &&  str.hits < str.hitsMax) || (str.hits < str.hitsMax && str.hits < 5000000)
                        });
                        if(closestDamagedStructure) {
                            tower.repair(closestDamagedStructure);
                        }
                    }
            
                    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if(closestHostile) {
                        tower.attack(closestHostile);
                    }
                }
            }
        }
    }
}

module.exports = towerAi;