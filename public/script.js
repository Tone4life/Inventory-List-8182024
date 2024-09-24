import { validateField, validateForm, validateStep } from './validation.js';
import { addItem, sortInventory } from './inventory.js';
import { toggleTheme, loadUserThemePreference } from './theme.js';

// Initialize Sentry for error tracking
Sentry.init({ dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0' });

// Initialize tooltips and popovers
document.addEventListener("DOMContentLoaded", function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});

// Initialize datepickers and timepickers
$(document).ready(function() {
    $('input[type="date"]').datepicker();
    $('input[type="time"]').timepicker();
});

// Initialize Autocomplete for product search
$(document).ready(function() {
    const searchInput = $('#productSearch');
    const searchSuggestions = $('#searchSuggestions');
    const searchError = $('#search-error');
    const searchIcon = $('#search-icon');
    let searchSuggestionsArray = [];

    fetch('https://api.example.com/products')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                searchSuggestionsArray.push(product.name);
            });
        })
        .catch(error => {
            console.error('Error fetching product suggestions:', error);
            searchError.text('Error fetching product suggestions.');
        });

    searchInput.on('input', function() {
        const searchInputValue = this.value;
        const searchSuggestionsArrayFiltered = searchSuggestionsArray.filter(suggestion =>
            suggestion.toLowerCase().includes(searchInputValue.toLowerCase())
        );
        searchSuggestions.html('');
        searchIcon.removeClass('fa-spinner').addClass('fa-times');
    });

    // Initialize Select2 for dropdowns
    $('select').select2({
        placeholder: "Select an item",
        allowClear: true
    });

    // Initialize Google Places Autocomplete for address fields
    const originField = $('#origin');
    const destinationField = $('#destination');
    new google.maps.places.Autocomplete(originField[0], { types: ['geocode'], componentRestrictions: { country: 'us' } });
    new google.maps.places.Autocomplete(destinationField[0], { types: ['geocode'], componentRestrictions: { country: 'us' } });
    
    // Real-Time Validation
    $('#clientEmail').on('input', function() {
        validateField($(this), /^[^\s@]+@[^\s@]+\.[^\s@]+$/, $('#email-error'), 'Please enter a valid email address.');
    });

    $('#clientPhone').on('input', function() {
        validateField($(this), /^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/, $('#phone-error'), 'Please enter a valid phone number.');
    });

    $('#origin').on('input', function() {
        validateField($(this), /.+/, $('#origin-error'), 'Please enter the origin address.');
    });

    $('#destination').on('input', function() {
        validateField($(this), /.+/, $('#destination-error'), 'Please enter the destination address.');
    });

    $('#moveDate').on('input', function() {
        validateField($(this), /.+/, $('#moveDate-error'), 'Please enter the move date.');
    });

    // Add items dynamically
    addItem('mainBedroom', 'Queen Bed', 1);
    addItem('mainBedroom', 'King Bed', 1);
    addItem('kitchen', 'Refrigerator', 1);
    addItem('livingRoom', 'Sofa', 1);
    addItem('livingRoom', 'Coffee Table', 1);

    // Sort inventory items when the sort option is selected
    $('#sort-dropdown').on('change', function() {
        sortInventory(this.value);
    });

    // Handle form submission
    $('#submitForm').on('click', function(event) {
        event.preventDefault();
        const formData = {
            clientName: $('#clientName').val(),
            origin: $('#origin').val(),
            destination: $('#destination').val(),
            clientEmail: $('#clientEmail').val(),
            moveDate: $('#moveDate').val(),
        };

        if (validateForm(formData)) {
            // Submit form logic goes here
        }
    });

    // Theme toggle functionality
    $('#theme-toggle').on('click', function() {
        toggleTheme();
    });

    // Load user's theme preference on page load
    $(window).on('load', function() {
        loadUserThemePreference();
    });

    // Multi-step form functionality
    let currentStep = 0;
    const steps = $(".step");
    const nextButtons = $(".next-button");
    const prevButtons = $(".previous-button");

    function showStep(stepIndex) {
        steps.each(function(index) {
            $(this).css('display', index === stepIndex ? 'block' : 'none');
        });
    }

    nextButtons.on('click', function() {
        if (validateStep(currentStep, steps)) {
            currentStep++;
            showStep(currentStep);
        }
    });

    prevButtons.on('click', function() {
        currentStep--;
        showStep(currentStep);
    });

    steps.each(function(index) {
        const submitButton = $(this).find("button[type='submit']");
        submitButton.on('click', function(event) {
            if (!validateStep(index, steps)) {
                event.preventDefault();
            }
        });
    });
});