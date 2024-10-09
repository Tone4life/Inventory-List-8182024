import { validateEmail, validateAddress, validateMoveDate } from './validation.js';
import { estimateMoveCost } from './moveEstimator';
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
         validateMoveDate(formData.moveDate) &&
         validateClientName(formData.clientName);
}

function validateClientName(name) {
  return name.trim() !== '';
}

  // Get selected furniture items from room inventory
  const furnitureItems = [];
  document.querySelectorAll('#roomItems input:checked').forEach((checkbox) => {
    furnitureItems.push(checkbox.value);
  });

  function collectMoveData() {
    const formData = {
      inventorySize: document.getElementById('inventorySize').value,
      distance: calculateDistance(
        document.getElementById('origin').value, 
        document.getElementById('destination').value
      ),
      moveDate: document.getElementById('moveDate').value,
      moveType: document.getElementById('moveType').value // Capture move type from dropdown
    };
  
    return formData;
  }

  document.getElementById('submitForm').addEventListener('click', async function (event) {
  event.preventDefault();

  const formData = collectMoveData();

  // Call the AI-powered estimate function with the collected data
  const estimatedCost = await estimateMoveCost(
    formData.inventorySize,
    formData.distance,
    formData.moveType  // Now passing the move type as an input
  );
  
  // Display the estimate
  document.getElementById('costEstimate').textContent = `Estimated Move Cost: $${estimatedCost.toFixed(2)}`;    
});

document.getElementById('movingForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting


  // Prepare form data to send to backend
  const formData = {
    clientName: document.getElementById('clientName').value,
    clientEmail: document.getElementById('clientEmail').value,
    origin: document.getElementById('origin').value,
    destination: document.getElementById('destination').value,
    moveType: document.getElementById('moveType').value,
    furnitureItems: furnitureItems,  // Array of selected furniture items
  };

  fetch('/submit_form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
}).then(response => response.json())
  .then(data => {
      if (data.cwt) {
          alert(`CWT value calculated: ${data.cwt} CWT`);
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
