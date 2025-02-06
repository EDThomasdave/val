document.getElementById('reasonText').addEventListener('input', function() {
    var confirmButton = document.getElementById('confirmReasonButton');
    if (this.value.trim() !== '') {
        confirmButton.disabled = false;
    } else {
        confirmButton.disabled = true;
    }
});

document.getElementById('confirmReasonButton').addEventListener('click', function() {
    alert('Thank you for your honesty. I will try to be better!');
});