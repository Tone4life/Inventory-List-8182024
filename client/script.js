import { validateForm, validateStep } from '../client/validation.js';
import { toggleTheme, loadUserThemePreference } from '../public/theme.js';

document.addEventListener("DOMContentLoaded", function() {
    initializeApp();
});

let domElements = {}; // Cache DOM elements for better performance
let currentStep = 0; // Track the current form step

function initializeApp() {
    cacheDOMElements();
    bindEvents();
    initializeComponents();
    loadUserThemePreference();
    showStep(currentStep); // Show the first step on load
}

function cacheDOMElements() {
    domElements.roomItems = document.getElementById('roomItems');
    domElements.itemCount = document.getElementById('itemCount');
    domElements.roomSelect = document.getElementById('roomSelect');
    domElements.submitForm = document.getElementById('submitForm');
    domElements.themeToggle = document.getElementById('theme-toggle');
    domElements.movingForm = document.getElementById('movingForm');
    domElements.customItemName = document.getElementById('customItemName');
    domElements.customItemWeight = document.getElementById('customItemWeight');
    domElements.addCustomItem = document.getElementById('addCustomItem');
    domElements.customItemsContainer = document.getElementById('customItemsContainer');
    domElements.roomInventoryContent = document.getElementById('roomInventoryContent'); // Room inventory modal content
    domElements.roomInventoryModal = new bootstrap.Modal(document.getElementById('roomInventoryModal'), {}); // Bootstrap modal instance
    domElements.steps = document.querySelectorAll('.form-step'); // All form steps
    domElements.nextButton = document.getElementById('nextButton');
    domElements.prevButton = document.getElementById('prevButton');
}

const roomFurniture = {
    mainBedroom: ['Queen Bed', 'Wardrobe', 'Nightstand'],
    firstBedroom: ['Twin Bed', 'Dresser', 'Desk'],
    secondBedroom: ['Full Bed', 'Bookshelf', 'Chair'],
    diningRoom: ['Dining Table', 'Chairs', 'Sideboard'],
    livingRoom: ['Sofa', 'Coffee Table', 'TV Stand'],
    kitchen: ['Refrigerator', 'Dining Table', 'Microwave'],
    garage: ['Workbench', 'Tool Chest', 'Ladder']
};

let selectedInventory = {}; // Store selected items for each room

function bindEvents() {
    domElements.roomSelect.addEventListener('change', handleRoomSelection);
    domElements.addCustomItem.addEventListener('click', addCustomItem);
    domElements.submitForm.addEventListener('click', handleSubmitForm);
    domElements.themeToggle.addEventListener('click', toggleTheme);
    domElements.nextButton.addEventListener('click', handleNextStep);
    domElements.prevButton.addEventListener('click', handlePreviousStep);
}

// Trigger room inventory modal with specific items
function handleRoomSelection() {
    const selectedRooms = Array.from(domElements.roomSelect.selectedOptions).map(option => option.value);
    if (selectedRooms.length > 0) {
        showRoomInventory(selectedRooms[selectedRooms.length - 1]); // Show inventory for the last selected room
    }
}

// Show the specified step and hide others
function showStep(stepIndex) {
    domElements.steps.forEach((step, index) => {
        step.style.display = index === stepIndex ? 'block' : 'none';
    });
    domElements.prevButton.style.display = stepIndex === 0 ? 'none' : 'inline-block';
    domElements.nextButton.style.display = stepIndex === domElements.steps.length - 1 ? 'none' : 'inline-block';
    domElements.submitForm.style.display = stepIndex === domElements.steps.length - 1 ? 'inline-block' : 'none';
}

// Handle next step with validation using validateStep
function handleNextStep() {
    if (validateStep(currentStep, domElements)) { // Validate the current step
        currentStep++;
        showStep(currentStep);
    } else {
        alert("Please complete the required fields for this step.");
    }
}

// Handle previous step
function handlePreviousStep() {
    currentStep = Math.max(0, currentStep - 1);
    showStep(currentStep);
}

