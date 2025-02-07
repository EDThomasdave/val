// Add event listeners to the new buttons
document.getElementById('kitchenButton').addEventListener('click', function() {
    logChoice('Kitchen');
});

document.getElementById('preMadeButton').addEventListener('click', function() {
    logChoice('Pre-Made');
});

document.getElementById('noHotelButton').addEventListener('click', function() {
    logChoice('No Hotel');
});

// Function to log the selected choice to the server
function logChoice(choice) {
    fetch(`/log-choice?choice=${choice}`)
        .then(response => response.text())
        .then(data => {
            console.log(data); // Optional: Log the server's response
            window.location.href = `/${choice.toLowerCase()}.html`; // Redirect to the appropriate page
        })
        .catch(error => {
            console.error('Error logging choice:', error);
        });
}
