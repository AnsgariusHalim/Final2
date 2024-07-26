

document.addEventListener('DOMContentLoaded', () => {
const items = document.querySelectorAll('.item');

items.forEach((item) => {
  const heartButton = item.querySelector('button:nth-child(2)');
  const dislikeButton = item.querySelector('button:nth-child(3)');
  const saveButton = item.querySelector('button:nth-child(4)');

  if (heartButton) {
    heartButton.addEventListener('click', () => {
      console.log("click heart"); // Log for debugging
      heartButton.classList.toggle('heart-clicked');
      if (dislikeButton && dislikeButton.classList.contains('heart-clicked')) {
        dislikeButton.classList.remove('heart-clicked');
      }
    });
  } else {
    console.error("Heart button not found in item.");
  }

  if (dislikeButton) {
    dislikeButton.addEventListener('click', () => {
      console.log("click dislike"); // Log for debugging
      dislikeButton.classList.toggle('heart-clicked');
      if (heartButton && heartButton.classList.contains('heart-clicked')) {
        heartButton.classList.remove('heart-clicked');
      }
    });
  } else {
    console.error("Dislike button not found in item.");
  }

  if (saveButton) {
    saveButton.addEventListener('click', () => {
      console.log("click save"); // Log for debugging
      saveButton.classList.toggle('heart-clicked');
    });
  } else {
    console.error("Save button not found in item.");
  }
});
});

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
});
