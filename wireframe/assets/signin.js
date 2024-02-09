document.addEventListener("DOMContentLoaded", function() {
    // Sign In Form
    var signInForm = document.getElementById('signInForm');
    signInForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(signInForm);
        var email = formData.get('email');
        var password = formData.get('password');
        console.log('Email:', email);
        console.log('Password:', password);
        // Implement sign-in here
    });

    // Create Account Modal
    var createAccountModal = document.getElementById('createAccountModal');
    var createAccountButton = document.getElementById('createAccount');
    var closeModalButton = createAccountModal.querySelector('.modal-close');

    if (createAccountButton) {
        createAccountButton.addEventListener('click', function(event) {
            event.preventDefault();
            createAccountModal.classList.add('is-active');
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            createAccountModal.classList.remove('is-active');
        });
    }

    var createAccountForm = document.getElementById('createAccountForm');
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var formData = new FormData(createAccountForm);
            var newEmail = formData.get('newEmail');
            var newPassword = formData.get('newPassword');
            console.log('New Email:', newEmail);
            console.log('New Password:', newPassword);
            // Implement create account logic here

            
            // Close the modal after account creation
            createAccountModal.classList.remove('is-active');
        });
    }
});

