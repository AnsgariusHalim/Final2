
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");

    menuToggle.addEventListener("change", function () {
        if (this.checked) {
            sidebar.classList.add("show-sidebar");
        } else {
            sidebar.classList.remove("show-sidebar");
        }
    });
});
