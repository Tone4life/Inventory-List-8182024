const socket= io();  // Initialize the Socket.IO client

// Listen for the "inventoryUpdated" event from the server
socket.on('inventoryUpdated', (inventory) => {
    console.log('Updated inventory received:', inventory);
    // You can update your UI here
});