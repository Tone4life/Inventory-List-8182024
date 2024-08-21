
document.addEventListener("DOMContentLoaded", function() {
    // Initialize Select2 for all dropdowns
    $('select').select2({
        placeholder: "Select an item",
        allowClear: true
    });

    // Initialize Google Places Autocomplete for address fields
    const originField = document.getElementById('origin');
    const destinationField = document.getElementById('destination');

    const autocompleteOrigin = new google.maps.places.Autocomplete(originField, {
        types: ['geocode'],
        componentRestrictions: { country: "us" } // Adjust country code as needed
    });

    const autocompleteDestination = new google.maps.places.Autocomplete(destinationField, { 
        types: ['geocode'],
        componentRestrictions: { country: "us" } // Adjust country code as needed
    });
});

const express = require('express'); 
const helmet = require('helmet');

const app = express();

// Set up Helmet with a custom CSP configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true, // Apply default directives
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://apis.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        // Add more directives as needed
      },
    },
  })
);

// Serve your static files and handle routes
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});