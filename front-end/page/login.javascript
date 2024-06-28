            function login() {
                const account = document.getElementById('account').value;
                const password = document.getElementById('password').value;

                // Mock API call for demonstration
                fetch('login_api_endpoint', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ account, password }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('登入成功');
                        window.location.href = 'index.html';
                        localStorage.setItem('loggedIn', 'true');
                    } else {
                        alert('登入失敗: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('登入失敗: 無法連接到伺服器');
                });
            }