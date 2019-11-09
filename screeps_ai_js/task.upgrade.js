var taskManager = require('task.manager');
var task = 'upgrade';

var upgrade = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // when on another task, return;
        if ( creep.memory.task && creep.memory.task !== task ) {
            return;
        }
        
        if ( creep.store[RESOURCE_ENERGY] === 0 ) {
            taskManager.finishTask(creep);
            return;
        }
        
        taskManager.startTask(creep, task);
        
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            var r = creep.room;
            if ( !r.memory.rcAccessPoints || !r.memory.rcAccessPoints.length ) {
                console.log('task.upgrade: moving to controller - INEFFICIENT!');
                creep.moveTo(creep.room.controller, { reusePath: 4, visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                // NOTE: need to create new RoomPosition instances of stored rcAccessPoints. Apparently RoomPosition objects are invalidated with each tick.
                // TODO: potentially replace logic by flags
                var tmpRoomPositions = r.memory.rcAccessPoints.map((ap) => { return new RoomPosition(ap.x, ap.y, ap.roomName) });
                var closestPos = creep.pos.findClosestByPath(tmpRoomPositions, { ignoreCreeps : true });
                if ( !closestPos ) {
                    console.log("task.upgrade: couldn't find closest access point to room controller... " + r.memory.rcAccessPoints.length);
                    var ap0 = r.memory.rcAccessPoints[0];
                    console.log("ap0 instanceof RoomPosition " + (ap0 instanceof RoomPosition) + " (" + ap0.x + "/" + ap0.y + ")");
                    var moveToResult = creep.moveTo(r.memory.rcAccessPoints[0], { reusePath: 4, visualizePathStyle: {stroke: '#ffffff'}})
                    console.log("task.upgrade: moveToResult = " + moveToResult);
                }
                creep.moveTo(closestPos, { reusePath: 4, visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = upgrade;