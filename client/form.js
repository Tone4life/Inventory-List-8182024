import { validateEmail, validateAddress, validateMoveDate } from './validation.js';

export function handleFormSubmission() {
  const formData = {
    clientName: document.getElementById('clientName').value,
    origin: document.getElementById('origin').value,
    destination: document.getElementById('destination').value,
    clientEmail: document.getElementById('clientEmail').value,
    moveDate: document.getElementById('moveDate').value,
  };

  if (validateForm(formData)) {
    // Process form
    alert('Form submitted successfully!');
  } else {
    alert('Form validation failed. Please check your inputs.');
  }
}

function validateForm(formData) {
  return validateEmail(formData.clientEmail) &&
         validateAddress(formData.origin) &&
         validateAddress(formData.destination) &&
         validateMoveDate(formData.moveDate);
}

document.getElementById('movingForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get selected furniture items from room inventory
  const furnitureItems = [];
  document.querySelectorAll('#roomItems input:checked').forEach((checkbox) => {
    furnitureItems.push(checkbox.value);
  });

  // Get rate per CWT from the input field
  const ratePerCwt = parseFloat(document.getElementById('ratePerCwt').value);

  // Prepare form data to send to backend
  const formData = {
    clientName: document.getElementById('clientName').value,
    clientEmail: document.getElementById('clientEmail').value,
    origin: document.getElementById('origin').value,
    destination: document.getElementById('destination').value,
    moveType: document.getElementById('moveType').value,
    furnitureItems: furnitureItems,  // Array of selected furniture items
    ratePerCwt: ratePerCwt,  // User-defined rate per CWT
  };

  fetch('/submit_form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  }).then(response => response.json())
    .then(data => {
      if (data.estimatedCost) {
        document.getElementById('preEstimateResult').innerText = `Estimated Cost: $${data.estimatedCost}`;
      } else {
        alert('Error: ' + (data.error || 'An error occurred'));
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

// Example estimate functions
function calculateLocalEstimate(data) {
  // Simplified example: calculate based on a flat hourly rate
  return 100; // Placeholder estimate
}

function calculateIntrastateEstimate(data) {
  // Example: use a mix of hourly rate and distance
  return 200; // Placeholder estimate
}

function calculateInterstateEstimate(data) {
  // Example: use Google Maps API to calculate distance-based costs
  return 300; // Placeholder estimate
}
