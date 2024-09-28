const roomInventory = {
    mainBedroom: ['Queen Bed', 'Wardrobe', 'Nightstand'],
    firstBedroom: ['Twin Bed', 'Dresser', 'Desk'],
    secondBedroom: ['Full Bed', 'Bookshelf', 'Chair'],
    diningRoom: ['Dining Table', 'Chairs', 'Sideboard'],
    livingRoom: ['Sofa', 'Coffee Table', 'TV Stand'],
    kitchen: ['Refrigerator', 'Dining Table', 'Microwave'],
    garage: ['Workbench', 'Tool Chest', 'Ladder']
};

// Get furniture items for a room
export function getFurnitureForRoom(room) {
    return roomInventory[room] || [];
}

// Add new furniture to a room
export function addFurnitureToRoom(room, item) {
    if (roomInventory[room]) {
        roomInventory[room].push(item);
    } else {
        roomInventory[room] = [item];
    }
}

// Remove furniture from a room
export function removeFurnitureFromRoom(room, item) {
    if (roomInventory[room]) {
        roomInventory[room] = roomInventory[room].filter(furniture => furniture !== item);
    }
}
