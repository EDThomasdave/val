document.getElementById('reasonText').addEventListener('input', function() {
    var confirmButton = document.getElementById('confirmReasonButton');
    if (this.value.trim() !== '') {
        confirmButton.disabled = false;
    } else {
        confirmButton.disabled = true;
    }
});

document.getElementById('confirmReasonButton').addEventListener('click', function() {
    const reason = document.getElementById('reasonText').value.trim();
    
    if (reason) {
        // Redirect and pass the reason to the server
        window.location.href = `http://localhost:3000/response?answer=No&reason=${encodeURIComponent(reason)}`;
    }
});
