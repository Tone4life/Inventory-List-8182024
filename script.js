Sentry.init({ dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0' });
import 'bootstrap/dist/js/bootstrap.bundle.min';


document.addEventListener("DOMContentLoaded", function() {
    // Initialize Select2 for all dropdowns
    $('select').select2({
        placeholder: "Select an item",
        allowClear: true
    });

    // Initialize Google Places Autocomplete for address fields
    const originField = document.getElementById('origin');
    const destinationField = document.getElementById('destination');

    new google.maps.places.Autocomplete(originField, {
        types: ['geocode'],
        componentRestrictions: { country: "us" } // Adjust country code as needed
    });

    new google.maps.places.Autocomplete(destinationField, { 
        types: ['geocode'],
        componentRestrictions: { country: "us" } // Adjust country code as needed
    });


    let inventoryData = {}; // Store selected items for each room

function showRoomItems() {
    const roomSelect = document.getElementById('roomSelect');
    const roomItems = document.getElementById('roomItems');
    const selectedRoom = roomSelect.value;

    roomItems.innerHTML = ''; // Clear previous items

    // Define items per room
    const roomInventory = {
        mainBedroom: [
            { name: 'King Bed' },
            { name: 'Queen Bed' },
            { name: 'Wardrobe' }
        ],
        livingRoom: [
            { name: 'Sofa' },
            { name: 'Coffee Table' },
            { name: 'TV Stand' }
        ],
        kitchen: [
            { name: 'Refrigerator' },
            { name: 'Stove' },
            { name: 'Microwave' }
        ],
        garage: [
            { name: 'Lawn Mower' },
            { name: 'Tool Box' },
            { name: 'Bike' }
        ]
    };

    // Create a form for items in the selected room
    if (roomInventory[selectedRoom]) {
        roomInventory[selectedRoom].forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'row mb-3';
            const itemQuantity = inventoryData[selectedRoom] && inventoryData[selectedRoom][index] ? inventoryData[selectedRoom][index].quantity : '';

            row.innerHTML = `
                <div class="col-md-8">
                    <label class="form-label">${item.name}</label>
                </div>
                <div class="col-md-4">
                    <input type="number" class="form-control" placeholder="Quantity" value="${itemQuantity}" onchange="saveItem('${selectedRoom}', ${index}, this.value)">
                </div>
            `;
            roomItems.appendChild(row);
        });
    }
}

function saveItem(room, index, quantity) {
    if (!inventoryData[room]) {
        inventoryData[room] = [];
    }
    inventoryData[room][index] = { quantity };
}

// You can log the inventoryData to verify that the input is being stored properly
     console.log(inventoryData);

    // Show items when a room is selected
// Add event listener for room selection change
    document.getElementById('roomSelect').addEventListener('change', showRoomItems);
    
    // Show items for the default room
    document.getElementById('email').addEventListener('input', function () {
        const emailField = this;
        const emailValue = emailField.value;
        const emailError = document.getElementById('email-error');
      
        if (!emailValue.includes('@')) {
          emailError.textContent = 'Please enter a valid email address.';
          emailField.classList.add('error');
        } else {
          emailError.textContent = '';
          emailField.classList.remove('error');
        }
      });
});

  // Name validation
  document.getElementById('clientName').addEventListener('input', function () {
    const nameField = this;
    const nameValue = nameField.value;
    const nameError = document.getElementById('clientName-error');

    if (nameValue.trim() === '') {
        nameError.textContent = 'Please enter your name.';
        nameField.classList.add('error');
    } else {
        nameError.textContent = '';
        nameField.classList.remove('error');
    }
});

// Origin address validation
document.getElementById('origin').addEventListener('input', function () {
    const originField = this;
    const originValue = originField.value;
    const originError = document.getElementById('origin-error');

    if (originValue.trim() === '') {
        originError.textContent = 'Please enter the origin address.';
        originField.classList.add('error');
    } else {
        originError.textContent = '';
        originField.classList.remove('error');
    }
});

// Destination address validation
document.getElementById('destination').addEventListener('input', function () {
    const destinationField = this;
    const destinationValue = destinationField.value;
    const destinationError = document.getElementById('destination-error');

    if (destinationValue.trim() === '') {
        destinationError.textContent = 'Please enter the destination address.';
        destinationField.classList.add('error');
    } else {
        destinationError.textContent = '';
        destinationField.classList.remove('error');
    }
});

