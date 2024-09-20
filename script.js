// Sentry.init({ dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0' });
// import 'bootstrap/dist/js/bootstrap.bundle.min';

// document.addEventListener("DOMContentLoaded", function() {
//     // Initialize Select2 for all dropdowns
//     // $('select').select2({
//     //     placeholder: "Select an item",
//     //     allowClear: true
//     // });

//     // Initialize Google Places Autocomplete for address fields
//     // const originField = document.getElementById('origin');
//     // const destinationField = document.getElementById('destination');

//     // new google.maps.places.Autocomplete(originField, {
//     //     types: ['geocode'],
//     //     componentRestrictions: { country: "us" } // Adjust country code as needed
//     // });

//     // new google.maps.places.Autocomplete(destinationField, {
//     //     types: ['geocode'],
//     //     componentRestrictions: { country: "us" } // Adjust country code as needed
//     // });

//     // Global inventory object to hold saved items
//     // const inventoryData = {};

//     // Function to save item to inventory
//     // function saveItem(room, index, quantity) {
//     //     if (!inventoryData[room]) {
//     //         inventoryData[room] = [];
//     //     }
//     //     inventoryData[room][index] = { quantity };
//     //     console.log(`Saved ${quantity} for ${room}, item ${index}`); // You can use this to verify that data is being saved
//     // }

//     // Show room items when a room is selected
//     // document.getElementById('roomSelect').addEventListener('change', showRoomItems);

//     // function showRoomItems() {
//     //     const roomSelect = document.getElementById('roomSelect');
//     //     const roomItems = document.getElementById('roomItems');
//     //     const selectedRoom = roomSelect.value;
//     //     roomItems.innerHTML = ''; // Clear previous items

//     //     const roomInventory = {
//     //         mainBedroom: [
//     //             { name: 'King Bed' },
//     //             { name: 'Queen Bed' },
//     //             { name: 'Armoire' },
//     //             { name: 'Dresser' }
//     //         ],
//     //         secondBedroom: [
//     //             { name: 'Twin Bed' },
//     //             { name: 'Bunk Bed' },
//     //             { name: 'Nightstand' }
//     //         ],
//     //         kitchen: [
//     //             { name: 'Refrigerator' },
//     //             { name: 'Microwave' },
//     //             { name: 'Dishwasher' },
//     //             { name: 'Coffee Maker' }
//     //         ],
//     //         livingRoom: [
//     //             { name: 'Sofa' },
//     //             { name: 'Coffee Table' },
//     //             { name: 'TV Stand' }
//     //         ]
//     //     };

//     //     if (roomInventory[selectedRoom]) {
//     //         roomInventory[selectedRoom].forEach((item, index) => {
//     //             const row = document.createElement('div');
//     //             row.className = 'row mb-3';
//     //             row.innerHTML = `
//     //                 <div class="col-md-8">
//     //                     <label class="form-label">${item.name}</label>
//     //                 </div>
//     //                 <div class="col-md-4">
//     //                     <input type="number" class="form-control" placeholder="Quantity" id="item-${selectedRoom}-${index}">
//     //                 </div>
//     //             `;
//     //             roomItems.appendChild(row);

//     //             // Dynamically attach the event listener
//     //             const inputElement = document.getElementById(`item-${selectedRoom}-${index}`);
//     //             inputElement.addEventListener('input', function () {
//     //                 saveItem(selectedRoom, index, inputElement.value);
//     //             });
//     //         });
//     //     } else {
//     //         roomItems.innerHTML = '<p>No items available for this room.</p>';
//     //     }
//     // }

//     // Client Email Validation
//     // document.getElementById('clientEmail').addEventListener('input', function () {
//     //     const emailField = this;
//     //     const emailValue = emailField.value;
//     //     const emailError = document.getElementById('email-error');

//     //     if (!emailValue.includes('@')) {
//     //         emailError.textContent = 'Please enter a valid email address.';
//     //         emailField.classList.add('error');
//     //     } else {
//     //         emailError.textContent = '';
//     //         emailField.classList.remove('error');
//     //     }
//     // });

//     // Client Name Validation
//     // document.getElementById('clientName').addEventListener('input', function () {
//     //     const nameField = this;
//     //     const nameValue = nameField.value;
//     //     const nameError = document.getElementById('clientName-error');

//     //     if (nameValue.trim() === '') {
//     //         nameError.textContent = 'Please enter your name.';
//     //         nameField.classList.add('error');
//     //     } else {
//     //         nameError.textContent = '';
//     //         nameField.classList.remove('error');
//     //     }
//     // });

//     // Other fields validation
//     // function handleValidation(fieldId, errorId, message) {
//     //     const field = document.getElementById(fieldId);
//     //     const error = document.getElementById(errorId);

//     //     field.addEventListener('input', function () {
//     //         if (field.value.trim() === '') {
//     //             error.textContent = message;
//     //             field.classList.add('error');
//     //         } else {
//     //             error.textContent = '';
//     //             field.classList.remove('error');
//     //         }
//     //     });
//     // }

//     // handleValidation('origin', 'origin-error', 'Please enter the origin address.');
//     // handleValidation('destination', 'destination-error', 'Please enter the destination address.');
//     // handleValidation('moveDate', 'moveDate-error', 'Please enter the move date.');

