 Sentry.init({ dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0' });
 import 'bootstrap/dist/js/bootstrap.bundle.min';

 
    // Initialize tooltips and popovers
document.addEventListener("DOMContentLoaded", function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});

// Initialize datepickers and Timepickers
$(document).ready(function() {
    $('input[type="date"]').datepicker();
    $('input[type="time"]').timepicker();
});

// Initialize Autocomplete for product search
$(document).ready(function() {
    const searchInput = $('#productSearch');
    const searchSuggestions = $('#searchSuggestions');
    const searchResults = $('#searchResults');
    const searchError = $('#search-error');
    const searchIcon = $('#search-icon');
    const searchSuggestionsArray = [];

    // Fetch product suggestions from API
    fetch('https://api.example.com/products')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                searchSuggestionsArray.push(product.name);
            });
        })
        .catch(error => {
            console.error('Error fetching product suggestions:', error);
            searchErrorArray.push('Error fetching product suggestions.');
        });

    // Fetch product details from API

    // Update search suggestions based on input
    searchInput.on('input', function() {
        const searchInputValue = this.value;
        const searchSuggestionsArrayFiltered = searchSuggestionsArray.filter(suggestion => suggestion.toLowerCase().includes(searchInputValue.toLowerCase()));
        searchSuggestions.html('');
        searchSuggestionsArrayFiltered.forEach(suggestion => {
            const suggestionElement = $('<li>').text(suggestion);
            searchSuggestions.append(suggestionElement);
        });
        searchSuggestionsArray = searchSuggestionsArrayFiltered;
        searchInputValue = searchInputValue;
        searchTimeout = null;
        searchTimeout = setTimeout(function() {
            searchSuggestions.html('');
            searchSuggestionsArray = [];
            searchInputValue = '';
        }, 500);
        searchIcon.removeClass('fa-spinner');
        searchIcon.addClass('fa-spinner');
        searchIcon.removeClass('fa-times');
    });

    // Initialize Select2 for dropdowns
    $('select').select2({
        placeholder: "Select an item",
        allowClear: true
    });

    // Initialize Google Places Autocomplete for address fields
    $(document).ready(function() {
        const originField = $('#origin');
        const destinationField = $('#destination');

        new google.maps.places.Autocomplete(originField[0], { types: ['geocode'], componentRestrictions: { country: 'us' } });
        new google.maps.places.Autocomplete(destinationField[0], { types: ['geocode'], componentRestrictions: { country: 'us' } });
    });

    // Real-Time Email Validation
    $('#clientEmail').on('input', function() {
        const emailField = $(this);
        const emailValue = emailField.val();
        const emailError = $('#email-error');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailValue)) {
            emailError.text('Please enter a valid email address.');
            emailField.addClass('error');
        } else {
            emailError.text('');
            emailField.removeClass('error');
        }
    });

    // Real-Time Phone Number Validation
    $('#clientPhone').on('input', function() {
        const phoneField = $(this);
        const phoneValue = phoneField.val();
        const phoneError = $('#phone-error');

        const phoneRegex = /^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/;

        if (!phoneRegex.test(phoneValue)) {
            phoneError.text('Please enter a valid phone number in the format +1 (XXX) XXX-XXXX.');
            phoneField.addClass('error');
        } else {
            phoneError.text('');
            phoneField.removeClass('error');
        }
    });

    // Origin Field Validation
    $('#origin').on('input', function() {
        const originField = $(this);
        const originError = $('#origin-error');

        if (originField.val().trim() === '') {
            originError.text('Please enter an origin address.');
            originField.addClass('error');
        } else {
            originError.text('');
            originField.removeClass('error');
        }
    });

    // Destination Field Validation
    $('#destination').on('input', function() {
        const destinationField = $(this);
        const destinationError = $('#destination-error');

        if (destinationField.val().trim() === '') {
            destinationError.text('Please enter a destination address.');
            destinationField.addClass('error');
        } else {
            destinationError.text('');
            destinationField.removeClass('error');
        }
    });

    // Function to add items dynamically
    function addItem(room, itemName, quantity) {
        const roomItems = $('#roomItems');
        const itemRow = $('<div>').addClass('row mb-3');
        itemRow.html(`
            <div class="col-md-8">${itemName}</div>
            <div class="col-md-4"><input type="number" class="form-control" value="${quantity}"></div>
        `);
        roomItems.append(itemRow);

        // Dynamically attach the event listener
        const inputElement = itemRow.find('input');
        inputElement.on('input', function() {
            saveItem(room, itemName, inputElement.val());
        });
    }

    // Add items dynamically
    addItem('mainBedroom', 'Queen Bed', 1);
    addItem('mainBedroom', 'King Bed', 1);
    addItem('kitchen', 'Refrigerator', 1);
    addItem('livingRoom', 'Sofa', 1);
    addItem('livingRoom', 'Coffee Table', 1);

    // Function to sort inventory items
    function sortInventory(sortBy) {
        const roomItems = $('#roomItems');
        let items = roomItems.children();
        items.sort((a, b) => {
            const valA = $(a).find('.form-label').text();
            const valB = $(b).find('.form-label').text();
            if (sortBy === 'name') {
                return valA.localeCompare(valB);
            } else if (sortBy === 'quantity') {
                const quantityA = parseInt($(a).find('input').val());
                const quantityB = parseInt($(b).find('input').val());
                return quantityA - quantityB;
            }
        });
        // Clear and re-add sorted items
        roomItems.html('');
        items.each((index, item) => roomItems.append(item));
    }

    // Sort inventory items when a sort option is selected
    $('#sort-dropdown').on('change', function() {
        const selectedSortBy = $(this).val();
        sortInventory(selectedSortBy);
    });

    // Global inventory object to hold saved items
    const inventoryData = {};

    // Function to save item to inventory
    function saveItem(room, itemName, quantity) {
        if (!inventoryData[room]) {
            inventoryData[room] = [];
        }
        inventoryData[room][itemName] = { quantity };
        console.log(`Saved ${quantity} for ${room}, item ${itemName}`); // You can use this to verify that data is being saved
    }

    // Show room items when a room is selected
    $('#roomSelect').on('change', function() {
        const roomSelect = $(this);
        const roomItems = $('#roomItems');
        const selectedRoom = roomSelect.val();
        roomItems.html(''); // Clear previous items

        const roomInventory = {
            mainBedroom: [
                { name: 'King Bed', quantity: 1 },
                { name: 'Queen Bed', quantity: 1 },
                { name: 'Nightstand', quantity: 2 },
            ],
            secondBedroom: [
                { name: 'Twin Bed', quantity: 2 },
                { name: 'Bunk Bed', quantity: 1 },
                { name: 'Nightstand', quantity: 1 },
            ],
            kitchen: [
                { name: 'Refrigerator', quantity: 1 },
                { name: 'Microwave', quantity: 1 },
                { name: 'Dishwasher', quantity: 1 },
                { name: 'Coffee Maker', quantity: 1 },
            ],
            livingRoom: [
                { name: 'Sofa', quantity: 1 },
                { name: 'Coffee Table', quantity: 1 },
                { name: 'TV Stand', quantity: 1 },
            ]
        };

        if (roomInventory[selectedRoom]) {
            roomInventory[selectedRoom].forEach((item, index) => {
                addItem(selectedRoom, item.name, item.quantity);
            });
        } else {
            roomItems.html('<p>No items available for this room.</p>');
        }
    });

    // Client Name Validation
    $('#clientName').on('input', function() {
        const nameField = $(this);
        const nameValue = nameField.val();
        const nameError = $('#clientName-error');

        if (nameValue.trim() === '') {
            nameError.text('Please enter your name.');
            nameField.addClass('error');
        } else {
            nameError.text('');
            nameField.removeClass('error');
        }
        // Add more validation for name field here if needed
    });
});
  // Client Origin Validation
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
     // Add more validation for origin and destination fields here if needed
     });
     // Client Destination Validation
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
     // Add more validation for origin and destination fields here if needed
     });
     // Client Email Validation
     document.getElementById('clientEmail').addEventListener('input', function () {
     const emailField = this;
     const emailValue = emailField.value;
     const emailError = document.getElementById('email-error');
     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (emailValue.trim() === '' ||!emailPattern.test(emailValue)) {
         emailError.textContent = 'Please enter a valid email address.';
         emailField.classList.add('error');
     } else {
         emailError.textContent = '';
         emailField.classList.remove('error');
     }
     // Add more validation for email field here if needed
     });
     // Client Move Date Validation
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
     // Add more validation for move date field here if needed
     });

