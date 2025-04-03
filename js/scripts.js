document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem("user")) {
        window.location.href = "index.html";
    }
});
