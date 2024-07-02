document.addEventListener('DOMContentLoaded', () => {
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

    // Assume a function checkLoginStatus() that returns true if the user is logged in
        function checkLoginStatus() {
            // This is a placeholder. Replace it with your actual login check logic.
            return true; // Set to true for demonstration purposes
        }

        if (checkLoginStatus()=true) {
            // Hide login and registration buttons
            document.getElementById("loginButton").classList.add("hide");
            document.getElementById("registerButton").classList.add("hide");
            
            // Show user avatar and username
            document.getElementById("userAvatar").classList.add("show-userlist");
            document.getElementById("username").classList.add("show-username");
        }

});

    