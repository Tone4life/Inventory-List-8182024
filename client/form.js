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

  const formData = {
    clientName: document.getElementById('clientName').value,
    clientEmail: document.getElementById('clientEmail').value,
    origin: document.getElementById('origin').value,
    destination: document.getElementById('destination').value,
    moveType: document.getElementById('moveType').value,
  };

  // Estimate calculation logic (this would be more complex in a real system)
  let estimate = 0;
  if (formData.moveType === 'local') {
    estimate = calculateLocalEstimate(formData);
  } else if (formData.moveType === 'intrastate') {
    estimate = calculateIntrastateEstimate(formData);
  } else if (formData.moveType === 'interstate') {
    estimate = calculateInterstateEstimate(formData);
  }

  // Display pre-estimate to client
  document.getElementById('preEstimateResult').innerText = `Pre-Estimate: $${estimate}`;

  // Optionally, send this data to the backend if they want to confirm and submit
  // submitFormData(formData);
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
