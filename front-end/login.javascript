function login() {
    const account = document.getElementById('account').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account, password })
    }).then(response => response.json())
        .then(data => {
            if (data.message === 'Login successful') {
                alert(data.message);
                window.location.href = 'index.html'; // Redirect to homepage on successful login
            } else {
                alert(data.message);
            }
        }).catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
}

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});