// Function to handle form submission
 document.getElementById('submitForm').addEventListener('click', function (event) {
     event.preventDefault();

     const formData = {
         clientName: document.getElementById('clientName').value,
         origin: document.getElementById('origin').value,
         destination: document.getElementById('destination').value,
         clientEmail: document.getElementById('clientEmail').value,
         moveDate: document.getElementById('moveDate').value,
     };

     // Validate form inputs
     if (validateForm(formData)) {
         // Save progress
         // localStorage.setItem('formData', JSON.stringify(formData));
         alert('Form submitted successfully!');
     }
 });
 // Function to validate form inputs
 function validateForm(formData) {
     let isValid = true;

     const nameField = document.getElementById('clientName');
     const emailField = document.getElementById('clientEmail');
     const originField = document.getElementById('origin');
     const destinationField = document.getElementById('destination');
     const moveDateField = document.getElementById('moveDate');

     if (formData.clientName.trim() === '') {
         isValid = false;
         nameField.classList.add('error');
     } else {
         nameField.classList.remove('error');
     }

     if (formData.clientEmail.trim() === '' ||!/^\S+@\S+\.\S+$/.test(formData.clientEmail)) {
         isValid = false;
         emailField.classList.add('error');
     } else {
         emailField.classList.remove('error');
     }

     if (formData.origin.trim() === '') {
         isValid = false;
         originField.classList.add('error');
         } else {
         originField.classList.remove('error');
     }
     if (formData.destination.trim() === '') {
         isValid = false;
         destinationField.classList.add('error');
         } else {
         destinationField.classList.remove('error');
     }
     if (formData.moveDate.trim() === '') {
         isValid = false;
         moveDateField.classList.add('error');
         } else {
         moveDateField.classList.remove('error');
     }
     return isValid;
    }