// Handle room selection and show room inventory modal
function handleRoomSelection() {
    const selectedRooms = Array.from(domElements.roomSelect.selectedOptions).map(option => option.value);
    if (selectedRooms.length > 0) {
        showRoomInventory(selectedRooms);
    }
}

// Display items for a specific room in the modal
function showRoomInventory(room) {
    const items = roomFurniture[room] || [];
    domElements.roomInventoryContent.innerHTML = items.map(item => `
        <div>
            <input type="checkbox" id="${room}-${item}" name="${room}" value="${item}">
            <label for="${room}-${item}">${item}</label>
        </div>
    `).join('');

    // Show the modal
    domElements.roomInventoryModal.show();

    // Save selections when modal closes
    domElements.roomInventoryModal._element.addEventListener('hidden.bs.modal', () => {
        const selectedItems = Array.from(domElements.roomInventoryContent.querySelectorAll(`input[name="${room}"]:checked`))
                                   .map(input => input.value);
        selectedInventory[room] = selectedItems;
        displaySelectedItems(); // Show selections in Inventory Details
    }, { once: true });
}

// Display selected items in Inventory Details
function displaySelectedItems() {
    domElements.roomItems.innerHTML = ''; // Clear previous items

    for (const [room, items] of Object.entries(selectedInventory)) {
        if (items.length > 0) {
            domElements.roomItems.innerHTML += `
                <h5>${room.replace(/([A-Z])/g, ' $1')}</h5>
                <ul>
                    ${items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
    }
}

// Add custom item to form data
function addCustomItem() {
    const itemName = domElements.customItemName.value.trim();
    const itemWeight = parseFloat(domElements.customItemWeight.value);
    if (itemName && !isNaN(itemWeight) && itemWeight > 0) {
        const customItemDiv = document.createElement('div');
        customItemDiv.classList.add('custom-item');
        customItemDiv.innerHTML = `
            <span>${itemName} - ${itemWeight} lbs</span>
            <input type="hidden" name="customItems[]" value="${itemName}:${itemWeight}">
        `;
        domElements.customItemsContainer.appendChild(customItemDiv);
        domElements.customItemName.value = '';
        domElements.customItemWeight.value = '';
    } else {
        alert('Please enter a valid item name and weight.');
    }
}

// Validate and handle form submission
function handleSubmitForm(event) {
    event.preventDefault();

    const formData = {
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        moveDate: document.getElementById('moveDate').value,
        selectedItems: [],
        customItems: []
    };

    const selectedRooms = Array.from(domElements.roomSelect.selectedOptions).map(option => option.value);
    formData.selectedRooms = selectedRooms;

    selectedRooms.forEach(room => {
        const roomItems = selectedInventory[room] || [];
        formData.selectedItems.push(...roomItems);
    });

    const customItems = Array.from(document.querySelectorAll('input[name="customItems[]"]')).map(input => {
        const [itemName, itemWeight] = input.value.split(':');
        return { itemName, itemWeight: parseFloat(itemWeight) };
    });
    formData.customItems = customItems;

    // Validate the entire form before submission
    if (validateForm(formData)) {
        submitFormData(formData);
    } else {
        alert("Please complete all required fields correctly.");
    }
}

// Submit form data via fetch
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

// Initialize external components (tooltips, datepickers, etc.)
function initializeComponents() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
    $('input[type="date"]').datepicker();
    $('input[type="time"]').timepicker();
    $('select').select2({ placeholder: "Select an item", allowClear: true });
    initializeGoogleAutocomplete();
}

// Google Autocomplete for addresses
function initializeGoogleAutocomplete() {
    const originField = $('#origin');
    const destinationField = $('#destination');
    new google.maps.places.Autocomplete(originField[0], { types: ['geocode'], componentRestrictions: { country: 'us' } });
    new google.maps.places.Autocomplete(destinationField[0], { types: ['geocode'], componentRestrictions: { country: 'us' } });
}

// Debounced function for search input
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

document.getElementById('searchInput').addEventListener('input', debounce(function() {
    // Perform search logic here
}, 300));

    