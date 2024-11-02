import { io } from 'socket.io-client';

const socket = io('https://localhost:3000');  // Initialize the Socket.IO client with the server URL

// Listen for the "inventoryUpdated" event from the server
socket.on('inventoryUpdated', (updatedInventory) => {
    try {
        console.log('Inventory updated:', updatedInventory);
        document.dispatchEvent(new CustomEvent('inventoryUpdated', { detail: updatedInventory }));
    } catch (error) {
        console.error('Error processing inventory update:', error);
    }
});

export default socket;