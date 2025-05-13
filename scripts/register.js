
const testName = (str) => {
    return str.match(/^[a-zA-Z'\s]{1,30}$/);
}

const testEmail = (str) => {
    return str.match(/^[a-z0-9\-_\.']+@(?:\w|\d)+(\.(?:\w|\d)+)?$/);
}

const testPassword = (str) => {
    return str.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^[a-zA-Z0-9'\s]{3,}$/);
}

// used to toggle our validation elements to a success state
const toggleSuccess = (element) => {
    element.textContent = 'Correct';
    element.classList.add('input-success');
    element.classList.remove('input-error');
}

// used to toggle our validation elements to an error state
const toggleError = (element) => {
    element.textContent = 'Error';
    element.classList.add('input-error');
    element.classList.remove('input-success');
}

const validateForm = () => {
    let valid = true;
    $('.validation').hide();
    // validate first name
    if(!testName($('#firstName')[0].value)) {
        const validationDiv = $('#fNameErr')[0];
        toggleError(validationDiv)
        valid = false;
    } else {
        const validationDiv = $('#fNameErr')[0];
        toggleSuccess(validationDiv)
    }
    // validate last name
    if(!testName($('#lastName')[0].value)) {
        const validationDiv = $('#lNameErr')[0];
        toggleError(validationDiv)
        valid = false;
    } else {
        const validationDiv = $('#lNameErr')[0];
        toggleSuccess(validationDiv)
    }
    // validate email
    if (!testEmail($('#email')[0].value)) {
        const validationDiv = $('#emailErr')[0];
        toggleError(validationDiv);
        valid = false;
    } else {
        const validationDiv = $('#emailErr')[0];
        toggleSuccess(validationDiv);
    }
    // validate mobile
    if (!$('#mobile')[0].value || $('#mobile')[0].value.length > 10 || $('#mobile')[0].value.length < 9) {
        const validationDiv = $('#mobileErr')[0];
        toggleError(validationDiv);
        valid = false;
    } else {
        const validationDiv = $('#mobileErr')[0];
        toggleSuccess(validationDiv);
    }
    // validate gender
    if (!$('#male')[0].checked && !$('#female')[0].checked) {
        const validationDiv = $('#genderErr')[0];
        toggleError(validationDiv);
        valid = false;
    } else {
        const validationDiv = $('#genderErr')[0];
        toggleSuccess(validationDiv);
    }
    // validate city
    if (!$('#city')[0].value) {
        const validationDiv = $('#cityErr')[0];
        toggleError(validationDiv);
        valid = false;
    } else {
        const validationDiv = $('#cityErr')[0];
        toggleSuccess(validationDiv);
    }
    // validate state
    if (!$('#state')[0].value) {
        const validationDiv = $('#stateErr')[0];
        toggleError(validationDiv);
        valid = false;
    } else {
        const validationDiv = $('#stateErr')[0];
        toggleSuccess(validationDiv);
    }
    // validate qualification
    if (!$('#qualification')[0].value || $('#qualification')[0].value.length === 0) {
        const validationDiv = $('#qualificationErr')[0];
        toggleError(validationDiv);
        valid = false;
    } else {
        const validationDiv = $('#qualificationErr')[0];
        toggleSuccess(validationDiv);
    }
    // validate password
    if (!testPassword($('#password')[0].value)) {
        const validationDiv = $('#passErr')[0];
        toggleError(validationDiv);
        valid = false;
    } else {
        const validationDiv = $('#passErr')[0];
        toggleSuccess(validationDiv);
    }
    $('.validation').show();
    return valid;
}

const submitForm = (event) => {
    event.preventDefault();
    // clear and hide our server error div
    $('#serverErrors').hide();
    $('#serverErrors')[0].textContent = '';
    // if the form is valid
    if (validateForm()) {
        // serialize our data from the form
        const data = $('#registerForm').serializeArray();

        // send a post request
        $.post('register.php', data, (res) => {
            res = JSON.parse(res);
            // if we get back an array, it is an array of errors. display them using our server error div
            if (Array.isArray(res)) {
                for (const error of res) {
                    $('#serverErrors').append(`<p>${error}</p>`);
                }
                // this just applies styling to indicate errors were received
                $('#serverErrors')[0].classList.add('error');
                $('#serverErrors')[0].classList.remove('success');
            } else { // otherwise it was successful
                $('#serverErrors').append('<p>User created successfully!</p>');
                $('#serverErrors')[0].classList.add('success');
                $('#serverErrors')[0].classList.remove('error');
                $('#registerForm')[0].reset();
            }
            $('#serverErrors').show();
            $('.validation').hide();
        });
    }
}

// add our form submission event listener
$('#registerForm')[0].addEventListener('submit', submitForm, false);
// add a keyup listener for validation on mobile input
$('#mobile')[0].addEventListener('keyup', (event) => {
    if (event.target.value && !event.target.value[event.target.value.length-1].match(/[0-9]/)) {
        event.target.value = event.target.value.slice(0, event.target.value.length - 1);
    }
}, false);
