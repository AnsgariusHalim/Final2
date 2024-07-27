document.addEventListener("DOMContentLoaded", function() {
    const storyList = document.getElementById("storyList");
    const noRecords = document.getElementById("noRecords");
    const selectModeToggle = document.getElementById("selectModeToggle");
    const selectionBar = document.getElementById("selectionBar");
    const selectionCount = document.getElementById("selectionCount");
    const deselectAll = document.getElementById("deselectAll");
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

    // 假数据
    const userStories = [
        { id: 1, title: "Story 1", description: "This is the first story", imageUrl: "https://via.placeholder.com/150", likes: 5, date: "2023-07-13" },
        { id: 2, title: "Story 2", description: "This is the second story", imageUrl: "https://via.placeholder.com/150", likes: 10, date: "2023-07-12" },
        { id: 3, title: "Story 3", description: "This is the third story", imageUrl: "https://via.placeholder.com/150", likes: 3, date: "2023-07-11" },
        { id: 4, title: "Story 4", description: "This is the fourth story", imageUrl: "https://via.placeholder.com/150", likes: 8, date: "2023-07-10" }
    ];

    let selectMode = false;
    let selectedCount = 0;
    let selectedStories = [];

    function renderStories(stories) {
        storyList.innerHTML = '';
        stories.forEach(story => {
            const listItem = document.createElement("div");
            listItem.className = "story-item";
            listItem.innerHTML = `
                <img src="${story.imageUrl}" alt="${story.title}">
                <h2>${story.title}</h2>

                <div class="select-circle"></div>
            `;
            listItem.addEventListener('click', () => {
                if (selectMode) {
                    listItem.classList.toggle('selected');
                    if (listItem.classList.contains('selected')) {
                        selectedCount++;
                        selectedStories.push(story.id);
                    } else {
                        selectedCount--;
                        selectedStories = selectedStories.filter(id => id !== story.id);
                    }
                    updateSelectionCount();
                }
            });
            storyList.appendChild(listItem);
        });
    }

    function updateSelectionCount() {
        selectionCount.textContent = `已選擇 ${selectedCount} 個`;
        if (selectedCount > 0) {
            deselectAll.style.display = 'inline-block';
        } else {
            deselectAll.style.display = 'none';
        }
    }

    function toggleSelectMode() {
        selectMode = !selectMode;
        document.querySelectorAll('.story-item .select-circle').forEach(circle => {
            circle.style.display = selectMode ? 'flex' : 'none';
        });
        selectionBar.style.display = selectMode ? 'flex' : 'none';
        selectedCount = 0;
        selectedStories = [];
        updateSelectionCount();
         // 更新选取按钮文本
         selectModeToggle.textContent = selectMode ? '取消' : '選取';

         // 更新排序按钮颜色

        
     }
 
    function sortStoriesNewest() {
        const sortedStories = userStories.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        renderStories(sortedStories);
    }

    function sortStoriesOldest() {
        const sortedStories = userStories.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        renderStories(sortedStories);
    }

    selectModeToggle.addEventListener('click', toggleSelectMode);
    document.getElementById('sortNewest').addEventListener('click', sortStoriesNewest);
    document.getElementById('sortOldest').addEventListener('click', sortStoriesOldest);
    deselectAll.addEventListener('click', () => {
        userStories.forEach((story, index) => {
            if (selectedStories.includes(story.id)) {
                userStories.splice(index, 1);
            }
        });
        selectedCount = 0;
        selectedStories = [];
        updateSelectionCount();
        sortStoriesNewest(); // 重新渲染列表
        toggleSelectMode(); // 退出选择模式
    });

    if (userStories.length > 0) {
        sortStoriesNewest(); // 初始按最新排序
    } else {
        noRecords.style.display = "block";
    }
});
