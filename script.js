document.getElementById("yesButton").addEventListener("click", function () {
    window.location.href = "http://localhost:3000/response?answer=Yes";
});

document.getElementById("noButton").addEventListener("click", function () {
    window.location.href = "http://localhost:3000/response?answer=No";
});