//     // Save progress
//     // document.getElementById('save-progress').addEventListener('click', function () {
//     //     const formData = {
//     //         clientName: document.getElementById('clientName').value,
//     //         origin: document.getElementById('origin').value,
//     //         destination: document.getElementById('destination').value,
//     //         clientEmail: document.getElementById('clientEmail').value,
//     //         moveDate: document.getElementById('moveDate').value,
//     //     };

//     //     localStorage.setItem('formData', JSON.stringify(formData));
//     //     alert('Progress saved!');
//     // });

//     // Load saved progress on page load
//     // window.addEventListener('load', function () {
//     //     const savedData = JSON.parse(localStorage.getItem('formData'));

//     //     if (savedData) {
//     //         document.getElementById('clientName').value = savedData.clientName;
//     //         document.getElementById('origin').value = savedData.origin;
//     //         document.getElementById('destination').value = savedData.destination;
//     //         document.getElementById('clientEmail').value = savedData.clientEmail;
//     //         document.getElementById('moveDate').value = savedData.moveDate;
//     //     }
//     // });

//     // Autosave functionality
//     // setInterval(function () {
//     //     const formData = {
//     //         clientName: document.getElementById('clientName').value,
//     //         origin: document.getElementById('origin').value,
//     //         destination: document.getElementById('destination').value,
//     //         clientEmail: document.getElementById('clientEmail').value,
//     //         moveDate: document.getElementById('moveDate').value,
//     //     };

//     //     localStorage.setItem('formData', JSON.stringify(formData));
//     //     console.log('Autosave: Progress saved!');
//     // }, 30000); // Save every 30 seconds

//     // Track form submission
//     // document.getElementById('submit-button').addEventListener('click', function () {
//     //     gtag('event', 'submit', {
//     //         event_category: 'Form',
//     //         event_label: 'Inventory Form',
//     //     });
//     // });

//     // Theme toggle functionality
//     // const themeToggleButton = document.getElementById('theme-toggle');
//     // themeToggleButton.addEventListener('click', function () {
//     //     document.body.classList.toggle('dark-mode');

//     //     if (document.body.classList.contains('dark-mode')) {
//     //         themeToggleButton.textContent = 'Switch to Light Mode';
//     //     } else {
//     //         themeToggleButton.textContent = 'Switch to Dark Mode';
//     //     }
//     // });

//     // Save user preference
//     // document.getElementById('save-preferences').addEventListener('click', function () {
//     //     const preferences = {
//     //         preferredLayout: 'compact',
//     //         defaultAddress: document.getElementById('origin').value,
//     //     };

//     //     localStorage.setItem('userPreferences', JSON.stringify(preferences));
//     //     alert('Preferences saved!');
//     // });

//     // Load user preference on page load
//     // window.addEventListener('load', function () {
//     //     const savedPreferences = JSON.parse(localStorage.getItem('userPreferences'));

//     //     if (savedPreferences) {
//     //         if (savedPreferences.preferredLayout === 'compact') {
//     //             document.body.classList.add('compact-layout');
//     //         }

//     //         document.getElementById('origin').value = savedPreferences.defaultAddress;
//     //     }
//     // });

//     // Handle multi-step form functionality
//     // let currentStep = 0;
//     // const steps = document.querySelectorAll(".step");
//     // const nextButtons = document.querySelectorAll(".next-button");
//     // const prevButtons = document.querySelectorAll(".previous-button");

//     // // Show the current step
//     // function showStep(stepIndex) {
//     //     steps.forEach((step, index) => {
//     //         step.style.display = index === stepIndex ? "block" : "none";
//     //     });
//     // }

//     // // Move to the next step
//     // nextButtons.forEach((button) => {
//     //     button.addEventListener("click", function () {
//     //         if (validateStep(currentStep)) {
//     //             currentStep++;
//     //             showStep(currentStep);
//     //         }
//     //     });
//     // });

//     // // Move to the previous step
//     // prevButtons.forEach((button) => {
//     //     button.addEventListener("click", function () {
//     //         currentStep--;
//     //         showStep(currentStep);
//     //     });
//     // });

//     // // Validate each step before proceeding
//     // // This function checks if all input fields in the current step are filled out
//     // // and displays an error message if any field is empty.
//     // function validateStep(stepIndex) {
//     //     const currentInputs = steps[stepIndex].querySelectorAll("input");
//     //     let isValid = true;

//     //     currentInputs.forEach(function(input) {
//     //         if (!input.value) {
//     //             input.classList.add("error");
//     //             input.
// Assuming this is the first declaration of `app`
// Import necessary modules
import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app = express(); // Create an Express app

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for handling JSON data
app.use(express.json());

// Middleware for handling form data
app.use(express.urlencoded({ extended: true }));

// Middleware for serving static files
app.use(express.static('public'));

// Middleware for handling CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Middleware for handling Google Analytics tracking
app.use((req, res, next) => {
  res.locals.gaTrackingId = 'YOUR_GA_TRACKING_ID';
  next();
});

// Middleware for handling Google Tag Manager tracking
app.use((req, res, next) => {
  res.locals.gtmId = 'YOUR_GTM_CONTAINER_ID';
  next();
});

// Middleware for handling Helmet security
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

// Route for serving the inventory form
app.get('/', (_req, res) => {
  res.send('Hello World!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;