// Move date validation
document.getElementById('moveDate').addEventListener('input', function () {
    const moveDateField = this;
    const moveDateValue = moveDateField.value;
    const moveDateError = document.getElementById('moveDate-error');

    if (moveDateValue.trim() === '') {
        moveDateError.textContent = 'Please enter the move date.';
        moveDateField.classList.add('error');
    } else {
        moveDateError.textContent = '';
        moveDateField.classList.remove('error');
    }
});

document.getElementById('save-progress').addEventListener('click', function () {
    const formData = {
        clientName: document.getElementById('clientName').value,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        clientEmail: document.getElementById('clientEmail').value,
        moveDate: document.getElementById('moveDate').value,
        // Add other fields as needed
    };
    localStorage.setItem('formData', JSON.stringify(formData));
    alert('Progress saved!');
});

// Load saved progress
window.addEventListener('load', function () {
    const savedData = JSON.parse(localStorage.getItem('formData'));
    if (savedData) {
        document.getElementById('clientName').value = savedData.clientName;
        document.getElementById('origin').value = savedData.origin;
        document.getElementById('destination').value = savedData.destination;
        document.getElementById('clientEmail').value = savedData.clientEmail;
        document.getElementById('moveDate').value = savedData.moveDate;
        // Load other fields as needed
    }
});

// Autosave functionality
setInterval(function () {
    const formData = {
        clientName: document.getElementById('clientName').value,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        clientEmail: document.getElementById('clientEmail').value,
        moveDate: document.getElementById('moveDate').value,
        // Add other fields as needed
    };
    localStorage.setItem('formData', JSON.stringify(formData));
    console.log('Autosave: Progress saved!');
}, 30000); // Save every 30 seconds

// Track form submissions
document.getElementById('submit-button').addEventListener('click', function () {
    gtag('event', 'submit', {
      'event_category': 'Form',
      'event_label': 'Inventory Form',
    });
  });

   // Theme toggle functionality
   const themeToggleButton = document.getElementById('theme-toggle');
   themeToggleButton.addEventListener('click', function () {
       document.body.classList.toggle('dark-mode');
       if (document.body.classList.contains('dark-mode')) {
           themeToggleButton.textContent = 'Switch to Light Mode';
       } else {
           themeToggleButton.textContent = 'Switch to Dark Mode';
       }
   });
  
   // Save user preference
document.getElementById('save-preferences').addEventListener('click', function () {
    const preferences = {
        preferredLayout: 'compact',
        defaultAddress: document.getElementById('origin').value,
    };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    alert('Preferences saved!');
});

// Load user preference
window.addEventListener('load', function () {
    const savedPreferences = JSON.parse(localStorage.getItem('userPreferences'));
    if (savedPreferences) {
        if (savedPreferences.preferredLayout === 'compact') {
            document.body.classList.add('compact-layout');
        }
        document.getElementById('origin').value = savedPreferences.defaultAddress;
    }
});

// Handle multi-step form functionality
document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 0;
    const steps = document.querySelectorAll(".step");
    const nextButtons = document.querySelectorAll(".next-button");
    const prevButtons = document.querySelectorAll(".previous-button");

    // Show the current step
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? "block" : "none";
        });
    }

    // Move to the next step
    nextButtons.forEach((button) => {
        button.addEventListener("click", function () {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Move to the previous step
    prevButtons.forEach((button) => {
        button.addEventListener("click", function () {
            currentStep--;
            showStep(currentStep);
        });
    });

    // Validate each step before proceeding
    function validateStep(stepIndex) {
        const currentInputs = steps[stepIndex].querySelectorAll("input");
        let isValid = true;

        currentInputs.forEach((input) => {
            if (!input.value) {
                input.classList.add("error");
                input.nextElementSibling.textContent = "This field is required.";
                isValid = false;
            } else {
                input.classList.remove("error");
                input.nextElementSibling.textContent = "";
            }
        });

        return isValid;
    }

    // Initialize the first step
    showStep(currentStep);
});


const express = require('express'); 
const helmet = require('helmet');

// Assuming this is the first declaration of `app`

// Remove any other declarations of `app`
// Use the existing `app` variable for further configurations
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://maps.googleapis.com"],
            styleSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});