document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const userCheckbox = document.getElementById("userCheckbox");
    const userSidebar = document.getElementById("userSidebar");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const submitCommentButton = document.getElementById('submitComment');
    const commentInput = document.getElementById('commentInput');
    const commentsDiv = document.getElementById('comments');

    const username = "用户名称"; // 假设用户名从某处获取，例如从服务器

    console.log("Document is ready");

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

    if (submitCommentButton) {
        submitCommentButton.addEventListener('click', function () {
            console.log("Submit button clicked");
            const commentText = commentInput.value.trim();
            if (commentText) {
                console.log("Comment text:", commentText);
                const currentTime = new Date();
                const formattedTime = currentTime.getFullYear() + '-' +
                    (currentTime.getMonth() + 1).toString().padStart(2, '0') + '-' +
                    currentTime.getDate().toString().padStart(2, '0') + ' ' +
                    currentTime.getHours().toString().padStart(2, '0') + ':' +
                    currentTime.getMinutes().toString().padStart(2, '0') + ':' +
                    currentTime.getSeconds().toString().padStart(2, '0');

                const commentHTML = `
                    <div class="comment">
                        <div class="meta">${username} - ${formattedTime}</div>
                        <div class="text">${commentText}</div>
                    </div>
                `;

                commentsDiv.innerHTML += commentHTML;
                commentInput.value = ''; // 清空输入框
            }
        });
    }
});

