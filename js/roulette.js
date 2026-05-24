document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const choiceScreen = document.getElementById('choice-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const difficultyBtns = document.querySelectorAll('#choice-screen .difficulty-btn');
    const canvas = document.getElementById('roulette-canvas');
    const ctx = canvas.getContext('2d');
    const video = document.getElementById('result-video');
    const audio = document.getElementById('result-audio');
    const stopBtn = document.getElementById('stop-btn');

    let isSpinning = false;
    let angle = 0;
    let speed = 0;
    let difficulty = 1;
    let greenPercentage = 0.7;

    const difficulties = [
        { green: 0.7, speed: 0.04, name: "Makkelijk" },
        { green: 0.5, speed: 0.08, name: "Iets moeilijker" },
        { green: 0.3, speed: 0.063, name: "Gevorderd" }
    ];

    function drawRoulette() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;

        // Draw wooden background
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, '#8B4513'); // Saddle brown
        gradient.addColorStop(1, '#654321'); // Dark brown
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        const totalSections = 360;
        const greenSections = Math.floor(totalSections * greenPercentage);
        const redSections = totalSections - greenSections;

        for (let i = 0; i < totalSections; i++) {
            const startAngle = (i / totalSections) * 2 * Math.PI + angle;
            const endAngle = ((i + 1) / totalSections) * 2 * Math.PI + angle;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            if (i >= (totalSections - greenSections)) {
                ctx.fillStyle = '#228B22'; // Forest green
            } else {
                ctx.fillStyle = '#B22222'; // Firebrick red
            }
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Add section lines
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        for (let i = 0; i < totalSections; i += 10) { // Every 10 degrees for spokes
            const lineAngle = (i / totalSections) * 2 * Math.PI + angle;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius * Math.cos(lineAngle), centerY + radius * Math.sin(lineAngle));
            ctx.stroke();
        }

        // Pointer - pirate style
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX - 15, centerY - radius - 30);
        ctx.lineTo(centerX + 15, centerY - radius - 30);
        ctx.closePath();
        ctx.fillStyle = '#FFD700'; // Gold
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function spin() {
        if (isSpinning) {
            angle += speed;
            drawRoulette();
            requestAnimationFrame(spin);
        }
    }

    function stopSpin() {
        isSpinning = false;
        // Check where it stopped
        const normalizedAngle = (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const theta = 3 * Math.PI / 2; // Pointer at top (270 degrees)
        const position = ((theta - normalizedAngle) / (2 * Math.PI) + 1) % 1;
        const isGreen = position >= (1 - greenPercentage);

        gameScreen.style.display = 'none';
        resultScreen.style.display = 'flex';

        const resultText = document.getElementById('result-text');
        if (isGreen) {
            resultText.textContent = "Proficiat! Je mag het artefact in je rugzak leggen.";
            video.pause();
            video.currentTime = 0;
            video.src = 'assets/42.mp4';
            audio.pause();
            audio.currentTime = 0;
            audio.src = 'assets/happycat.wav';
        } else {
            resultText.textContent = "Jammer... De beurt gaat naar de volgende speler";
            video.pause();
            video.currentTime = 0;
            video.src = 'assets/Fireball_1_2kres.mp4';
            audio.pause();
            audio.currentTime = 0;
            audio.src = 'assets/sadcat.wav';
        }
        video.load();
        audio.load();
        video.style.display = 'block';
        audio.style.display = 'block';
        video.play();
        audio.play();
    }

    startBtn.addEventListener('click', () => {
        startScreen.style.display = 'none';
        choiceScreen.style.display = 'flex';
    });

    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficulty = parseInt(btn.dataset.difficulty);
            const diff = difficulties[difficulty];
            greenPercentage = diff.green;
            speed = diff.speed;
            document.getElementById('difficulty-text').textContent = `Moeilijkheidsgraad: ${difficulty + 1} (${diff.name})`;
            choiceScreen.style.display = 'none';
            gameScreen.style.display = 'flex';
            angle = 0;
            isSpinning = true;
            spin();
        });
    });

    stopBtn.addEventListener('click', () => {
        if (isSpinning) {
            stopSpin();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && isSpinning) {
            e.preventDefault();
            stopSpin();
        }
    });
});
