// Room-specific inventory data
let roomInventory = {
    mainBedroom: [{ itemName: 'Queen Bed', quantity: 1 }, { itemName: 'Wardrobe', quantity: 1 }],
    firstBedroom: [{ itemName: 'Twin Bed', quantity: 2 }, { itemName: 'Desk', quantity: 1 }],
    secondBedroom: [{ itemName: 'Full Bed', quantity: 1 }, { itemName: 'Bookshelf', quantity: 1 }],
    diningRoom: [{ itemName: 'Dining Table', quantity: 1 }, { itemName: 'Chairs', quantity: 2 }],
    livingRoom: [{ itemName: 'Sofa', quantity: 1 }, { itemName: 'Coffee Table', quantity: 1 }],
    kitchen: [{ itemName: 'Microwave', quantity: 1 }, { itemName: 'Refrigerator', quantity: 1 }],
    garage: [{ itemName: 'Tools', quantity: 1 }, { itemName: 'Bicycle', quantity: 1 }]
  };
  
  // CRUD Operations
  export const addItem = async (room, itemName, quantity) => {
    if (!roomInventory[room]) roomInventory[room] = [];
    roomInventory[room].push({ itemName, quantity });
  };
  
  export const removeItem = async (room, index) => {
    roomInventory[room].splice(index, 1);
  };
  
  export const updateItem = async (room, index, updatedItem) => {
    roomInventory[room][index] = updatedItem;
  };
  
  // Retrieve items from inventory
  export const getItems = async (room) => {
    return roomInventory[room] || [];
  };
  
  // Sort inventory items
  export const sortInventory = async (room, sortBy) => {
    roomInventory[room].sort((a, b) => {
      if (sortBy === 'name') {
        return a.itemName.localeCompare(b.itemName);
      } else if (sortBy === 'quantity') {
        return a.quantity - b.quantity;
      }
      return 0;
    });
  };