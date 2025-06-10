document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = '<div class="loading-heart">❤️</div>';
    document.body.appendChild(loadingScreen);

    // Hide loading screen after 2 seconds
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.remove(), 500);
    }, 2000);

    // Create background shapes
    const backgroundShapes = document.createElement('div');
    backgroundShapes.className = 'background-shapes';
    document.body.appendChild(backgroundShapes);

    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.style.width = Math.random() * 100 + 50 + 'px';
        shape.style.height = shape.style.width;
        shape.style.left = Math.random() * 100 + 'vw';
        shape.style.top = Math.random() * 100 + 'vh';
        shape.style.animationDelay = Math.random() * 5 + 's';
        backgroundShapes.appendChild(shape);
    }

    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const container = document.querySelector('.container');
    const floatingHearts = document.querySelector('.floating-hearts');

    // Create floating hearts
    function createFloatingHearts() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'floating-heart';
        heart.style.left = Math.random() * 100 + 'vw';
        floatingHearts.appendChild(heart);

        // Remove heart after animation
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    // Create 3D rotating hearts
    function createRotatingHearts() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'rotating-heart';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 10000);
    }

    // Create hearts periodically
    setInterval(createFloatingHearts, 300);
    setInterval(createRotatingHearts, 2000);

    // Romantic messages
    const messages = [
        "Seninle geçirdiğim her an çok değerli...",
        "Sen benim hayatımın en güzel hediyesisin...",
        "Seninle her gün yeniden aşık oluyorum...",
        "Sen benim en güzel şansımsın...",
        "Seninle her şey daha güzel...",
        "Sen benim en büyük mutluluğumsun...",
        "Seninle her anım çok özel...",
        "Sen benim en değerli varlığımsın..."
    ];

    let currentMessageIndex = 0;

    function showNextMessage() {
        const messageContainer = document.querySelector('.message-slider');
        if (messageContainer) {
            const message = document.createElement('div');
            message.className = 'message-slide';
            message.textContent = messages[currentMessageIndex];
            messageContainer.appendChild(message);

            // Remove old messages
            const oldMessages = messageContainer.querySelectorAll('.message-slide');
            if (oldMessages.length > 3) {
                oldMessages[0].remove();
            }

            currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        }
    }

    yesBtn.addEventListener('click', () => {
        yesBtn.style.transform = 'scale(1.5)';
        yesBtn.style.background = '#2ed573';
        
        // Create success message with animation and GIF
        container.innerHTML = `
            <div class="success-message">
                <div class="heart">❤️</div>
                <h1>Teşekkür Ederim!</h1>
                <p>Seni çok seviyorum! Seninle geçirdiğim her an için çok mutluyum.</p>
                <p>Sen benim hayatımın en güzel hediyesisin.</p>
                <div class="gif-container">
                    <img src="https://media.tenor.com/nisaHYy8yAYAAAAM/besito-catlove.gif" alt="Love Cats" class="love-gif">
                </div>
                <div class="message-slider"></div>
            </div>
        `;

        // Start showing messages
        showNextMessage();
        setInterval(showNextMessage, 3000);

        // Create more hearts on success
        for(let i = 0; i < 15; i++) {
            setTimeout(createFloatingHearts, i * 150);
        }

        // Add confetti effect
        createConfetti();
    });

    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 100) + 50;
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 100) + 50;
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        noBtn.style.transition = 'all 0.3s ease';
    });

    // Add touch support for mobile
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 100) + 50;
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 100) + 50;
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
    });

    // Confetti effect
    function createConfetti() {
        const colors = ['#ff4757', '#ff6b6b', '#ff8e8e', '#ffa5a5', '#ffc0cb'];
        
        for(let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(confetti);

            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }
});
