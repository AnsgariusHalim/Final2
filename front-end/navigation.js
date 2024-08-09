document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const userCheckbox = document.getElementById("userCheckbox");
  const userSidebar = document.getElementById("userSidebar");
  const logoutButton = document.getElementById('logout');

  console.log('Logout Button:', logout);

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

  function updateNavbar(user) {
    const userAvatar = document.getElementById("userAvatar");
    const username = document.getElementById("username");
    const loginButtons = document.querySelector(".navbutton");
    const userProfile = document.querySelector(".userlist");

    if (user.isLoggedIn) {
      username.innerText = user.user.account;
      loginButtons.style.display = 'none';
      userProfile.style.display = 'block';

      if (user.user.profilePicture) {
        if (user.user.profilePicture.includes('http')) {
          userAvatar.src = user.user.profilePicture;
        } else {
          userAvatar.src = `http://localhost:3001/auth/image/${user.user.profilePicture}`;
        }
      } else {
        userAvatar.src = 'pictures/user_avatar.png';
      }

      userAvatar.classList.add("show-userlist");
      username.classList.add("show-username");
    } else {
      userAvatar.src = 'pictures/user_avatar.png';
      userAvatar.classList.remove("show-userlist");
      username.classList.remove("show-username");
      username.innerText = '';
      loginButtons.style.display = 'block';
    }
  }

  fetch('http://localhost:3001/auth/status', {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      updateNavbar(data);
    })
    .catch(error => {
      console.error('Error fetching auth status:', error);
    });

  if (logoutButton) {
    logoutButton.addEventListener('click', function (event) {
      event.preventDefault();
      console.log('Logout button clicked');

      fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          console.log('Logout response:', data);
          if (data.message === 'Logout successful') {
            window.location.href = data.redirectUrl;
          } else {
            console.error('Logout failed:', data.message);
          }
        })
        .catch(error => console.error('Error during logout:', error));
    });
  } else {
    console.error('Logout button not found');
  }
});
