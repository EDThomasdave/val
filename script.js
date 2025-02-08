document.getElementById("yesButton").addEventListener("click", function () {
    window.location.href = "/response?answer=Yes";  // ✅ Works on any domain (localhost or Render)
});

document.getElementById("noButton").addEventListener("click", function () {
    window.location.href = "/response?answer=No";  // ✅ Works on any domain
});
