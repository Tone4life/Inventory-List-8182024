import { validateField, validateForm, validateStep } from './validation.js';
import { addItem, sortInventory } from './inventory.js';
import { toggleTheme, loadUserThemePreference } from './theme.js';


// Define the available furniture for each room
const roomFurniture = {
    mainBedroom: ['Queen Bed', 'Wardrobe', 'Nightstand'],
    firstRoom: ['Queen Bed', 'Wardrobe', 'Nightstand'],
    secondroom: ['Queen Bed', 'Wardrobe', 'Nightstand'],
    diningroom: ['Dining Table', 'Chairs', 'Cabinet'],
    livingRoom: ['Sofa', 'Coffee Table', 'TV Stand'],
    kitchen: ['Refrigerator', 'Dining Table', 'Microwave'],
    garage: ['Tools', 'Bicycle', 'Storage Rack']
    // Add more rooms and items as needed
};

  // Event listener for room items selection
  document.getElementById('roomItems').addEventListener('change', function() {
    const selectedItems = Array.from(document.querySelectorAll('#roomItems input:checked')).map(input => input.value);
    updateItemCount(selectedItems.length);  // Update selected item count
  });


// Function to update item count display
function updateItemCount(count) {
    document.getElementById('itemCount').textContent = `Total Items Selected: ${count}`;
}

