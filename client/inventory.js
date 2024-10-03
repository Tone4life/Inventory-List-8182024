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
export function sortInventory(room, sortBy) {
    roomInventory[room].sort((a, b) => {
        if (sortBy === 'name') {
            return a.itemName.localeCompare(b.itemName);
        } else if (sortBy === 'quantity') {
            return a.quantity - b.quantity;
        }
        return 0;
    });
}

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
        firstBedroom: ['Twin Bed', 'Dresser', 'Desk'],
        // Add other rooms and items here...
    };

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
  