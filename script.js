let startTime;
let socialTime = 0;
let webTime = 0;

// List of social media domains (you can add more)
const socialMediaSites = ['facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com'];

// When the page loads, check the current URL
window.addEventListener('load', function () {
    startTime = Date.now();

    // Check if the current page is a social media page
    let currentDomain = window.location.hostname;
    if (isSocialMedia(currentDomain)) {
        socialTime = parseFloat(localStorage.getItem('socialTime')) || 0;
    } else {
        webTime = parseFloat(localStorage.getItem('webTime')) || 0;
    }

    updateDisplay();
});

// When the page is closed or reloaded, save the time spent
window.addEventListener('beforeunload', function () {
    const endTime = Date.now();
    const timeSpent = (endTime - startTime) / 1000; // in seconds

    let currentDomain = window.location.hostname;
    if (isSocialMedia(currentDomain)) {
        socialTime += timeSpent;
        localStorage.setItem('socialTime', socialTime);
    } else {
        webTime += timeSpent;
        localStorage.setItem('webTime', webTime);
    }
});

// Check if a URL is a social media site
function isSocialMedia(domain) {
    return socialMediaSites.some(socialDomain => domain.includes(socialDomain));
}

// Update the displayed times on the page
function updateDisplay() {
    document.getElementById('socialTime').textContent = Math.round(socialTime);
    document.getElementById('webTime').textContent = Math.round(webTime);
}

// Reset times for testing
function resetTimes() {
    socialTime = 0;
    webTime = 0;
    localStorage.setItem('socialTime', 0);
    localStorage.setItem('webTime', 0);
    updateDisplay();
}

// Send notification to user (Browser Notification API)
function sendNotification() {
    if (Notification.permission === 'granted') {
        new Notification(`Social Media Time: ${Math.round(socialTime)} seconds\nWeb Browsing Time: ${Math.round(webTime)} seconds`);
    } else {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(`Social Media Time: ${Math.round(socialTime)} seconds\nWeb Browsing Time: ${Math.round(webTime)} seconds`);
            }
        });
    }
}function sendEmailReport() {
    let templateParams = {
        social_time: Math.round(socialTime),
        web_time: Math.round(webTime),
        user_email: "user@example.com" // Puoi raccogliere questa email dall'utente
    };

    emailjs.send('TUO_SERVICE_ID', 'TUO_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('Email inviata con successo!', response.status, response.text);
        }, function(error) {
            console.log('Errore durante l\'invio dell\'email.', error);
        });
}