// Function to display furniture based on the selected rooms
function displayFurnitureForRooms(rooms) {
    const roomItemsContainer = document.getElementById('roomItems');
    roomItemsContainer.innerHTML = '';  // Clear previous content

    // Iterate through selected rooms
    rooms.forEach(room => {
        console.log('Selected room:', room);  // Debugging statement

        // Ensure the room exists in roomFurniture
        const furniture = roomFurniture[room];  // Get furniture for the selected room
        console.log('Furniture for this room:', furniture);  // Debugging statement

        if (furniture) {
            const fragment = document.createDocumentFragment();  // Use document fragment for performance
            furniture.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <input type="checkbox" id="${item}" name="${room}" value="${item}">
                    <label for="${item}">${item}</label>
                `;
                fragment.appendChild(div);
            });
            roomItemsContainer.appendChild(fragment);
        }
    });
}

// Initialize tooltips and popovers
document.addEventListener("DOMContentLoaded", function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
    document.getElementById('roomSelect').addEventListener('change', function() {
        const selectedRooms = Array.from(this.selectedOptions).map(option => option.value);
        displayFurnitureForRooms(selectedRooms);  // Show furniture based on selected rooms
    });

    document.getElementById('roomItems').addEventListener('change', function() {
        const selectedItems = Array.from(document.querySelectorAll('#roomItems input:checked')).map(input => input.value);
        updateItemCount(selectedItems.length);  // Update selected item count
    });
})

// Initialize datepickers and timepickers
$(document).ready(function() {  // Use jQuery's document ready function
    $('input[type="date"]').datepicker();
    $('input[type="time"]').timepicker();
});

// Initialize Autocomplete for product search
$(document).ready(function() {
    const searchInput = $('#productSearch');
    const searchSuggestions = $('#searchSuggestions');
    const searchError = $('#search-error');
    const searchIcon = $('#search-icon');
    let searchSuggestionsArray = [];

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Handle the data
    })
    .catch(error => {
        console.error('Error fetching product suggestions:', error);
        searchError.text('Error fetching product suggestions.');
    });

    fetch('https://api.example.com/products')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                searchSuggestionsArray.push(product.name);
            });
        })
        .catch(error => {
            console.error('Error fetching product suggestions:', error);
            searchError.text('Error fetching product suggestions.');
        });

        searchInput.on('input', debounce(function() {
            const searchInputValue = this.value;
            const filteredSuggestions = searchSuggestionsArray.filter(suggestion =>
                suggestion.toLowerCase().includes(searchInputValue.toLowerCase())
            );
            searchSuggestions.html('');  // Clear previous suggestions
            searchIcon.removeClass('fa-spinner').addClass('fa-times');
        }, 300));  // Delay of 300ms

    // Initialize Select2 for dropdowns
    $('select').select2({
        placeholder: "Select an item",
        allowClear: true
    });

    


    // Initialize Google Places Autocomplete for address fields
    const originField = $('#origin');
    const destinationField = $('#destination');
    new google.maps.places.Autocomplete(originField[0], { types: ['geocode'], componentRestrictions: { country: 'us' } });
    new google.maps.places.Autocomplete(destinationField[0], { types: ['geocode'], componentRestrictions: { country: 'us' } });
    
    // Real-Time Validation
    $('#clientEmail').on('input', function() {
        validateField($(this), /^[^\s@]+@[^\s@]+\.[^\s@]+$/, $('#email-error'), 'Please enter a valid email address.');
    });

    $('#clientPhone').on('input', function() {
        validateField($(this), /^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/, $('#phone-error'), 'Please enter a valid phone number.');
    });

    $('#origin').on('input', function() {
        validateField($(this), /.+/, $('#origin-error'), 'Please enter the origin address.');
    });

    $('#destination').on('input', function() {
        validateField($(this), /.+/, $('#destination-error'), 'Please enter the destination address.');
    });

    $('#moveDate').on('input', function() {
        validateField($(this), /.+/, $('#moveDate-error'), 'Please enter the move date.');
    });

    // Add items dynamically
    addItem('mainBedroom', 'Queen Bed', 1);
    addItem('mainBedroom', 'King Bed', 1);
    addItem('kitchen', 'Refrigerator', 1);
    addItem('livingRoom', 'Sofa', 1);
    addItem('livingRoom', 'Coffee Table', 1);

    // Sort inventory items when the sort option is selected
    $('#sort-dropdown').on('change', function() {
        sortInventory(this.value);
    });

    document.getElementById('submitForm').addEventListener('click', function(event) {
        event.preventDefault();
    
        // Gather form data
        const formData = {
            clientName: document.getElementById('clientName').value,
            clientEmail: document.getElementById('clientEmail').value,
            origin: document.getElementById('origin').value,
            destination: document.getElementById('destination').value,
            moveDate: document.getElementById('moveDate').value,
            selectedItems: []  // Initialize selectedItems as an empty array
        };
    
        // Call validateForm with the formData object
        if (validateForm(formData)) {
            // Proceed with form submission
            console.log('Form is valid');
        } else {
            console.log('Form validation failed');
        }
    
        // Capture selected rooms
        const selectedRooms = Array.from(document.getElementById('roomSelect').selectedOptions).map(option => option.value);
        formData.selectedRooms = selectedRooms;
    
        // Capture selected items per room
        selectedRooms.forEach(room => {
            const roomItems = Array.from(document.querySelectorAll(`input[name="${room}"]:checked`)).map(input => input.value);
            formData.selectedItems.push(...roomItems);
        });
    
        console.log(formData); // Send this data to the backend
        // Submit form data logic here (e.g., AJAX, fetch)
    });

    // Theme toggle functionality
    $('#theme-toggle').on('click', function() {
        toggleTheme();
    });

    // Load user's theme preference on page load
    $(window).on('load', function() {
        loadUserThemePreference();
    });

    // Multi-step form functionality
    let currentStep = 0;
    const steps = $(".step");  // Use const for variables that won't change
    const nextButtons = $(".next-button");
    function showStep(stepIndex) {
        steps.each(function(index) {
            $(this).toggle(index === stepIndex);
        });
    }       $(this).css('display', index === stepIndex ? 'block' : 'none');
        });
    

    nextButtons.on('click', function() {
        if (validateStep(currentStep, steps)) {
            currentStep++;
            showStep(currentStep);
        }
    });

    prevButtons.on('click', function() {
        currentStep--;
        showStep(currentStep);
    });

    steps.each(function(index) {
        const submitButton = $(this).find("button[type='submit']");
        submitButton.on('click', function(event) {
            if (!validateStep(index, steps)) {
                event.preventDefault();
            }
        });
    });

    