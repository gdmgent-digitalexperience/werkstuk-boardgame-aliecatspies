function handleClick(box) {
    box.classList.toggle('clicked');
}

const transmissionBtn = document.getElementById('transmission-btn');
const secretMessage = document.getElementById('secret-message');
const videoOverlay = document.getElementById('video-overlay');
const videoElement = document.getElementById('hidden-video');
const closeVideoBtn = document.getElementById('close-video-btn');
const keywords = ['cats', 'watching', 'alien', 'protocol', 'secret'];
const partyKeywords = ['party', 'pieterjan', 'feest', 'dans', 'muziek', 'music', 'pj', 'dance'];
let recognition = null;
let listeningActive = false;

function requestMicrophonePermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('Microphone permission API niet beschikbaar.');
        return Promise.resolve();
    }

    return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            console.log('Microphone permission granted.');
            stream.getTracks().forEach(track => track.stop());
        })
        .catch(error => {
            console.log('Microphone permission refused:', error);
            throw error;
        });
}

function shouldActivateEasterEgg(transcript) {
    const normalized = transcript.toLowerCase();
    const foundKeywords = keywords.filter(word => normalized.includes(word));
    console.log('Transcript:', transcript, 'Matched cat keywords:', foundKeywords);
    return foundKeywords.length >= 1;
}

function shouldShowPartyVideo(transcript) {
    if (videoOverlay && videoOverlay.classList.contains('visible')) {
        return false;
    }

    const normalized = transcript.toLowerCase();
    const foundPartyKeywords = partyKeywords.filter(word => normalized.includes(word));
    console.log('Transcript:', transcript, 'Matched party keywords:', foundPartyKeywords);
    return foundPartyKeywords.length >= 1;
}

function triggerCatEasterEgg() {
    const body = document.body;
    body.classList.remove('glitch');
    void body.offsetWidth;
    body.classList.add('glitch');
    secretMessage.classList.remove('hidden');
    setTimeout(() => {
        body.classList.remove('glitch');
    }, 1200);
}

function showVideoOverlay() {
    if (!videoOverlay || !videoElement) {
        console.log('Video overlay elements ontbreken.');
        return;
    }

    videoElement.muted = true;
    videoElement.currentTime = 0;
    videoOverlay.classList.remove('hidden');
    videoOverlay.classList.add('visible');

    videoElement.play().catch(error => {
        console.log('Video autoplay blocked or failed:', error);
    });
}

function hideVideoOverlay() {
    if (!videoOverlay || !videoElement) {
        return;
    }

    videoElement.pause();
    videoElement.currentTime = 0;
    videoOverlay.classList.add('hidden');
    videoOverlay.classList.remove('visible');
}

if (videoElement) {
    videoElement.addEventListener('ended', () => {
        console.log('Hidden video ended, closing overlay.');
        hideVideoOverlay();
    });
}

function resetTransmissionUI() {
    transmissionBtn.textContent = 'Start Transmission';
}

function restartRecognition() {
    if (!listeningActive) {
        return;
    }

    if (recognition) {
        try {
            recognition.abort();
        } catch (error) {
            console.log('Recognition abort failed:', error);
        }
        recognition = null;
    }

    setTimeout(() => {
        if (listeningActive) {
            startRecognition();
        }
    }, 500);
}

function startRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Spraakherkenning wordt niet ondersteund in deze browser.');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        console.log('Speech recognition gestart.');
        transmissionBtn.textContent = 'Listening…';
    };

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(' ');

        console.log('Speech result event:', transcript);

        if (shouldShowPartyVideo(transcript)) {
            console.log('Party egg activated.');
            showVideoOverlay();
        } else if (shouldActivateEasterEgg(transcript)) {
            console.log('Cat egg activated.');
            triggerCatEasterEgg();
        }
    };

    recognition.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        restartRecognition();
    };

    recognition.onend = () => {
        console.log('Speech recognition ended. Restarting...');
        restartRecognition();
    };

    recognition.start();
}

function activateBackgroundListening() {
    if (listeningActive) {
        return;
    }

    listeningActive = true;
    transmissionBtn.textContent = 'Listening…';
    requestMicrophonePermission()
        .then(() => startRecognition())
        .catch(error => {
            console.log('Microphone permission error:', error);
            listeningActive = false;
            resetTransmissionUI();
        });
}

if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', hideVideoOverlay);
}

if (videoOverlay) {
    videoOverlay.addEventListener('click', (event) => {
        if (event.target === videoOverlay) {
            hideVideoOverlay();
        }
    });
}

if (transmissionBtn) {
    transmissionBtn.addEventListener('click', activateBackgroundListening);
}

document.body.addEventListener('click', activateBackgroundListening, { once: true });
document.body.addEventListener('touchstart', activateBackgroundListening, { once: true });
