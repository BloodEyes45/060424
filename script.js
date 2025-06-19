const forgiveBtn = document.getElementById('forgiveBtn');
const notYetBtn = document.getElementById('notYetBtn');
const responseDiv = document.getElementById('response');
const extraDiv = document.getElementById('extra');
const catFactDiv = document.getElementById('catFact');
const surpriseArea = document.getElementById('surpriseArea');

const catGifs = [
    'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
    'https://media.giphy.com/media/13borq7Zo2kulO/giphy.gif',
    'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
    'https://media.giphy.com/media/6VoDJzfRjJNbG/giphy.gif',
    'https://media.giphy.com/media/12PA1eI8FBqEBa/giphy.gif',
];

const catFacts = [
    "Kediler hayatlarının %70'ini uyuyarak geçirir.",
    'Bir kedi ortalama 110-140 dereceye kadar kulaklarını döndürebilir.',
    'Kedilerin burnu, insanlar gibi benzersizdir. Her kedinin burun izi farklıdır!',
    'Kediler, insanlara göre 6 kat daha iyi görebilirler.',
    'Kediler mutlu olduklarında mırlarlar.',
    'Kedilerin kalbi dakikada 110-140 kez atar.',
    'Kediler, sahiplerini miyavlayarak selamlar.',
    'Kediler, insanları iyileştirici etkisiyle bilinir.',
    "Kediler, 100'den fazla farklı ses çıkarabilir.",
    "Kediler, 30'a kadar diş çıkarabilir.",
];

function playMeow() {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5e2.mp3');
    audio.play();
}

function createHeartAnim() {
    const heart = document.createElement('div');
    heart.className = 'flying-heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 80 + 10 + '%';
    document.body.appendChild(heart);
    setTimeout(() => {
        heart.remove();
    }, 2200);
}

function createBalloonAnim() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const colors = ['#ffb6b9', '#d72660', '#f7cac9', '#ffe066', '#b5ead7', '#c7ceea'];
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.left = Math.random() * 80 + 10 + '%';
    balloon.style.animationDuration = (1.8 + Math.random() * 1.5) + 's';
    document.body.appendChild(balloon);
    setTimeout(() => {
        balloon.remove();
    }, 2500);
}

function burstHearts(count = 12) {
    for (let i = 0; i < count; i++) {
        setTimeout(createHeartAnim, i * 80);
    }
}

function burstBalloons(count = 8) {
    for (let i = 0; i < count; i++) {
        setTimeout(createBalloonAnim, i * 120);
    }
}

function showRandomCatGif() {
    const gif = catGifs[Math.floor(Math.random() * catGifs.length)];
    surpriseArea.innerHTML = `<img src="${gif}" alt="Kedi GIF" class="cat-gif">`;
}

function showRandomCatFact() {
    const fact = catFacts[Math.floor(Math.random() * catFacts.length)];
    catFactDiv.innerHTML = `<span>🐾 <b>Kedi Gerçeği:</b> ${fact}</span>`;
}

forgiveBtn.addEventListener('click', () => {
    responseDiv.innerHTML = 'Seni çok seviyorum! 💖 İyi ki varsın, iyi ki benimlesin. Bundan sonra daha dikkatli olacağıma söz veriyorum!';
    forgiveBtn.style.display = 'none';
    notYetBtn.style.display = 'none';
    burstHearts(18);
    burstBalloons(10);
    playMeow();
    setTimeout(() => {
        extraDiv.innerHTML = `<div class="final-msg">\n        <h2>Barıştık mı? 😻</h2>\n        <p>Seninle her şey çok daha güzel! Birlikte nice güzel anılar biriktirelim.\n        <br>Birlikte kedi sevelim, bol bol sarılalım! 💞</p>\n        <blockquote style='font-style:italic;color:#d72660;margin:12px 0 8px 0;'>\n        "Seninle her sabah uyanmak,\n        <br>Bir kedi gibi huzurla yanına sokulmak...\n        <br>İşte en büyük mutluluğum bu!"\n        </blockquote>\n        <img src='https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif' alt='Kucaklayan Kedi' style='width:90px;border-radius:50%;margin-top:12px;box-shadow:0 2px 8px #d7266040;'>\n        </div>`;
        burstHearts(10);
        burstBalloons(8);
        playMeow();
        showRandomCatGif();
    }, 1800);
});

notYetBtn.addEventListener('click', () => {
    const messages = [
        'Ama ben seni çok seviyorum... Bir şans daha? 🥺',
        'Küsmek yok, barışalım mı? 💌',
        'Bir sarılsam geçer mi? 🤗',
        'Birlikte daha güzeliz, affet beni! 💞',
        'Sana çiçekler alayım mı? 🌹',
        'Bir kahve ısmarlayayım, barışalım! ☕',
        'Bak, kalbim senin için atıyor! 💓',
        'Bir gülüşünü çok özledim... 😊',
        'Kediler bile barışmamızı istiyor! 🐾',
        'Bak, kedi de üzgün... 😿',
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    responseDiv.innerHTML = randomMsg;
    burstHearts(7);
    burstBalloons(6);
    playMeow();
    showRandomCatFact();
    showRandomCatGif();
});

// Sayfa açılışında rastgele kedi bilgisi ve GIF göster
window.onload = () => {
    showRandomCatFact();
    showRandomCatGif();
};

// Animasyonlu kalp ve balon stilleri
const style = document.createElement('style');
style.innerHTML = `
.flying-heart {
    position: fixed;
    bottom: 40px;
    font-size: 2.2rem;
    pointer-events: none;
    animation: flyup 2.2s cubic-bezier(.68,-0.55,.27,1.55);
    z-index: 9999;
}
@keyframes flyup {
    0% { opacity: 0; transform: translateY(0) scale(0.7); }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; transform: translateY(-220px) scale(1.3) rotate(-12deg); }
}
.balloon {
    position: fixed;
    bottom: -60px;
    width: 32px;
    height: 44px;
    border-radius: 16px 16px 16px 16px / 22px 22px 22px 22px;
    z-index: 9998;
    animation: balloonup 2.2s cubic-bezier(.68,-0.55,.27,1.55);
    box-shadow: 0 2px 8px #d7266040;
}
@keyframes balloonup {
    0% { opacity: 0; transform: translateY(0) scale(0.7); }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; transform: translateY(-320px) scale(1.1) rotate(8deg); }
}
.cat-gif {
    width: 120px;
    border-radius: 18px;
    margin: 18px auto 0 auto;
    display: block;
    box-shadow: 0 2px 12px #d7266040;
}
.final-msg h2 {
    color: #d72660;
    margin-bottom: 8px;
    font-size: 1.2rem;
}
.final-msg p {
    color: #333;
    font-size: 1.05rem;
    margin-bottom: 8px;
}
.cat-fact {
    margin: 10px 0 18px 0;
    font-size: 1.01rem;
    color: #a4133c;
    background: #fff0f6;
    border-radius: 12px;
    padding: 7px 12px;
    display: inline-block;
    box-shadow: 0 1px 4px #d7266015;
}
`;
document.head.appendChild(style); 
