document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerBtn').addEventListener('click', function() {
        const lastname = document.getElementById('name').value;
        const firstname = document.getElementById('firstname').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('account').value;
        const password = document.getElementById('password').value;
        const cpassword = document.getElementById('cpassword').value;

        if (password !== cpassword) {
            alert('兩次輸入的密碼不一致');
            return;
        }

        const userData = {
            lastname: lastname,
            firstname: firstname,
            email: email,
            username: username,
            password: password
        };

        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('註冊成功');
                window.location.href = 'index.html'; // 重定向到主页
            } else {
                alert('註冊失敗');
            }
        })
        .catch(error => console.error('Error registering user:', error));
    });
});
