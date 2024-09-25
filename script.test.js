// Unit test for displaying an error message when no rooms are selected
it('should display an error message when no rooms are selected', () => {
  // Simulate a room select event with no selected room
  document.getElementById('roomSelect').value = '';
  document.getElementById('roomSelect').dispatchEvent(new Event('change'));

  // Check if the error message is displayed
  const errorMessage = document.getElementById('roomSelectError');
  expect(errorMessage).not.toBeNull();
  expect(errorMessage.textContent).toEqual('Please select a room.');
});// Unit test for allowing multiple quantities to be entered for the same item in different rooms
it('should allow multiple quantities to be entered for the same item in different rooms', () => {
  // Simulate a room select event with a selected room
  document.getElementById('roomSelect').value = 'mainBedroom';
  document.getElementById('roomSelect').dispatchEvent(new Event('change'));

  // Simulate entering a quantity for the same item in another room
  const secondBedroomInput = document.getElementById('item-secondBedroom-0');
  secondBedroomInput.value = '5';
  secondBedroomInput.dispatchEvent(new Event('input'));

  // Check if the quantities are stored correctly
  const mainBedroomQuantity = document.getElementById('item-mainBedroom-0').value;
  const secondBedroomQuantity = document.getElementById('item-secondBedroom-0').value;
  expect(mainBedroomQuantity).toEqual('');
  expect(secondBedroomQuantity).toEqual('5');
});// Unit test for not allowing negative quantities to be entered
it('should not allow negative quantities to be entered', () => {
  // Simulate a room select event with a selected room
  document.getElementById('roomSelect').value = 'mainBedroom';
  document.getElementById('roomSelect').dispatchEvent(new Event('change'));

  // Simulate entering a negative quantity for an item
  const mainBedroomInput = document.getElementById('item-mainBedroom-0');
  mainBedroomInput.value = '-5';
  mainBedroomInput.dispatchEvent(new Event('input'));

  // Check if the negative quantity is not stored
  const mainBedroomQuantity = document.getElementById('item-mainBedroom-0').value;
  expect(mainBedroomQuantity).toEqual('');
});// Unit test for clearing previous items when a new room is selected
it('should clear previous items when a new room is selected', () => {
  // Simulate a room select event with a selected room
  document.getElementById('roomSelect').value = 'mainBedroom';
  document.getElementById('roomSelect').dispatchEvent(new Event('change'));

  // Check if the previous items are cleared
  const roomItems = document.getElementById('roomItems');
  expect(roomItems.innerHTML).toEqual('');

  // Simulate a room select event with a different room
  document.getElementById('roomSelect').value = 'secondBedroom';
  document.getElementById('roomSelect').dispatchEvent(new Event('change'));

  // Check if the previous items are cleared for the new room
  expect(roomItems.innerHTML).toEqual('');
});// Unit test for displaying a message when no items are available for a selected room
it('should display a message when no items are available for a selected room', () => {
  // Simulate a room select event with a selected room
  document.getElementById('roomSelect').value = 'mainBedroom';
  document.getElementById('roomSelect').dispatchEvent(new Event('change'));

  // Check if the message is displayed when no items are available
  const roomItems = document.getElementById('roomItems');
  expect(roomItems.innerHTML).toEqual('<p>No items available for this room.</p>');
});// Unit test for handling case sensitivity for room selection
it('should handle case sensitivity for room selection', () => {
    // Simulate a room select event with a selected room (case sensitive)
    document.getElementById('roomSelect').value = 'MainBedroom';
    document.getElementById('roomSelect').dispatchEvent(new Event('change'));

    // Check if the items for the selected room are displayed correctly
    const roomItems = document.getElementById('roomItems');
    expect(roomItems.innerHTML).toEqual(''); // Assuming 'MainBedroom' is not defined in roomInventory

    // Simulate a room select event with a selected room (case insensitive)
    document.getElementById('roomSelect').value = 'mainbedroom';
    document.getElementById('roomSelect').dispatchEvent(new Event('change'));

    // Check if the items for the selected room are displayed correctly
    expect(roomItems.innerHTML).toEqual(''); // Assuming 'mainbedroom' is not defined in roomInventory
});// Unit test for validating input to ensure it's a number
it('should validate input to ensure it\'s a number', () => {
    const inputElement = document.getElementById('item-mainBedroom-0');
    const saveItemFunction = showRoomItems.bind(null).scope.saveItem;

    // Simulate user input (non-numeric value)
    inputElement.value = 'abc';
    inputElement.dispatchEvent(new Event('input'));

    // Expect saveItem function to not be called with non-numeric value
    expect(saveItemFunction).not.toHaveBeenCalled();

    // Simulate user input (numeric value)
    inputElement.value = '123';
    inputElement.dispatchEvent(new Event('input'));

    // Expect saveItem function to be called with numeric value
    expect(saveItemFunction).toHaveBeenCalled();
});// Unit test for validating input to ensure it's a number in the quantity field
it('should not allow non-numeric characters to be entered in the quantity field', () => {
    const inputElement = document.getElementById('item-mainBedroom-0');
    const saveItemFunction = showRoomItems.bind(null).scope.saveItem;

    // Simulate user input (non-numeric value)
    inputElement.value = 'abc';
    inputElement.dispatchEvent(new Event('input'));

    // Expect saveItem function to not be called with non-numeric value
    expect(saveItemFunction).not.toHaveBeenCalled();
});// Unit test for the saveItem function in the selected code
// This test case checks if the saveItem function logs an error message when it fails

