document.getElementById('reasonText').addEventListener('input', function() {
    var confirmButton = document.getElementById('confirmReasonButton');
    confirmButton.disabled = this.value.trim() === '';
});

document.getElementById('confirmReasonButton').addEventListener('click', function() {
    const reason = document.getElementById('reasonText').value.trim();

    if (reason) {
        // Show message instead of redirecting
        const message = document.getElementById('responseMessage');
        message.innerHTML = "Okay, sorry! I'll try better 😔❤️";
        message.style.display = 'block';

        // Send the reason to the server for logging
        fetch(`/log-reason?reason=${encodeURIComponent(reason)}`)
            .then(response => {
                if (response.ok) {
                    console.log("Reason logged successfully");
                } else {
                    console.error("Failed to log reason");
                }
            })
            .catch(err => console.error("Error logging reason:", err));
    }
});
