function handleClick(box) {
    box.classList.toggle('clicked');
}

const transmissionBtn = document.getElementById('transmission-btn');
const secretMessage = document.getElementById('secret-message');
const startPhrase = /the cats are watching/i;

function activateTransmission() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Spraakherkenning wordt niet ondersteund in deze browser.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        transmissionBtn.textContent = 'Luisteren…';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript || '';
        if (startPhrase.test(transcript)) {
            alert('ACCESS GRANTED');
            document.body.classList.add('glitch');
            secretMessage.classList.remove('hidden');
        } else {
            alert('TRANSMISSION FAILED');
            transmissionBtn.textContent = 'Start Transmission';
        }
    };

    recognition.onerror = () => {
        alert('Microfoontoegang is nodig om te luisteren.');
        transmissionBtn.textContent = 'Start Transmission';
    };

    recognition.onend = () => {
        transmissionBtn.textContent = 'Start Transmission';
    };

    recognition.start();
}

if (transmissionBtn) {
    transmissionBtn.addEventListener('click', activateTransmission);
}
