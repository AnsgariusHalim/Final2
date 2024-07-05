document.addEventListener('DOMContentLoaded', () => {
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const surnameInput = document.getElementById('surname');
    const firstnameInput = document.getElementById('firstname');
    const emailInput = document.getElementById('email');
    const accountInput = document.getElementById('account');
    const passwordInput = document.getElementById('password');
    const cpasswordInput = document.getElementById('cpassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleCPassword = document.getElementById('toggleCPassword');

    const warnings = {
        surname: document.getElementById('surname-warning'),
        firstname: document.getElementById('firstname-warning'),
        email: document.getElementById('email-warning'),
        account: document.getElementById('account-warning'),
        password: document.getElementById('password-warning'),
        cpassword: document.getElementById('cpassword-warning')
    };

    surnameInput.addEventListener('input', () => {
        surnameInput.value = capitalizeFirstLetter(surnameInput.value);
    });

    firstnameInput.addEventListener('input', () => {
        firstnameInput.value = capitalizeFirstLetter(firstnameInput.value);
    });

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const validateUsername = (username) => {
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/;
        return re.test(String(username));
    };

    const validatePassword = (password) => {
        const re = /^(?=.*[A-Z])(?=.*\d.*\d)[A-Za-z\d]{1,}$/;
        return re.test(password);
    };

    const showWarning = (input, message) => {
        warnings[input].innerText = message;
        warnings[input].style.display = 'block';
    };

    const hideWarning = (input) => {
        warnings[input].innerText = '';
        warnings[input].style.display = 'none';
    };

    emailInput.addEventListener('blur', async () => {
        hideWarning('email');
        if (!validateEmail(emailInput.value)) {
            showWarning('email', 'Invalid email format');
            return;
        }
        const emailExists = await checkExisting('email', emailInput.value);
        if (emailExists) {
            showWarning('email', 'This email already exists');
        }
    });

    accountInput.addEventListener('blur', async () => {
        hideWarning('account');
        if (!validateUsername(accountInput.value)) {
            showWarning('account', 'Username must contain letters and numbers');
            return;
        }
        const accountExists = await checkExisting('account', accountInput.value);
        if (accountExists) {
            showWarning('account', 'This username already exists');
        }
    });

    passwordInput.addEventListener('input', () => {
        hideWarning('password');
        if (!validatePassword(passwordInput.value)) {
            showWarning('password', 'Password must contain at least 1 capital letter and 2 numbers');
        } else {
            hideWarning('password');
        }
    });

    cpasswordInput.addEventListener('input', () => {
        hideWarning('cpassword');
        if (passwordInput.value !== cpasswordInput.value) {
            showWarning('cpassword', 'Passwords do not match');
        } else {
            hideWarning('cpassword');
        }
    });

    cpasswordInput.addEventListener('blur', () => {
        if (passwordInput.value !== cpasswordInput.value) {
            showWarning('cpassword', 'Passwords do not match');
        } else {
            hideWarning('cpassword');
        }
    });

    const checkExisting = async (field, value) => {
        try {
            const response = await fetch(`http://localhost:3001/check-existence`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ field, value })
            });
            const result = await response.json();
            return result.exists;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    document.getElementById('registerBtn').addEventListener('click', async () => {
        const surname = surnameInput.value;
        const firstname = firstnameInput.value;
        const email = emailInput.value;
        const account = accountInput.value;
        const password = passwordInput.value;
        const cpassword = cpasswordInput.value;

        if (!validatePassword(password)) {
            showWarning('password', 'Password must contain at least 1 capital letter and 2 numbers');
            return;
        }

        if (password !== cpassword) {
            showWarning('password', 'Passwords do not match');
            showWarning('cpassword', 'Passwords do not match');
            return;
        }

        hideWarning('password');
        hideWarning('cpassword');

        const userData = { surname, firstname, email, account, password };

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                window.location.href = 'index.html'; // Redirect to homepage
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    toggleCPassword.addEventListener('click', () => {
        const type = cpasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        cpasswordInput.setAttribute('type', type);
        toggleCPassword.classList.toggle('fa-eye');
        toggleCPassword.classList.toggle('fa-eye-slash');
    });
});
