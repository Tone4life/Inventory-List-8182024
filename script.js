
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

 // Add validation to ensure only the main bedroom is required
const mainBedroomField = document.querySelector("select[name='mainBedroom']");
const form = document.getElementById("inventoryForm");
const emailField = document.getElementById("clientEmail");
const nameField = document.getElementById("clientName");
const phoneField = document.getElementById("clientPhone");
const progressBar = document.querySelector('.progress');

form.addEventListener("submit", function(event) {
    if (mainBedroomField.value === "") {
        alert("Please select an item for the Main Bedroom.");
        event.preventDefault();

phoneField.addEventListener("input", function() {
    const phoneValue = phoneField.value;
    if (!validatePhone(phoneValue)) {
        phoneField.setCustomValidity("Please enter a valid phone number.");
        showInlineError(phoneField, "Please enter a valid phone number.");
    } else {
        phoneField.setCustomValidity("");
        removeInlineError(phoneField);
    }
    updateProgressBar();
});

emailField.addEventListener("input", function() {
    const emailValue = emailField.value;
    if (!validateEmail(emailValue)) {
        emailField.setCustomValidity("Please enter a valid email address.");
        showInlineError(emailField, "Please enter a valid email address.");
    } else {
        emailField.setCustomValidity("");
        removeInlineError(emailField);
    }
    updateProgressBar();
});

nameField.addEventListener("focus", function() {
showTooltip(nameField, "Please enter your full name.");
});

nameField.addEventListener("blur", function() {
hideTooltip(nameField);
updateProgressBar();
});

 function validatePhone(phone) {
        const re = /^[0-9]{10}$/;
        return re.test(String(phone));
    }

function validateEmail(email) {
const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return re.test(String(email).toLowerCase());
}

function showTooltip(element, message) {
let tooltip = document.createElement("span");
tooltip.className = "tooltip-text";
tooltip.innerText = message;
element.parentNode.insertBefore(tooltip, element.nextSibling);
}

function hideTooltip(element) {
const tooltip = element.parentNode.querySelector(".tooltip-text");
if (tooltip) {
    tooltip.remove();
}
}

function showInlineError(element, message) {
    let error = document.createElement("span");
    error.className = "inline-error";
    error.innerText = message;
    element.parentNode.appendChild(error);
}

function removeInlineError(element) {
    const error = element.parentNode.querySelector(".inline-error");
    if (error) {
        error.remove();
    }
}

function updateProgressBar() {
    let completedFields = 0;
    const totalFields = 3; // Update this count if more fields are added

    if (nameField.value.trim() !== "") completedFields++;
    if (emailField.value.trim() !== "" && validateEmail(emailField.value)) completedFields++;
    if (phoneField.value.trim() !== "" && validatePhone(phoneField.value)) completedFields++;
    // Add more fields as needed

    const progressPercentage = (completedFields / totalFields) * 100;
    progressBar.style.width = progressPercentage + "%";
}

  
});
});

function toggleDropdown(id) {
    var dropdown = document.getElementById(id);
    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
}

function addDropdown(roomId) {
    var roomDiv = document.getElementById(roomId);
    var newDropdown = roomDiv.firstElementChild.cloneNode(true);
    roomDiv.insertBefore(newDropdown, roomDiv.lastElementChild);
}