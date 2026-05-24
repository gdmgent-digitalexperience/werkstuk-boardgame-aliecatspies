function handleClick(box) {
    box.classList.toggle('clicked');
}

const transmissionBtn = document.getElementById('transmission-btn');
const secretMessage = document.getElementById('secret-message');
const videoOverlay = document.getElementById('video-overlay');
const videoElement = document.getElementById('hidden-video');
const closeVideoBtn = document.getElementById('close-video-btn');
const keywords = ['cats', 'watching', 'alien', 'protocol'];
const partyKeywords = ['feest', 'dans', 'pieterjan', 'party'];
let retryCount = 0;
const maxRetries = 1;

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
    return /the cats are watching/i.test(transcript) || foundKeywords.length >= 1;
}

function shouldShowPartyVideo(transcript) {
    const normalized = transcript.toLowerCase();
    const foundPartyKeywords = partyKeywords.filter(word => normalized.includes(word));
    console.log('Transcript:', transcript, 'Matched party keywords:', foundPartyKeywords);
    return foundPartyKeywords.length >= 1;
}

function showVideoOverlay() {
    if (!videoOverlay || !videoElement) {
        console.log('Video overlay elements ontbreken.');
        return;
    }

    videoElement.muted = true;
    videoElement.currentTime = 0;
    videoElement.play().catch(error => {
        console.log('Video autoplay blocked or failed:', error);
    });

    videoOverlay.classList.remove('hidden');
    videoOverlay.classList.add('visible');
    resetTransmissionUI();
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
    transmissionBtn.disabled = false;
    transmissionBtn.textContent = 'Start Transmission';
}

function startRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Spraakherkenning wordt niet ondersteund in deze browser.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        console.log('Speech recognition gestart.');
        transmissionBtn.textContent = 'Luisteren…';
        transmissionBtn.disabled = true;
    };

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(' ');

        console.log('Speech result event:', transcript);

        if (shouldActivateEasterEgg(transcript)) {
            console.log('Cat egg activated.');
            alert('ACCESS GRANTED');
            document.body.classList.add('glitch');
            secretMessage.classList.remove('hidden');
            retryCount = 0;
        } else if (shouldShowPartyVideo(transcript)) {
            console.log('Party egg activated.');
            showVideoOverlay();
            retryCount = 0;
        } else {
            console.log('Easter egg not activated yet.');
            alert('TRANSMISSION FAILED');
            resetTransmissionUI();
        }
    };

    recognition.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        if (retryCount < maxRetries && event.error !== 'not-allowed' && event.error !== 'service-not-allowed') {
            retryCount += 1;
            transmissionBtn.textContent = 'Listening failed, retrying…';
            console.log('Retrying speech recognition, attempt', retryCount);
            setTimeout(() => {
                startRecognition();
            }, 800);
            return;
        }

        alert('Microfoontoegang is nodig om te luisteren.');
        retryCount = 0;
        resetTransmissionUI();
    };

    recognition.onend = () => {
        console.log('Speech recognition ended.');
        if (retryCount === 0) {
            resetTransmissionUI();
        }
    };

    recognition.start();
}

function activateTransmission() {
    console.log('Activate transmission requested.');
    transmissionBtn.disabled = true;
    requestMicrophonePermission()
        .then(() => startRecognition())
        .catch(error => {
            console.log('Microphone permission error:', error);
            alert('Microfoontoegang is nodig om te luisteren.');
            retryCount = 0;
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
    transmissionBtn.addEventListener('click', activateTransmission);
}
