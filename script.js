
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

document.getElementById('inventoryForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    axios.post('submit_form.php', formData)
        .then(response => {
            // Handle success, show a message, etc.
            Swal.fire('Success!', 'Your inventory has been saved!', 'success');
        })
        .catch(error => {
            // Handle error
            Swal.fire('Oops!', 'Something went wrong!', 'error');
        });
});