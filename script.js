
document.addEventListener("DOMContentLoaded", function() {
const form = document.getElementById("inventoryForm");
const emailField = document.getElementById("clientEmail");
const nameField = document.getElementById("clientName");
const phoneField = document.getElementById("clientPhone");
const progressBar = document.querySelector('.progress');

phoneField.addEventListener("input", function() {
    const phoneValue = phoneField.value;
    if (!validatePhone(phoneValue)) {
        phoneField.setCustomValidity("Please enter a valid phone number.");
    } else {
        phoneField.setCustomValidity("");
    }
    updateProgressBar();
});

emailField.addEventListener("input", function() {
const emailValue = emailField.value;
if (!validateEmail(emailValue)) {
    emailField.setCustomValidity("Please enter a valid email address.");
} else {
    emailField.setCustomValidity("");
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

function updateProgressBar() {
    let completedFields = 0;
    const totalFields = 4; // Adjusted to account for the phone field

    if (nameField.value.trim() !== "") completedFields++;
    if (emailField.value.trim() !== "" && validateEmail(emailField.value)) completedFields++;
    if (phoneField.value.trim() !== "" && validatePhone(phoneField.value)) completedFields++;
    // Add more fields as needed

    const progressPercentage = (completedFields / totalFields) * 100;
    progressBar.style.width = progressPercentage + "%";
}
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