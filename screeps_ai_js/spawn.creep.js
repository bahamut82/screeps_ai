var partSequence = [MOVE, CARRY, WORK, WORK, MOVE, MOVE, CARRY, WORK, WORK, WORK, MOVE, WORK, WORK, CARRY, WORK, WORK, WORK, CARRY];
var maxCreepCost = partSequence.map( x => BODYPART_COST[x]).reduce( (total, val) => total + val, 0);

var remainingEnergy;
var tryPush = function(arr, part) {
    var partCost = BODYPART_COST[part]
    if (remainingEnergy >= BODYPART_COST[part]) {
        arr.push(part);
        remainingEnergy -= partCost;
        return true;
    }
    return false;
};

var spawnCreep = {
    run: function(role) {
        if (!role) {
            console.log("spawn.creep: spawnCreep called with undefined role!");
            return;
        }
        
        
        var targets = _.filter(Game.spawns, (s) => { return !s.spawning; });
        
        if ( !targets.length )
            return;
        
        var s = targets[0]
        var totalCapacity = s.room.energyCapacityAvailable;
        //console.log("spawn.creep: totalCapacity = " + totalCapacity + ", maxCreepCost = " + maxCreepCost);
        if ( (Memory.creepCount['harvester'] >= 2 && s.room.energyAvailable < Math.min(totalCapacity, maxCreepCost))
            || (Memory.creepCount['harvester'] < 2 && s.room.energyAvailable < 300) ) {

            if ( s.room.energyAvailable % 50 == 0 ) {
                console.log("spawn.creep: Waiting for more energy for spawning " + role + " creep... " + s.room.energyAvailable + "/" + totalCapacity);
            }
            return;
        }
            
        var spawnRes;

        remainingEnergy = s.room.energyAvailable;
        var bodyParts = [];
        for ( var i=0; i < partSequence.length;i++ ) {
            if ( !tryPush(bodyParts, partSequence[i]) )
                break;
        }
        
        spawnRes = s.spawnCreep(bodyParts, role + Math.floor(Math.random()*30), { memory: {role: role}} );

        if ( spawnRes === 0 )
            console.log("spawn.creep: beginning to spawn new creep of role " + role + " with parts: " + bodyParts);
        else {
            console.log("spawn.creep: trying to spawn new creep of role " + role + " with parts: " + bodyParts);
            console.log("spawn.creep: failed to spawn new creep of role " + role + " Reason: " + spawnRes);
        }
    }
   
}

module.exports = spawnCreep;