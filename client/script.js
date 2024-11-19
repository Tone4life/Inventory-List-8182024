import { validateForm, validateStep } from '../client/validation.js';
import { toggleTheme, loadUserThemePreference } from '../public/theme.js';
import { getItems } from './inventory.js';
import { io } from 'socket.io-client';

const socket = io();  // Initialize Socket.IO

socket.on('connect', () => {
    console.log('Connected to server');  // Check that the connection succeeds
});

// Listen for inventory updates
socket.on('inventoryUpdated', (updatedInventory) => {
    console.log('Received inventory update:', updatedInventory);  // Confirm receiving updates
    updateInventoryUI(updatedInventory);  // Trigger UI updates with the new data
});

document.addEventListener("DOMContentLoaded", function() {
    initializeApp();
});

let domElements = {};
let selectedInventory = {};
let currentStep = 0; // Add currentStep for multi-step form

function initializeApp() {
    cacheDOMElements();
    bindEvents();
    loadUserThemePreference();
    setupRealTimeInventoryUpdates(); // Initialize real-time inventory updates
    setupInventoryUpdateListener(); // Add inventory update listener
}

function validateStep(step, data) {
    // Placeholder validation logic
    return data ? true : false; // Replace with actual validation criteria
}


function cacheDOMElements() {
    domElements.roomItems = document.getElementById('roomItems');
    domElements.roomSelect = document.getElementById('roomSelect');
    domElements.roomInventoryContent = document.getElementById('roomInventoryContent');
    domElements.roomInventoryModalTitle = document.getElementById('roomInventoryModalTitle');
    domElements.roomInventoryModalCloseButton = document.getElementById('roomInventoryModalCloseButton');
    domElements.roomInventoryModalBody = document.getElementById('roomInventoryModalBody');
    domElements.roomInventoryModalOpenButton = document.getElementById('roomInventoryModalOpenButton');
    domElements.submitForm = document.getElementById('submitForm');
    domElements.itemCount = document.getElementById('itemCount');
    domElements.roomInventoryModal = new bootstrap.Modal(document.getElementById('roomInventoryModal')); // Initialize modal
    domElements.themeToggleButton = document.getElementById('themeToggleButton'); // Add theme toggle button
    domElements.nextButton = document.getElementById('nextButton'); // Add next button for multi-step form
    domElements.prevButton = document.getElementById('prevButton'); // Add previous button for multi-step form
    domElements.movingForm = document.getElementById('movingForm'); // Add form element
}

function bindEvents() {
    domElements.roomSelect.addEventListener('change', handleRoomSelection);
    domElements.roomInventoryModal._element.addEventListener('hidden.bs.modal', () => {
        const selectedRoom = domElements.roomSelect.value;
        const selectedItems = Array.from(domElements.roomInventoryContent.querySelectorAll(`input[name="${selectedRoom}"]:checked`))
                                   .map(input => input.value);
        selectedInventory[selectedRoom] = selectedItems;
        displaySelectedItems();
    });
    domElements.themeToggleButton.addEventListener('click', toggleTheme); // Bind theme toggle button
    domElements.nextButton.addEventListener('click', handleNextStep); // Bind next button
    domElements.prevButton.addEventListener('click', handlePreviousStep); // Bind previous button
    domElements.movingForm.addEventListener('submit', handleSubmitForm); // Bind form submission
}

function setupInventoryUpdateListener() {
    document.addEventListener('inventoryUpdated', (event) => {
        const updatedInventory = event.detail;
        console.log('Updated inventory received:', updatedInventory);
        // Update the UI with the new inventory data
        updateInventoryUI(updatedInventory);
    });
}

function updateInventoryUI(updatedInventory) {
    const roomItems = document.getElementById('roomItems');
    roomItems.innerHTML = '';  // Clear existing items
    
    updatedInventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item.name} - Quantity: ${item.quantity}`;
        roomItems.appendChild(itemElement);  // Add updated items to the DOM
    });
}

function setupRealTimeInventoryUpdates() {
    document.addEventListener('inventoryUpdated', async (event) => {
        const updatedInventory = event.detail;
        console.log('Received updated inventory:', updatedInventory);
        if (updatedInventory) {
            // Check if modal is open and refresh inventory display if necessary
            const currentRoom = domElements.roomSelect.value;
            if (currentRoom) {
                await displayRoomInventory(currentRoom);
            }
        }
    });
}

function handleRoomSelection() {
    const selectedRooms = Array.from(domElements.roomSelect.selectedOptions).map(option => option.value);
    if (selectedRooms.length > 0) {
        const room = selectedRooms[selectedRooms.length - 1];
        displayRoomInventory(room);
    }
}

async function displayRoomInventory(room) {
    const items = await getItems(room);
    domElements.roomInventoryContent.innerHTML = items.map(item => `
        <div>
            <input type="checkbox" id="${room}-${item.itemName}" name="${room}" value="${item.itemName}">
            <label for="${room}-${item.itemName}">${item.itemName} (${item.quantity})</label>
        </div>
    `).join('');
    domElements.roomInventoryModal.show(); // Show the modal
}

function displaySelectedItems() {
    domElements.roomItems.innerHTML = '';
    for (const [room, items] of Object.entries(selectedInventory)) {
        if (items.length > 0) {
            domElements.roomItems.innerHTML += `
                <h5>${room.replace(/([A-Z])/g, ' $1')}</h5>
                <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
            `;
        }
    }
}

function handleNextStep() {
    const currentStepData = collectCurrentStepData(currentStep); // Collect data for the current step
    if (validateStep(currentStep, currentStepData)) { // Validate the current step with the collected data
        currentStep++;
        showStep(currentStep);
    } else {
        alert("Please complete all required fields correctly before proceeding.");
    }
}

function collectCurrentStepData(step) {
    // Logic to collect data for the current step
    // This is a placeholder function and should be implemented based on your form structure
    const stepData = {};
    // Example: Collect data from inputs in the current step
    const stepElements = document.querySelectorAll(`.step[data-step="${step}"] input`);
    stepElements.forEach(input => {
        stepData[input.name] = input.value;
    });
    return stepData;
}

function handlePreviousStep() {
    currentStep--;
    showStep(currentStep);
}

function showStep(step) {
    // Logic to show the current step
}

function handleSubmitForm(event) {
    event.preventDefault();
    const formData = collectFormData();
    if (validateForm(formData)) {
        submitFormData(formData);
    } else {
        alert("Please complete all required fields correctly.");
    }
}

function collectFormData() {
    const formData = {
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        moveDate: document.getElementById('moveDate').value,
        selectedItems: Object.values(selectedInventory).flat()
    };
    return formData;
}

function submitFormData(formData) {
    fetch('/submit_form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => console.log('Form submitted successfully', data))
    .catch(error => console.error('Error submitting form:', error));
}
    