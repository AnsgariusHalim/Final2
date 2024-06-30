document.addEventListener('DOMContentLoaded', () => {
    // Menu toggle logic
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const userCheckbox = document.getElementById("userCheckbox");
    const userSidebar = document.getElementById("userSidebar");

    if (menuToggle) {
        menuToggle.addEventListener("change", function () {
            if (this.checked) {
                sidebar.classList.add("show-sidebar");
            } else {
                sidebar.classList.remove("show-sidebar");
            }
        });
    }

    if (userCheckbox) {
        userCheckbox.addEventListener("change", function () {
            if (this.checked) {
                userSidebar.classList.add("show-userSidebar");
            } else {
                userSidebar.classList.remove("show-userSidebar");
            }
        });
    }

    // Fetch user data and set placeholders
    fetch('/api/getUserData')
        .then(response => response.json())
        .then(data => {
            document.getElementById('account').placeholder = data.username;
            document.getElementById('name').placeholder = data.lastname;
            document.getElementById('firstname').placeholder = data.firstname;
        })
        .catch(error => console.error('Error fetching user data:', error));

    // Submit button logic
    document.getElementById('submitBtn').addEventListener('click', function() {
        const username = document.getElementById('account').value;
        const lastname = document.getElementById('name').value;
        const firstname = document.getElementById('firstname').value;

        const userData = {
            username: username,
            lastname: lastname,
            firstname: firstname
        };

        fetch('/api/updateUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('修改成功');
            } else {
                alert('修改失敗');
            }
        })
        .catch(error => console.error('Error updating user data:', error));
    });
});
