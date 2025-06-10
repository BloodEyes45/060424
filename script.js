const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const celebration = document.getElementById('celebration');
const container = document.querySelector('.container');
const themeSwitch = document.querySelector('.theme-switch');
const musicToggle = document.getElementById('musicToggle');
const typingText = document.querySelector('.typing-text');
const counterBtn = document.querySelector('.counter-btn');
const counterNumber = document.querySelector('.counter-number');
const musicItems = document.querySelectorAll('.music-item');
let yesBtnSize = 1;
let noBtnClicks = 0;
let isYesClicked = false;
let isMusicPlaying = false;
let audio = null;
let loveCount = 0;

// Şarkı listesi
const songs = {
    song1: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    song2: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    song3: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
};

// Tema değiştirme
themeSwitch.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeSwitch.innerHTML = document.body.dataset.theme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
});

// Müzik kontrolü
function initAudio(songUrl) {
    if (audio) {
        audio.pause();
    }
    audio = new Audio(songUrl);
    audio.volume = 0.5;
    audio.loop = true;
}

musicToggle.addEventListener('click', () => {
    if (!audio) {
        initAudio(songs.song1);
    }
    
    if (isMusicPlaying) {
        audio.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        audio.play();
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isMusicPlaying = !isMusicPlaying;
});

// Şarkı seçimi
musicItems.forEach(item => {
    item.addEventListener('click', () => {
        const songUrl = songs[item.dataset.song];
        initAudio(songUrl);
        audio.play();
        isMusicPlaying = true;
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    });
});

// Aşk sayacı
counterBtn.addEventListener('click', () => {
    loveCount++;
    counterNumber.textContent = loveCount;
    
    // Sayaç animasyonu
    counterNumber.style.transform = 'scale(1.2)';
    setTimeout(() => {
        counterNumber.style.transform = 'scale(1)';
    }, 200);
    
    // Kalp efekti
    createHeart(counterBtn);
});

function createHeart(element) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = element.getBoundingClientRect().left + 'px';
    heart.style.top = element.getBoundingClientRect().top + 'px';
    heart.style.fontSize = '20px';
    heart.style.animation = 'float 2s linear forwards';
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// Yazı animasyonu
function typeText(text, element, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Arka plan kalplerini oluştur
function createBackgroundHearts() {
    const body = document.body;
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.opacity = Math.random() * 0.5 + 0.1;
        heart.style.animation = `float ${Math.random() * 3 + 2}s linear infinite`;
        heart.style.animationDelay = Math.random() * 2 + 's';
        body.appendChild(heart);
    }
}

// Evet butonuna tıklandığında
yesBtn.addEventListener('click', function() {
    // Kutlama ekranını göster
    celebration.style.display = 'block';
    celebration.classList.remove('hidden');
    
    // Butonları gizle
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';
    
    // Kalpleri oluştur
    const heartsContainer = document.querySelector('.hearts');
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heartsContainer.appendChild(heart);
    }
});

// Hayır butonuna tıklandığında
noBtn.addEventListener('click', function() {
    // Tıklama sayısını artır
    noBtnClicks++;
    
    // Evet butonunu büyüt
    const currentSize = parseInt(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = (currentSize + 10) + 'px';
    
    // Hayır butonunu rastgele konuma taşı
    const maxX = window.innerWidth - noBtn.offsetWidth;
    const maxY = window.innerHeight - noBtn.offsetHeight;
    
    noBtn.style.position = 'absolute';
    noBtn.style.left = Math.random() * maxX + 'px';
    noBtn.style.top = Math.random() * maxY + 'px';
    
    // 5 kez tıklandıktan sonra hayır butonunu gizle
    if (noBtnClicks >= 5) {
        noBtn.style.display = 'none';
    }
});

// Konfeti efekti
function createConfetti() {
    const colors = ['#ff4757', '#2ed573', '#ffa502', '#1e90ff', '#ff6b81'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        
        // Animasyon bitince elementi kaldır
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    createBackgroundHearts();
    
    // Container'a hover efekti ekle
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        container.style.transform = `
            perspective(1000px)
            rotateX(${(y - rect.height / 2) / 20}deg)
            rotateY(${(x - rect.width / 2) / 20}deg)
        `;
    });
    
    container.addEventListener('mouseleave', () => {
        container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
    
    // Rastgele mesaj balonları
    const messageBubbles = document.querySelectorAll('.message-bubble');
    messageBubbles.forEach(bubble => {
        setInterval(() => {
            bubble.style.left = Math.random() * 80 + 10 + '%';
            bubble.style.top = Math.random() * 80 + 10 + '%';
        }, 4000);
    });
    
    // Anı kartlarını başlangıçta gizle
    const memoryCards = document.querySelectorAll('.memory-card');
    memoryCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
    });
});

// Konfeti animasyonu için CSS ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Photo Gallery Animation
const photoFrames = document.querySelectorAll('.photo-frame');
photoFrames.forEach(frame => {
    frame.addEventListener('mouseenter', () => {
        frame.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    frame.addEventListener('mouseleave', () => {
        frame.style.transform = 'translateY(0) scale(1)';
    });
});

// Memory Wall Animation
const memoryCards = document.querySelectorAll('.memory-card');
memoryCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 25px var(--shadow-color)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 3px 10px var(--shadow-color)';
    });
});

// Quote Cards Animation
const quoteCards = document.querySelectorAll('.quote-card');
quoteCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 25px var(--shadow-color)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 3px 10px var(--shadow-color)';
    });
});

// Floating Elements Animation
function createFloatingElement(type) {
    const element = document.createElement('i');
    element.className = `fas ${type === 'heart' ? 'fa-heart' : 'fa-sparkles'} floating-${type}`;
    element.style.left = Math.random() * 100 + '%';
    element.style.top = Math.random() * 100 + '%';
    element.style.animationDuration = (Math.random() * 2 + 2) + 's';
    element.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(element);
    
    setTimeout(() => {
        element.remove();
    }, 5000);
}

// Create floating elements periodically
setInterval(() => {
    createFloatingElement('heart');
    createFloatingElement('sparkle');
}, 3000);
