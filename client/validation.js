// Enhanced Email validation with stricter regex
export function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,6}$/i; // Ensure valid domain extensions
    const sanitizedEmail = email.trim().toLowerCase();
    return emailPattern.test(sanitizedEmail) && sanitizedEmail.length <= 255; // Limit to 255 characters (email standard)
}

// Enhanced Name validation
export function validateName(name) {
    const sanitizedName = name.trim().replace(/[<>]/g, "");
    return sanitizedName.length >= 2 && sanitizedName.length <= 100; // Name must be between 2 and 100 characters
}

// Enhanced Address validation
export function validateAddress(address) {
    const sanitizedAddress = address.trim().replace(/[<>]/g, "");
    return sanitizedAddress.length >= 5 && sanitizedAddress.length <= 255; // Addresses should have reasonable length
}

// Enhanced Move date validation
export function validateMoveDate(date) {
    const sanitizedDate = date.trim();
    const moveDate = new Date(sanitizedDate);
    const currentDate = new Date();
    return sanitizedDate !== '' && moveDate > currentDate; // Ensure the date is in the future
}

// Real-Time Validation with enhanced sanitization and checks
export function validateField(field, regex, errorElement, errorMessage) {
    const value = field.val().trim().replace(/[<>]/g, ""); 
    if (!regex.test(value)) {
        errorElement.text(errorMessage);
    } else {
        errorElement.text('');
    }
}

// Enhanced Form Validation
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

// Step Validation with enhanced sanitization
export function validateStep(stepIndex, steps) {
    const currentInputs = steps.eq(stepIndex).find("input");
    let isValid = true;

    currentInputs.each(function() {
        const sanitizedInput = $(this).val().trim().replace(/[<>]/g, "");
        if (!sanitizedInput || sanitizedInput.length < 1) {
            isValid = false;
        }
    });

    return isValid;
}
  