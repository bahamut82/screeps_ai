// snippet
// var rcManager = require('roomController.manager'); rcManager.initAccessPoints(Game.rooms['E36N43']);

var rcManager = {
    
    initAccessPoints : function(room) {
        var center = room.controller.pos;
        
        var top = center.y - 3;
        var left = center.x - 3;
        var bottom = center.y + 3;
        var right = center.x + 3;
        room.visual.rect(left, top, right - left, bottom - top);
        
        var areaTerrain = room.lookForAtArea(LOOK_TERRAIN, top, left, bottom, right, true);
        /*
        for (var cell of areaTerrain) {
            console.log(cell.terrain);
        }
        */
        var accessibleTerrain = _.filter(areaTerrain, (cell) => { return cell.terrain !== 'wall'; });
        var accessibleRoomPositions = [];
        for (var cell of accessibleTerrain) {
            accessibleRoomPositions.push(new RoomPosition(cell.x, cell.y, room.name));
        }
        console.log("accessible cells around room controller: " + accessibleTerrain.length);
        
        room.memory.rcAccessPoints = [];
        
        var sources = room.find(FIND_SOURCES);
        for (var src of sources) {
            var closestCell = src.pos.findClosestByPath(accessibleRoomPositions, { ignoreCreeps : true })
            if ( closestCell ) {
                // TODO: avoid duplicates (multiple sources having closest path to same cell - don't add x/y when rcAccessPoints already contains it)
                room.memory.rcAccessPoints.push( new RoomPosition(closestCell.x, closestCell.y, room.name) );
            }
        }

    }
    
}


module.exports = rcManager;