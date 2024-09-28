// Email validation
export function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Name validation
export function validateName(name) {
    return name.trim() !== '';
}

// Address validation
export function validateAddress(address) {
    return address.trim() !== '';
}

// Move date validation
export function validateMoveDate(date) {
    return date.trim() !== '';
}

// Real-Time Validation
export function validateField(field, regex, errorElement, errorMessage) {
    const value = field.val();
    if (!regex.test(value)) {
        errorElement.text(errorMessage);
    } else {
        errorElement.text('');
    }
}

// Form Validation
// Export the validateForm function
export function validateForm(formData) {
    // Function logic...
}

// Step Validation
export function validateStep(stepIndex, steps) {
    const currentInputs = steps.eq(stepIndex).find("input");
    let isValid = true;

    currentInputs.each(function() {
        if (!$(this).val()) {
            isValid = false;
        }
    });

    return isValid;
}
  