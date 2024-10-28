// client/inventory.js

const roomInventory = {
    mainBedroom: [],
    secondBedroom: [],
    kitchen: [],
    // Add other rooms as needed
};

// Add item to inventory
export const addItem = async (room, itemName, quantity) => {
    roomInventory[room].push({ itemName, quantity });
};

// Remove item from inventory
export const removeItem = async (room, index) => {
    roomInventory[room].splice(index, 1);
};

// Update item in inventory
export const updateItem = async (room, index, updatedItem) => {
    roomInventory[room][index] = updatedItem;
};

// Get items from inventory
export const getItems = async (room) => {
    return roomInventory[room];
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

// Form submission logic
document.getElementById('movingForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        moveDate: document.getElementById('moveDate').value,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        moveType: document.getElementById('moveType').value,
        // Add logic to capture inventory selection here
    };

    fetch('/submit_form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              document.getElementById('preEstimateResult').innerText = `Estimated Cost: $${data.estimatedCost}`;
          } else {
              console.error('Error:', data.error);
          }
      })
      .catch(error => {
          console.error('Network error:', error);
      });
});

// Inventory Room Selection Logic
document.getElementById('roomSelect').addEventListener('change', function() {
    const selectedRooms = Array.from(this.selectedOptions).map(option => option.value);
    displayFurnitureForRooms(selectedRooms);
});

function displayFurnitureForRooms(rooms) {
    const roomItemsContainer = document.getElementById('roomItems');
    roomItemsContainer.innerHTML = '';


    const roomFurniture = {
        mainBedroom: ['Queen Bed', 'Wardrobe', 'Nightstand'],
        firstRoom: ['Twin Bed', 'Desk', 'Dresser'],
        kitchen: ['Toaster', 'Microwave', 'Dining Table'],
        // Add more rooms as needed
    };

    // Cache the room furniture data once to avoid reprocessing
    

    rooms.forEach(room => {
        const furniture = roomFurniture[room];
        if (furniture) {
            furniture.forEach(item => {
                roomItemsContainer.innerHTML += `
                    <div>
                        <input type="checkbox" id="${item}" name="${room}" value="${item}">
                        <label for="${item}">${item}</label>
                    </div>
                `;
            });
        }
    });
}

// Socket.IO client integration
import { io } from 'socket.io-client';
const socket = io();

socket.on('inventoryUpdated', (inventory) => {
    updateInventoryUI(inventory); // A function that updates the DOM with new inventory data
});

document.getElementById('addItemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = Object.fromEntries(formData.entries()); // Convert FormData to a plain object
    socket.emit('addInventoryItem', itemData);
});

// Function to update the UI with new inventory data
function updateInventoryUI(inventory) {
    // Implement the logic to update the DOM with the new inventory data
    console.log('Inventory updated:', inventory);
}

router.post('/add', async (req, res) => {
    try {
      const newItem = new InventoryItem(req.body);
      await newItem.save();
      res.status(200).json(newItem);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add inventory item' });
    }
  });
  
  router.put('/edit/:id', async (req, res) => {
    try {
      const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update inventory item' });
    }
  });
  
  router.delete('/delete/:id', async (req, res) => {
    try {
      await InventoryItem.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });