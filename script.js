
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