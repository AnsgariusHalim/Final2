document.addEventListener('DOMContentLoaded', () => {
    const accountInput = document.getElementById('account');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');

    // Show or hide password
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Validate credentials and login
    loginBtn.addEventListener('click', async () => {
        const account = accountInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ account, password })
            });

            const result = await response.json();

            if (response.ok) {
                window.location.href = 'index.html'; // Redirect to homepage on successful login
            } else {
                alert(result.message); // Show error message
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    // Google Sign-In
    document.getElementById('google-signin').addEventListener('click', () => {
        window.location.href = 'http://localhost:3001/auth/google';
    });
});
