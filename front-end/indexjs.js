document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const userCheckbox = document.getElementById("userCheckbox");
    const userSidebar = document.getElementById("userSidebar");
    var searchForm = document.getElementById("searchForm");
    var searchInput = document.getElementById("searchInput");
    const itemsPerPage = 8;
    let currentPage = 1;
    let items = [];
    let manageMode = false;
    let storyIndex = 1; // 新增：初始化故事索引

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

    function checkLoginStatus() {
        return true; // 假設用戶已登錄
    }

    if (checkLoginStatus()) {
        document.getElementById("userAvatar").classList.add("show-userlist");
        document.getElementById("username").classList.add("show-username");
        
    }

    function setupDeleteButton(deleteButton) {
        deleteButton.addEventListener('click', function() {
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

        fileInput.addEventListener('change', function() {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newItem = document.createElement('span');
                    newItem.className = 'item';
                    const defaultName = `故事檔案${storyIndex++}`; // 修改：設置默認名稱
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
            document.body.removeChild(fileInput); // 移除 file input
        });

        // 自動觸發文件選擇框
        fileInput.click();
    }

    function renderItems() {
        const container = document.querySelector('.container');
        container.innerHTML = '';
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = items.slice(startIndex, endIndex);
        pageItems.forEach(item => container.appendChild(item));
        updatePageControls();
    }

    function updatePageControls() {
        document.getElementById('currentPage').value = currentPage;
        document.getElementById('prevPageButton').disabled = currentPage === 1;
        document.getElementById('nextPageButton').disabled = items.length <= currentPage * itemsPerPage;
    }

    function toggleManageMode() {
        manageMode = !manageMode;
        document.querySelectorAll('.delete-button').forEach(button => {
            button.style.display = manageMode ? 'block' : 'none';
        });
    }

    document.getElementById('newStoryButton').addEventListener('click', addNewItem);
    document.getElementById('prevPageButton').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderItems();
        }
    });

    document.getElementById('nextPageButton').addEventListener('click', () => {
        if (items.length > currentPage * itemsPerPage) {
            currentPage++;
            renderItems();
        }
    });

    document.getElementById('manageButton').addEventListener('click', toggleManageMode);

    document.querySelectorAll('.delete-button').forEach(setupDeleteButton);

    document.getElementById('searchForm').addEventListener('click', () => {
        const query = document.getElementById('search').value.toLowerCase();
        const container = document.querySelector('.container');
        container.innerHTML = '';
        const filteredItems = items.filter(item => {
            const name = item.querySelector('.image-name').value.toLowerCase();
            return name.includes(query);
        });
        filteredItems.forEach(item => container.appendChild(item));
    });

});