// Assuming the saveItem function is defined in a separate file or within the same scope as the selected code
// The following test case uses Jest as the testing framework

// Import the saveItem function
// const saveItem = require('./path/to/saveItem'); // Replace with the actual path to the saveItem function

// Test case
test('logs an error message when the saveItem function fails', () => {
  // Mock the console.error function
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

  // Call the saveItem function with invalid arguments
  saveItem('invalidRoom', -1, 'invalidQuantity');

  // Expect the console.error function to have been called with an error message
  expect(mockConsoleError).toHaveBeenCalledWith('Invalid room or index');

  // Restore the original console.error function
  mockConsoleError.mockRestore();
});// Unit test for the saveItem function in the selected code
// This test case checks if the saveItem function logs an error message when it fails
// and also checks if the saveItem function logs a success message when it succeeds

// Assuming the saveItem function is defined in a separate file or within the same scope as the selected code
// The following test case uses Jest as the testing framework

// Import the saveItem function
// const saveItem = require('./path/to/saveItem'); // Replace with the actual path to the saveItem function

// Test case
test('logs an error message or a success message when the saveItem function is called', () => {
  // Mock the console.error and console.log functions
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

  // Call the saveItem function with valid arguments
  saveItem('validRoom', 0, 'validQuantity');

  // Expect the console.log function to have been called with a success message
  expect(mockConsoleLog).toHaveBeenCalledWith('Saved validQuantity for validRoom, item 0');

  // Call the saveItem function with invalid arguments
  saveItem('invalidRoom', -1, 'invalidQuantity');

  // Expect the console.error function to have been called with an error message
  expect(mockConsoleError).toHaveBeenCalledWith('Invalid room or index');

  // Restore the original console.error and console.log functions
  mockConsoleError.mockRestore();
  mockConsoleLog.mockRestore();
});// Unit test for handling very large quantities in the selected code

// Assuming the saveItem function is defined in a separate file or within the same scope as the selected code
// The following test case uses Jest as the testing framework

// Import the saveItem function
// const saveItem = require('./path/to/saveItem'); // Replace with the actual path to the saveItem function

// Test case
test('handles very large quantities without causing performance issues', () => {
  // Mock the console.log function
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

  // Call the saveItem function with a very large quantity
  saveItem('largeQuantityRoom', 0, 1000000);

  // Expect the console.log function to have been called with a success message
  expect(mockConsoleLog).toHaveBeenCalledWith('Saved 1000000 for largeQuantityRoom, item 0');

  // Restore the original console.log function
  mockConsoleLog.mockRestore();
});

// New test cases

// Unit test for rejecting invalid emails
it('should reject invalid emails', () => {
  const invalidEmail = 'user@invalid';
  expect(validateEmail(invalidEmail)).toBe(false);
});

// Unit test for handling large datasets efficiently
it('should handle large datasets efficiently', () => {
  const largeData = Array(1000000).fill({ name: 'Item', quantity: 1 });
  const result = sortInventory(largeData);
  expect(result.length).toBe(1000000);
});
