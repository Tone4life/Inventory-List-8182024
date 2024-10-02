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