// Dynamically handle room selection and item input fields
 document.getElementById('roomSelection').addEventListener('change', function () {roomItems.innerHTML = ''; });
     const selectedRoom = this.value;
     const roomItems = document.getElementById('roomItems');
     roomItems.innerHTML = '';

     if (roomInventory[selectedRoom]) {
         roomInventory[selectedRoom].forEach((item, index) => {});
             const row = document.createElement('div');
             row.className = 'row mb-3';
             row.innerHTML = `
                 <div class="col-md-8">
                     <label class="form-label">${item.name}</label>
                 </div>
                 <div class="col-md-4">
                     <input type="number" class="form-control" placeholder="Quantity" id="item-${selectedRoom}-${index}">
                 </div>
             `;
             roomItems.appendChild(row);

             // Dynamically attach the event listener
             const inputElement = document.getElementById(`item-${selectedRoom}-${index}`);
             inputElement.addEventListener('input', function () {
                 saveItem(selectedRoom, index, inputElement.value);
             });

 function handleValidation(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
     const error = document.getElementById(errorId);

     field.addEventListener('input', function () {
         if (field.value.trim() === '') {
             error.textContent = message;
             field.classList.add('error');
         } else {
             error.textContent = '';
             field.classList.remove('error');
         }
     });
 }
 handleValidation('clientName', 'clientName-error', 'Please enter your name.');
 handleValidation('clientEmail', 'email-error', 'Please enter a valid email address.');  
 handleValidation('origin', 'origin-error', 'Please enter the origin address.');
 handleValidation('destination', 'destination-error', 'Please enter the destination address.');
 handleValidation('moveDate', 'moveDate-error', 'Please enter the move date.');

//     // Save progress
document.getElementById('save-progress').addEventListener('click', function () {
    const formData = {
        clientName: document.getElementById('clientName').value,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        clientEmail: document.getElementById('clientEmail').value,
        moveDate: document.getElementById('moveDate').value,
    };

    localStorage.setItem('formData', JSON.stringify(formData));
    alert('Progress saved!');
});

// Load saved data on page load
window.addEventListener('load', function () {
    const savedData = JSON.parse(localStorage.getItem('formData'));

    if (savedData) {
        document.getElementById('clientName').value = savedData.clientName;
        document.getElementById('origin').value = savedData.origin;
        document.getElementById('destination').value = savedData.destination;
        document.getElementById('clientEmail').value = savedData.clientEmail;
        document.getElementById('moveDate').value = savedData.moveDate;
    }
});

setInterval(function () {
    const formData = {
        clientName: document.getElementById('clientName').value,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        clientEmail: document.getElementById('clientEmail').value,
        moveDate: document.getElementById('moveDate').value,
    };

    localStorage.setItem('formData', JSON.stringify(formData));
    console.log('Autosave: Progress saved!');
}, 30000); // Save every 30 seconds


//     // Track form submission
 document.getElementById('submit-button').addEventListener('click', function () {
     gtag('event', 'submit', {
         event_category: 'Form',
        event_label: 'Inventory Form',
     });
     alert('Form submitted!');
      // Reset form fields after submission
      document.getElementById('clientName').value = '';
      document.getElementById('origin').value = '';
      document.getElementById('destination').value = '';
      document.getElementById('clientEmail').value = '';
      document.getElementById('moveDate').value = '';
 });



//     // Theme toggle functionality
const themeToggleButton = document.getElementById('theme-toggle');
themeToggleButton.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeToggleButton.textContent = 'Switch to Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggleButton.textContent = 'Switch to Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});

