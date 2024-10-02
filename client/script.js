import { validateField, validateForm, validateStep } from '../public/validation.js';
import { addItem, sortInventory } from './inventory.js';
import { toggleTheme, loadUserThemePreference } from '../public/theme.js';

document.addEventListener("DOMContentLoaded", function() {
    initializeApp();
});

function initializeApp() {
    cacheDOMElements();
    bindEvents();
    initializeComponents();
    loadUserThemePreference();
}

// Cache DOM elements for better performance
let domElements = {};

function cacheDOMElements() {
    domElements.roomItems = document.getElementById('roomItems');
    domElements.itemCount = document.getElementById('itemCount');
    domElements.roomSelect = document.getElementById('roomSelect');
    domElements.submitForm = document.getElementById('submitForm');
    domElements.themeToggle = document.getElementById('theme-toggle');
}

// Bind all event listeners in one place
function bindEvents() {
    domElements.roomSelect.addEventListener('change', handleRoomSelection);
    domElements.roomItems.addEventListener('change', updateItemCount);
    domElements.submitForm.addEventListener('click', handleSubmitForm);
    domElements.themeToggle.addEventListener('click', toggleTheme);
    
    // Event delegation for handling form buttons
    document.body.addEventListener('click', function (event) {
        if (event.target.matches('.next-button')) {
            handleNextStep();
        }
    });
}

// Store theme preference in localStorage
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

// Load user's theme preference on page load
function loadUserThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// Room furniture data
const roomFurniture = {
    mainBedroom: ['Queen Bed', 'Wardrobe', 'Nightstand'],
    firstRoom: ['Queen Bed', 'Wardrobe', 'Nightstand'],
    secondRoom: ['Queen Bed', 'Wardrobe', 'Nightstand'],
    diningRoom: ['Dining Table', 'Chairs', 'Cabinet'],
    livingRoom: ['Sofa', 'Coffee Table', 'TV Stand'],
    kitchen: ['Refrigerator', 'Dining Table', 'Microwave'],
    garage: ['Tools', 'Bicycle', 'Storage Rack']
    // Add more rooms and items as needed
};

// Cache the room furniture data once to avoid reprocessing
let cachedFurnitureData = {};
function getCachedFurniture(room) {
    if (!cachedFurnitureData[room]) {
        cachedFurnitureData[room] = roomFurniture[room] || [];
    }
    return cachedFurnitureData[room];
}

// Handle room selection
function handleRoomSelection() {
    const selectedRooms = Array.from(domElements.roomSelect.selectedOptions).map(option => option.value);
    displayFurnitureForRooms(selectedRooms);
}

// Function to display furniture based on the selected rooms
function displayFurnitureForRooms(rooms) {
    domElements.roomItems.innerHTML = ''; // Clear previous content
    rooms.forEach(room => {
        const furniture = getCachedFurniture(room);
        if (furniture.length) {
            const fragment = document.createDocumentFragment();
            furniture.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <input type="checkbox" id="${item}" name="${room}" value="${item}">
                    <label for="${item}">${item}</label>
                `;
                fragment.appendChild(div);
            });
            domElements.roomItems.appendChild(fragment);
        }
    });
}

// Function to update item count display
function updateItemCount() {
    // Avoid repeatedly calling document.querySelectorAll within the loop
    const roomInputs = domElements.roomItems.querySelectorAll('input:checked');
    const selectedItems = Array.from(roomInputs).map(input => input.value);
    domElements.itemCount.textContent = `Total Items Selected: ${selectedItems.length}`;
}

// Function to handle form submission
function handleSubmitForm(event) {
    event.preventDefault();

    const formData = {
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        moveDate: document.getElementById('moveDate').value,
        selectedItems: []
    };

    // Validate form
    if (validateForm(formData)) {
        console.log('Form is valid');
        submitFormData(formData);
    } else {
        console.log('Form validation failed');
    }

    const selectedRooms = Array.from(domElements.roomSelect.selectedOptions).map(option => option.value);
    formData.selectedRooms = selectedRooms;

    selectedRooms.forEach(room => {
        const roomItems = Array.from(document.querySelectorAll(`input[name="${room}"]:checked`)).map(input => input.value);
        formData.selectedItems.push(...roomItems);
    });

    console.log(formData);
}

// Function to handle the next step in multi-step form
function handleNextStep() {
    if (validateStep(currentStep, steps)) {
        currentStep++;
        showStep(currentStep);
    }
}

// Function to initialize external components (tooltips, datepickers, etc.)
function initializeComponents() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
    
    $('input[type="date"]').datepicker();
    $('input[type="time"]').timepicker();

    $('select').select2({
        placeholder: "Select an item",
        allowClear: true
    });

    // Initialize Google Places Autocomplete for address fields
    initializeGoogleAutocomplete();
}

// Google Autocomplete for addresses
function initializeGoogleAutocomplete() {
    const originField = $('#origin');
    const destinationField = $('#destination');
    new google.maps.places.Autocomplete(originField[0], { types: ['geocode'], componentRestrictions: { country: 'us' } });
    new google.maps.places.Autocomplete(destinationField[0], { types: ['geocode'], componentRestrictions: { country: 'us' } });
}

// Submit the form data (AJAX/fetch)
function submitFormData(formData) {
    fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => console.log('Form submitted successfully', data))
    .catch(error => console.error('Error submitting form:', error));
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Use debounce for search input
document.getElementById('searchInput').addEventListener('input', debounce(function() {
    // Perform search logic here
}, 300));

    