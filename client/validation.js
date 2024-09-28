// Email validation with sanitization
export function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitizedEmail = email.trim().toLowerCase(); // Sanitize by trimming and converting to lowercase
    return emailPattern.test(sanitizedEmail);
}

// Name validation with sanitization
export function validateName(name) {
    const sanitizedName = name.trim().replace(/[<>]/g, ""); // Sanitize by removing potential HTML tags
    return sanitizedName !== '';
}

// Address validation with sanitization
export function validateAddress(address) {
    const sanitizedAddress = address.trim().replace(/[<>]/g, ""); // Sanitize by removing potential HTML tags
    return sanitizedAddress !== '';
}

// Move date validation with basic sanitization
export function validateMoveDate(date) {
    const sanitizedDate = date.trim();
    return sanitizedDate !== '';
}

// Real-Time Validation with sanitization
export function validateField(field, regex, errorElement, errorMessage) {
    const value = field.val().trim().replace(/[<>]/g, ""); // Sanitize by trimming and escaping HTML characters
    if (!regex.test(value)) {
        errorElement.text(errorMessage);
    } else {
        errorElement.text('');
    }
}

// Form Validation: You can sanitize each form field before validation
export function validateForm(formData) {
    formData.clientName = formData.clientName.trim().replace(/[<>]/g, "");
    formData.origin = formData.origin.trim().replace(/[<>]/g, "");
    formData.destination = formData.destination.trim().replace(/[<>]/g, "");
    formData.clientEmail = formData.clientEmail.trim().toLowerCase();

    return validateEmail(formData.clientEmail) &&
           validateName(formData.clientName) &&
           validateAddress(formData.origin) &&
           validateAddress(formData.destination) &&
           validateMoveDate(formData.moveDate);
}

// Step Validation with sanitization
export function validateStep(stepIndex, steps) {
    const currentInputs = steps.eq(stepIndex).find("input");
    let isValid = true;

    currentInputs.each(function() {
        const sanitizedInput = $(this).val().trim().replace(/[<>]/g, ""); // Sanitize input fields
        if (!sanitizedInput) {
            isValid = false;
        }
    });

    return isValid;
}
  