// Load user’s theme preference on page load
window.addEventListener('load', function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleButton.textContent = 'Switch to Light Mode';
    }
});


     localStorage.setItem('userPreferences', JSON.stringify(preferences));
    alert('Preferences saved!');
 }
//     // Load user preference on page load
      window.addEventListener('load', function () {
         const savedPreferences = JSON.parse(localStorage.getItem('userPreferences'));

     if (savedPreferences) {
         if (savedPreferences.preferredLayout === 'compact') {
             document.body.classList.add('compact-layout');
         }

         document.getElementById('origin').value = savedPreferences.defaultAddress;
     }
 });

//     // Handle multi-step form functionality
 let currentStep = 0;
 const steps = document.querySelectorAll(".step");
 const nextButtons = document.querySelectorAll(".next-button");
 const prevButtons = document.querySelectorAll(".previous-button");

//     // // Show the current step
 function showStep(stepIndex) {}
     steps.forEach((step, index) => {
         step.style.display = index === stepIndex ? "block" : "none";
     });
//     // }

//     // // Move to the next step
 nextButtons.forEach((button) => {
     button.addEventListener("click", function () {
         if (validateStep(currentStep)) {
             currentStep++;
             showStep(currentStep);
         }
     });
 });

//     // // Move to the previous step
 prevButtons.forEach((button) => {
     button.addEventListener("click", function () {
         currentStep--;
         showStep(currentStep);
     });
 });

//     // // Validate each step before proceeding
//     // // This function checks if all input fields in the current step are filled out
//     // // and displays an error message if any field is empty.
function validateStep(stepIndex) {
     const currentInputs = steps[stepIndex].querySelectorAll("input");
     let isValid = true;

     currentInputs.forEach(function(input) {
         if (!input.value) {
             input.classList.add("error");
             input.
             isValid = false;
            }
        });
        return isValid;
    }
    // // // Add event listeners to the form submission button for each step
    steps.forEach((step, index) => {
         const submitButton = step.querySelector("button[type='submit']");
         submitButton.addEventListener("click", function (event) {
             event.preventDefault();
             if (validateStep(index)) {
                 // Process form submission
                 //...
                 alert("Form submitted successfully!");
                 // Reset the form after submission
                 steps.forEach((step) => {
                     step.reset();
                 });
             }
         });
     });

     // // Add event listeners to the theme toggle button
     const themeToggleButton = document.getElementById("theme-toggle");
     themeToggleButton.addEventListener("click", function () {
         document.body.classList.toggle("dark-mode");
     });

