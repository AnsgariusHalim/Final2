document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const userCheckbox = document.getElementById("userCheckbox");
    const userSidebar = document.getElementById("userSidebar");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const itemsPerPage = 8;
    let currentPage = 1;
    let items = [];
    let manageMode = false;
    let storyIndex = 1;

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
        const navbutton = document.querySelector(".navbutton");

        if (user.isLoggedIn) {
            if (userAvatar) {
                userAvatar.src = user.profilePicture
                    ? user.profilePicture
                    : 'pictures/user_avatar.png';
                userAvatar.classList.add("show-userlist");
            }

            if (username) {
                username.innerText = user.username;
                username.classList.add("show-username");
            }

            if (navbutton) {
                navbutton.classList.add("hidden");
            }
        } else {
            if (userAvatar) {
                userAvatar.classList.remove("show-userlist");
            }

            if (username) {
                username.classList.remove("show-username");
            }

            if (navbutton) {
                navbutton.classList.remove("hidden");
            }
        }
    }

    fetch('http://localhost:3001/auth/status', {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the response to debug
            updateNavbar(data);
        })
        .catch(error => {
            console.error('Error fetching auth status:', error);
        });

    function setupDeleteButton(deleteButton) {
        deleteButton.addEventListener('click', function () {
            const item = deleteButton.closest('.item');
            if (item) {
                items = items.filter(i => i !== item);
                renderItems();
            }
        });
    }

    function addNewItem() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', function () {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const newItem = document.createElement('span');
                    newItem.className = 'item';
                    const defaultName = `故事檔案${storyIndex++}`;
                    newItem.innerHTML = `
                        <div class="item-header">
                            <input type="text" class="image-name" placeholder="輸入圖片名稱" value="${defaultName}">
                        </div>
                        <button type="button" class="like"><img src="pictures/like.png" alt="Like"></button>
                        <button type="button" class="dislike"><img src="pictures/dislike.png" alt="Dislike"></button>
                        <div class="image-container"><img src="${e.target.result}" alt="User Image"></div>
                        <button class="delete-button"><img src="pictures/trash.png" alt="Delete" style="width: 40px; height: 40px;"></button>
                    `;
                    setupDeleteButton(newItem.querySelector('.delete-button'));
                    items.push(newItem);
                    renderItems();
                }
                reader.readAsDataURL(file);
            }
            document.body.removeChild(fileInput);
        });

        fileInput.click();
    }

    function renderItems() {
        const container = document.querySelector('.container');
        if (!container) return;
        container.innerHTML = '';
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = items.slice(startIndex, endIndex);
        pageItems.forEach(item => container.appendChild(item));
        updatePageControls();
    }

    function updatePageControls() {
        const currentPageInput = document.getElementById('currentPage');
        const prevPageButton = document.getElementById('prevPageButton');
        const nextPageButton = document.getElementById('nextPageButton');

        if (currentPageInput) currentPageInput.value = currentPage;
        if (prevPageButton) prevPageButton.disabled = currentPage === 1;
        if (nextPageButton) nextPageButton.disabled = items.length <= currentPage * itemsPerPage;
    }

    function toggleManageMode() {
        manageMode = !manageMode;
        document.querySelectorAll('.delete-button').forEach(button => {
            button.style.display = manageMode ? 'block' : 'none';
        });
    }

    const newStoryButton = document.getElementById('newStoryButton');
    const prevPageButton = document.getElementById('prevPageButton');
    const nextPageButton = document.getElementById('nextPageButton');
    const manageButton = document.getElementById('manageButton');

    if (newStoryButton) newStoryButton.addEventListener('click', addNewItem);
    if (prevPageButton) prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderItems();
        }
    });

    if (nextPageButton) nextPageButton.addEventListener('click', () => {
        if (items.length > currentPage * itemsPerPage) {
            currentPage++;
            renderItems();
        }
    });

    if (manageButton) manageButton.addEventListener('click', toggleManageMode);

    document.querySelectorAll('.delete-button').forEach(setupDeleteButton);

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = searchInput.value.toLowerCase();
            const container = document.querySelector('.container');
            if (!container) return;
            container.innerHTML = '';
            const filteredItems = items.filter(item => {
                const name = item.querySelector('.image-name').value.toLowerCase();
                return name.includes(query);
            });
            filteredItems.forEach(item => container.appendChild(item));
        });
    }

    const itemElements = document.querySelectorAll('.item');

    itemElements.forEach((item) => {
        const heartButton = item.querySelector('button:nth-child(2)');
        const dislikeButton = item.querySelector('button:nth-child(3)');
        const saveButton = item.querySelector('button:nth-child(4)');

        if (heartButton) {
            heartButton.addEventListener('click', () => {
                heartButton.classList.toggle('heart-clicked');
                if (dislikeButton && dislikeButton.classList.contains('heart-clicked')) {
                    dislikeButton.classList.remove('heart-clicked');
                }
            });
        }

        if (dislikeButton) {
            dislikeButton.addEventListener('click', () => {
                dislikeButton.classList.toggle('heart-clicked');
                if (heartButton && heartButton.classList.contains('heart-clicked')) {
                    heartButton.classList.remove('heart-clicked');
                }
            });
        }

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                saveButton.classList.toggle('heart-clicked');
            });
        }
    });
});
