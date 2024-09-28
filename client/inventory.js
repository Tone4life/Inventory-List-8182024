const roomInventory = {
    mainBedroom: [],
    secondBedroom: [],
    kitchen: [],
    // Add other rooms as needed
};

// Add item to inventory
export function addItem(room, itemName, quantity) {
    roomInventory[room].push({ itemName, quantity });
}

// Remove item from inventory
export function removeItem(room, index) {
    roomInventory[room].splice(index, 1);
}

// Update item in inventory
export function updateItem(room, index, updatedItem) {
    roomInventory[room][index] = updatedItem;
}

// Get items from inventory
export function getItems(room) {
    return roomInventory[room];
}

// Sort inventory items
export function sortInventory(sortBy) {
    // Implementation here
}

// Save item to inventory
export function saveItem(room, itemName, quantity) {
    // Implementation here
}
  