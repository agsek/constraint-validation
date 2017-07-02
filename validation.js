var valid = {};

valid.init = function(form) {
    if (typeof form.checkValidity === 'function') {
        valid.listeners.submitListener(form); // action on submit
        for (var index = 0; index < form.length; index++) {
            if (form[index].willValidate) {
                valid.listeners.invalidListener(form[index]); // adds listener on invalid
                valid.listeners.blurListener(form[index]); // adds listener on blur
            }
        }
    } else {
        console.error('No support for Constraint Validation API');
    }
}

valid.listeners = {
    submitListener: function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // prevents submitting an invalid form
            if (form.checkValidity()) { // fires 'invalid' event if false
                console.log('can be submitted');
            } else {
                console.log('can\'t be submitted');
            }
        });
    },
    blurListener: function(element) {
        element.addEventListener('blur', function() {
            element.checkValidity(); // fires 'invalid' event if false
        });
    },
    invalidListener: function(element) {
        element.addEventListener('invalid', function(event) {
            event.preventDefault(); // blocks default error tooltips
            valid.methods.setErrorMessage(element); // sets error message
            valid.listeners.inputListener(element); // adds listener on input
        });
    },
    inputListener: function(element) {
        if (element.dataset.inputListenerAttached) {
            return false;
        }
        element.dataset.inputListenerAttached = true;
        element.addEventListener('input', function(event) {
            valid.methods.setErrorMessage(element); // sets error message
        });
    }
};

// This object should be build on a server and sent with form via JSON
valid.messages = {
    valueMissing: 'This field is required',
    first_name: {
        patternMismatch: 'A name can contain only latin and cyrillic letters, spaces, dots and hyphens.'
    },
    last_name: {
        patternMismatch: 'A name can contain only latin and cyrillic letters, spaces, dots and hyphens.'
    },
    email: {
        typeMismatch: 'Please provide an email address in a following format: email@example.com',
        patternMismatch: 'Please provide an email address in a following format: email@example.com'
    },
    password: {
        typeMismatch: 'Password must contain at least one capital letter, one lowercase letter, one number and be at least 8 characters long.',
        patternMismatch: 'Password must contain at least one capital letter, one lowercase letter, one number and be at least 8 characters long.'
    },
    dob: {
        typeMismatch: 'Please provide a date in a following format: YYYY-MM-DD',
        patternMismatch: 'Please provide a date in a following format: YYYY-MM-DD',
        rangeOverflow: 'Selected date is too far away. Please select a date no later than 2017-07-04'
    },
    phone_number: {
        typeMismatch: 'Please provide a phone number in a following format: 123456789',
        patternMismatch: 'Please provide a phone number in a following format: 123456789',
        tooShort: 'Phone number must be at least 9 characters long.',
        tooLong: 'Phone number cannot be longer than 9 characters.'
    },
    height: {
        typeMismatch: 'Please provide a height in meters in a following format: 1.00',
        rangeUnderflow: 'Minimal height value is: 0.10',
        rangeOverflow: 'Maximal height value is: 2.50',
        stepMismatch: 'Please provide a height in meters in a following format: 1.00',
        badInput: 'Please provide a height in meters in a following format: 1.00'
    }
};

valid.methods = {
    setErrorMessage: function(element) {
        element.classList.add('validated');
        element.nextElementSibling.dataset.errorMessage = this.getErrorMessage(element);
    },
    getErrorMessage: function(element) {
        var errorMessage = '';
        for (rule in element.validity) {
            if (element.validity[rule]) {
                if (valid.messages.hasOwnProperty(element.name) 
                    && valid.messages[element.name].hasOwnProperty(rule)) {
                    errorMessage = valid.messages[element.name][rule];
                } else if (valid.messages.hasOwnProperty(rule)) {
                    errorMessage = valid.messages[rule];
                } else {
                    errorMessage = element.validationMessage;
                }
            }
        }

        return errorMessage;
    }
};