//     // // Load user's theme preference on page load
     window.addEventListener("load", function () {
         const savedTheme = localStorage.getItem("theme");
         if (savedTheme === "dark") {
             document.body.classList.add("dark-mode");
             themeToggleButton.textContent = "Switch to Light Mode";
         }
     });

// Import necessary modules
import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// Set up Google Analytics and Google Tag Manager tracking IDs
 app.locals.gaTrackingId = 'YOUR_GA_TRACKING_ID';
 app.locals.gtmId = 'YOUR_GTM_CONTAINER_ID';
 app.locals.googleAnalyticsUrl = `https://www.google-analytics.com/analytics/web/js/ga.js`;
 app.locals.googleTagManagerUrl = `https://www.googletagmanager.com/gtm.js?id=${app.locals.gtmId}`;
 

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

export default app; // Export the Express app for testing purposes
// Import necessary modules
 import express from 'express';
 import cors from 'cors';
 import helmet from 'helmet';
    import csrf from 'csurf';
    import cookieParser from 'cookie-parser';
    import bodyParser from 'body-parser';
    import mongoose from 'mongoose';
    import dotenv from 'dotenv';
    import { v4 as uuidv4 } from 'uuid';
    import { User } from './models/User';
    import { Inventory } from './models/Inventory';
    import { InventoryItem } from './models/InventoryItem';
    import { sendEmail } from './utils/sendEmail';
    import { createInventoryItem } from './utils/createInventoryItem';
    import { updateInventoryItem } from './utils/updateInventoryItem';
    import { deleteInventoryItem } from './utils/deleteInventoryItem';
    import { authenticateUser } from './utils/authenticateUser';
    import { validateInventoryItem } from './utils/validateInventoryItem';
    import { validateUser } from './utils/validateUser';
    import { validateOrigin } from './utils/validateOrigin';
    import { validateDestination } from './utils/validateDestination';
    import { validateClientEmail } from './utils/validateClientEmail';
    import { validateMoveDate } from './utils/validateMoveDate';

    // Load environment variables from.env file
    dotenv.config();
    const app = express();
    app.use(cors());
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    
    app.use(csrfProtection);
    app.use((req, res, next) => {
        res.locals.csrfToken = req.csrfToken();
        next();
      res.locals.gaTrackingId = process.env.GA_TRACKING_ID;
      res.locals.gtmId = process.env.GTM_CONTAINER_ID;
      next();
    });
    app.use(express.static('public'));
    app.set('view engine', 'ejs');
    app.get('/', async (_req, res) => {
      const inventoryItems = await InventoryItem.find().populate('owner');
      res.render('index', { inventoryItems });
    });
    app.get('/inventory/:id', async (req, res) => {
      const inventoryItem = await InventoryItem.findById(req.params.id).populate('owner');
      if (!inventoryItem) return res.status(404).json({ message: 'Inventory item not found' });
      res.render('inventory-item', { inventoryItem });
    });
    // Define API routes
    // Create a new inventory item
    app.post('/api/inventory', authenticateUser, validateInventoryItem, async (req, res) => {
      try {
        const newInventoryItem = await createInventoryItem(req.body, req.user);
        res.status(201).json(newInventoryItem);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    });
    // Update an existing inventory item
    app.put('/api/inventory/:id', authenticateUser, validateInventoryItem, async (req, res) => {
      try {
        const inventoryItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('owner');
        if (!inventoryItem) return res.status(404).json({ message: 'Inventory item not found'   });
        if (inventoryItem.owner._id.toString()!== req.user._id.toString ()) return res.status(403).json({ message: 'Unauthorized' });
        res.json(inventoryItem);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    });
    // Register a new user
    app.post('/api/users', validateUser, async (req, res) => {
      try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    });
    // Get all inventory items
    app.get('/api/inventory', authenticateUser, async (req, res) => {
      try {
        const inventoryItems = await InventoryItem.find({ owner: req.user._id }).sort({ moveDate: -1 });
        res.json(inventoryItems);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    });
    // Get a specific inventory item by ID
    app.get('/api/inventory/:id', authenticateUser, async (req, res) => {
      try {
        const inventoryItem = await InventoryItem.findById(req.params.id).populate('owner');
        if (!inventoryItem) return res.status(404).json({ message: 'Inventory item not found' });
        if (inventoryItem.owner._id.toString()!== req.user._id.toString ()) return res.status(403).json({ message: 'Unauthorized' });
        res.json(inventoryItem);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    });

    // Connect to MongoDB database
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.log('Connected to MongoDB'));
    // Create a new inventory item
    app.post('/api/inventory', authenticateUser, async (req, res) => {
      const {
        name,
        description,
        quantity,
        moveDate,
        origin,
        destination,
        clientEmail,
      } = req.body;
      const errors = validateInventoryItem(name, description, quantity, moveDate, origin, destination, clientEmail);
      if (errors) return res.status(400).json(errors);
      const newInventoryItem = new InventoryItem({
        name,
        description,
        quantity,
        moveDate,
        origin,
        destination,
        clientEmail,
        owner: req.user._id,
        _id: uuidv4(),
      });
      try {
        await newInventoryItem.save();
        sendEmail(
          process.env.EMAIL_SENDER,
          clientEmail,
          'New Inventory Item',
          `A new inventory item has been created: ${name}`
        );
        res.status(201).json(newInventoryItem);
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
      // Create a new inventory item in the inventory collection
      const inventory = await Inventory.findOneAndUpdate(
        { owner: req.user._id },
        { $push: { items: newInventoryItem._id } },
        { new: true }
      ).populate('items', 'name description quantity moveDate origin destination clientEmail');
      if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
      res.json(inventory);
    });
    // Get all inventory items for a user
    app.get('/api/inventory', authenticateUser, async (req, res) => {
      try {
        const inventory = await Inventory.findOne({ owner: req.user._id }).populate('items', 'name description quantity moveDate origin destination clientEmail');
        if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
        res.json(inventory);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    });
    // Update an existing inventory item
    app.put('/api/inventory/:id', authenticateUser, async (req, res) => {
      const { id } = req.params;
      const {
        name,
        description,
        quantity,
        moveDate,
        origin,
        destination,
        clientEmail,
      } = req.body;
      const errors = validateInventoryItem(name, description, quantity, moveDate, origin, destination, clientEmail);
      if (errors) return res.status(400).json(errors);
        try {
            const updatedInventoryItem = await updateInventoryItem(id, req.user._id, name, description, quantity, moveDate, origin, destination, clientEmail);
            if (!updatedInventoryItem) return res.status(404).json({ message: 'Inventory item not found' });
            res.json(updatedInventoryItem);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
        // Update the inventory item in the inventory collection
        const inventory = await Inventory.findOneAndUpdate(
            { owner: req.user._id },
            { $pull: { items: id } },
            { new: true }
        ).populate('items', 'name description quantity moveDate origin destination clientEmail');
        if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
        await Inventory.findOneAndUpdate(
            { owner: req.user._id },
            { $push: { items: updatedInventoryItem._id } },
            { new: true }
        ).populate('items', 'name description quantity moveDate origin destination clientEmail');
        res.json(inventory);
    });
    // Delete an existing inventory item
    app.delete('/api/inventory/:id', authenticateUser, async (req, res) => {
      const { id } = req.params;
      try {
        const deletedInventoryItem = await deleteInventoryItem(id, req.user._id);
        if (!deletedInventoryItem) return res.status(404).json({ message: 'Inventory item not found' });
        res.json(deletedInventoryItem);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
      // Delete the inventory item from the inventory collection
      const inventory = await Inventory.findOneAndUpdate(
        { owner: req.user._id },
        { $pull: { items: id } },
        { new: true }
      ).populate('items', 'name description quantity moveDate origin destination clientEmail');
      if (!inventory) return res.status(404
        ).json({ message: 'Inventory not found' });
      res.json(inventory);
    });
    