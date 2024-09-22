// utils/validateInventoryItem.js
export const validateInventoryItem = (itemData) => {
  const errors = [];

  if (!itemData.name || typeof itemData.name !== 'string' || itemData.name.trim().length === 0) {
    errors.push('Item name is required and must be a valid string.');
  }

  if (!itemData.quantity || typeof itemData.quantity !== 'number' || itemData.quantity <= 0) {
    errors.push('Quantity must be a positive number.');
  }

  if (!itemData.moveDate || Number.isNaN(Date.parse(itemData.moveDate))) {
    errors.push('Move date must be a valid date.');
  }

  if (!itemData.origin || typeof itemData.origin !== 'string') {
    errors.push('Origin address is required.');
  }

  if (!itemData.destination || typeof itemData.destination !== 'string') {
    errors.push('Destination address is required.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return { isValid: true };
};
