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
export function validateForm(formData) {
    let isValid = true;
    const fields = [
        { field: 'clientName', regex: /.+/, error: 'Please enter your name.' },
        { field: 'clientEmail', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: 'Please enter a valid email address.' },
        { field: 'origin', regex: /.+/, error: 'Please enter the origin address.' },
        { field: 'destination', regex: /.+/, error: 'Please enter the destination address.' },
        { field: 'moveDate', regex: /.+/, error: 'Please enter the move date.' }
    ];

    fields.forEach(({ field, regex, error }) => {
        const fieldElement = $(`#${field}`);
        const errorElement = $(`#${field}-error`);
        if (!regex.test(fieldElement.val())) {
            errorElement.text(error);
            isValid = false;
        } else {
            errorElement.text('');
        }
    });

    return isValid;
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
  