const pages = [
  {
    bgGradient: ['#ff6b6b', '#ee5a24', '#ff3838'],
    flowerType: 'magical_rose',
    message: 'Her çiçek senin için açıyor... Dokun ve büyüyü gör! 🌹',
    particles: 'sparkles',
    sound: 'magic'
  },
  {
    bgGradient: ['#8d5fd3', '#6c5ce7', '#a29bfe'],
    flowerType: 'cosmic_violet',
    message: 'Evrenin en güzel çiçekleri senin için dans ediyor! ✨',
    particles: 'stars',
    sound: 'cosmic'
  },
  {
    bgGradient: ['#ffd60a', '#fdcb6e', '#ffeaa7'],
    flowerType: 'sunflower_dream',
    message: 'Güneş gibi parlayan çiçeklerle sarıldın! 🌻',
    particles: 'sunbeams',
    sound: 'sunshine'
  },
  {
    bgGradient: ['#ff6f91', '#fd79a8', '#f8c291'],
    flowerType: 'cherry_blossom',
    message: 'Kiraz çiçekleri gibi zarif ve güzelsin! 🌸',
    particles: 'petals',
    sound: 'cherry'
  },
  {
    bgGradient: ['#fff8f0', '#ffeaa7', '#fdcb6e'],
    message: 'Ve işte en güzel çiçek: <b>SEN</b>!<br><span style="font-size:1.2em;">Senin gülüşün, tüm evrenden daha güzel... 💖</span>',
    isFinal: true,
    particles: 'hearts',
    sound: 'love'
  }
];

let currentPage = 0;
const app = document.getElementById('app');
const nextBtn = document.getElementById('nextBtn');
let particles = [];
let flowers = [];
let isAnimating = false;
let mouseX = 0, mouseY = 0;
let audioContext = null;

// Ses sistemi başlat
function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.log('Audio not supported');
  }
}

// Ses efekti çal
function playSound(frequency, duration, type = 'sine') {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// Mouse takibi
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Dinamik arka plan animasyonu
function animateBackground(gradient) {
  const body = document.body;
  body.style.background = `linear-gradient(45deg, ${gradient.join(', ')})`;
  body.style.backgroundSize = '400% 400%';
  body.style.animation = 'gradientShift 8s ease infinite';
}

// Gelişmiş parçacık sistemi
class Particle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = Math.random() * -4 - 2;
    this.life = 1;
    this.decay = Math.random() * 0.015 + 0.005;
    this.type = type;
    this.size = Math.random() * 12 + 6;
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    this.gravity = 0.15;
    this.bounce = 0.7;
    this.groundY = window.innerHeight;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= this.decay;
    this.rotation += this.rotationSpeed;
    
    // Yere çarpma
    if (this.y > this.groundY - this.size) {
      this.y = this.groundY - this.size;
      this.vy *= -this.bounce;
      this.vx *= 0.8;
    }
    
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    switch(this.type) {
      case 'sparkles':
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 10;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        break;
      case 'stars':
        ctx.fillStyle = '#fffde7';
        ctx.shadowColor = '#fffde7';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        for(let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos((i * 2 * Math.PI) / 5) * this.size, 
                     Math.sin((i * 2 * Math.PI) / 5) * this.size);
          ctx.lineTo(Math.cos(((i * 2 + 1) * Math.PI) / 5) * this.size/2, 
                     Math.sin(((i * 2 + 1) * Math.PI) / 5) * this.size/2);
        }
        ctx.closePath();
        ctx.fill();
        break;
      case 'hearts':
        ctx.fillStyle = '#ff6b9d';
        ctx.shadowColor = '#ff6b9d';
        ctx.shadowBlur = 12;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText('💖', -this.size/2, this.size/2);
        break;
      case 'sunbeams':
        ctx.fillStyle = '#ffd60a';
        ctx.shadowColor = '#ffd60a';
        ctx.shadowBlur = 20;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        break;
      case 'petals':
        ctx.fillStyle = '#ffb3d9';
        ctx.shadowColor = '#ffb3d9';
        ctx.shadowBlur = 8;
        ctx.fillText('🌸', -this.size/2, this.size/2);
        break;
    }
    ctx.restore();
  }
}

// Canvas oluştur
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '1';
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Parçacık animasyonu
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Yeni parçacıklar ekle
  if (Math.random() < 0.4) {
    particles.push(new Particle(
      Math.random() * canvas.width,
      canvas.height + 10,
      pages[currentPage].particles
    ));
  }
  
  // Parçacıkları güncelle ve çiz
  particles = particles.filter(particle => {
    if (particle.update()) {
      particle.draw(ctx);
      return true;
    }
    return false;
  });
  
  requestAnimationFrame(animateParticles);
}

// 3D Çiçek oluştur - gerçek 3D efektler
function create3DFlower(type, x, y) {
  const flower = document.createElement('div');
  flower.className = 'magical-flower';
  flower.style.left = x + 'px';
  flower.style.top = y + 'px';
  
  let svg = '';
  const uniqueId = 'flower_' + Math.random().toString(36).substr(2, 9);
  
  switch(type) {
    case 'magical_rose':
      svg = `<svg viewBox='0 0 120 120' width='120' height='120'>
        <defs>
          <radialGradient id='roseGrad_${uniqueId}' cx='50%' cy='50%' r='50%'>
            <stop offset='0%' stop-color='#ffb3b3'/>
            <stop offset='50%' stop-color='#e63946'/>
            <stop offset='100%' stop-color='#c62828'/>
          </radialGradient>
          <filter id='glow_${uniqueId}'>
            <feGaussianBlur stdDeviation='6' result='coloredBlur'/>
            <feMerge> 
              <feMergeNode in='coloredBlur'/>
              <feMergeNode in='SourceGraphic'/>
            </feMerge>
          </filter>
        </defs>
        <g filter='url(#glow_${uniqueId})'>
          <ellipse cx='60' cy='60' rx='35' ry='40' fill='url(#roseGrad_${uniqueId})'/>
          <ellipse cx='60' cy='55' rx='25' ry='30' fill='#ff6b6b'/>
          <ellipse cx='60' cy='50' rx='18' ry='22' fill='#ff4757'/>
          <circle cx='60' cy='45' r='12' fill='#fff' opacity='0.3'/>
          <circle cx='60' cy='45' r='8' fill='#ffd700'/>
          <ellipse cx='60' cy='95' rx='10' ry='25' fill='#388e3c'/>
        </g>
      </svg>`;
      break;
      
    case 'cosmic_violet':
      svg = `<svg viewBox='0 0 120 120' width='120' height='120'>
        <defs>
          <radialGradient id='violetGrad_${uniqueId}' cx='50%' cy='50%' r='50%'>
            <stop offset='0%' stop-color='#e1bee7'/>
            <stop offset='100%' stop-color='#8d5fd3'/>
          </radialGradient>
        </defs>
        <ellipse cx='60' cy='55' rx='18' ry='30' fill='url(#violetGrad_${uniqueId})'/>
        <ellipse cx='42' cy='50' rx='15' ry='22' fill='#b39ddb'/>
        <ellipse cx='78' cy='50' rx='15' ry='22' fill='#9575cd'/>
        <ellipse cx='60' cy='30' rx='12' ry='18' fill='#ce93d8'/>
        <ellipse cx='48' cy='26' rx='10' ry='15' fill='#ba68c8'/>
        <ellipse cx='72' cy='26' rx='10' ry='15' fill='#ab47bc'/>
        <circle cx='60' cy='60' r='12' fill='#fffde7'/>
        <circle cx='60' cy='60' r='8' fill='#ffd600'/>
        <circle cx='60' cy='60' r='4' fill='#fff'/>
      </svg>`;
      break;
      
    case 'sunflower_dream':
      svg = `<svg viewBox='0 0 120 120' width='120' height='120'>
        <defs>
          <radialGradient id='sunGrad_${uniqueId}' cx='50%' cy='50%' r='50%'>
            <stop offset='0%' stop-color='#fff59d'/>
            <stop offset='100%' stop-color='#ffd60a'/>
          </radialGradient>
        </defs>
        <g>
          <ellipse cx='60' cy='25' rx='7' ry='30' fill='#fff'/>
          <ellipse cx='60' cy='95' rx='7' ry='30' fill='#fff'/>
          <ellipse cx='25' cy='60' rx='30' ry='7' fill='#fff'/>
          <ellipse cx='95' cy='60' rx='30' ry='7' fill='#fff'/>
          <ellipse cx='36' cy='36' rx='7' ry='24' fill='#fff'/>
          <ellipse cx='84' cy='36' rx='7' ry='24' fill='#fff'/>
          <ellipse cx='36' cy='84' rx='7' ry='24' fill='#fff'/>
          <ellipse cx='84' cy='84' rx='7' ry='24' fill='#fff'/>
          <circle cx='60' cy='60' r='18' fill='url(#sunGrad_${uniqueId})' stroke='#e6b800' stroke-width='5'/>
          <circle cx='60' cy='60' r='12' fill='#ffeb3b'/>
          <circle cx='60' cy='60' r='6' fill='#fff'/>
        </g>
      </svg>`;
      break;
      
    case 'cherry_blossom':
      svg = `<svg viewBox='0 0 120 120' width='120' height='120'>
        <defs>
          <linearGradient id='cherryGrad_${uniqueId}' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stop-color='#ffb3d9'/>
            <stop offset='100%' stop-color='#ff6f91'/>
          </linearGradient>
        </defs>
        <path d='M60 100 Q48 70 48 35 Q60 12 72 35 Q72 70 60 100Z' fill='url(#cherryGrad_${uniqueId})'/>
        <ellipse cx='60' cy='42' rx='15' ry='22' fill='#fff' opacity='0.2'/>
        <ellipse cx='60' cy='36' rx='10' ry='15' fill='#fff' opacity='0.3'/>
        <ellipse cx='60' cy='105' rx='12' ry='30' fill='#388e3c'/>
        <circle cx='54' cy='30' r='4' fill='#fff' opacity='0.4'/>
        <circle cx='66' cy='30' r='4' fill='#fff' opacity='0.4'/>
      </svg>`;
      break;
  }
  
  flower.innerHTML = svg;
  
  // Mouse etkileşimi - gelişmiş
  flower.addEventListener('click', () => {
    if (!isAnimating) {
      // Ses efekti
      playSound(800, 0.3, 'sine');
      
      // Patlama animasyonu
      flower.style.animation = 'flowerExplode 1s ease-out';
      setTimeout(() => {
        flower.style.animation = 'flowerFloat 6s ease-in-out infinite, flowerRotate 8s linear infinite, flower3D 4s ease-in-out infinite';
      }, 1000);
      
      // Büyük patlama efekti
      for (let i = 0; i < 25; i++) {
        particles.push(new Particle(
          x + 60,
          y + 60,
          pages[currentPage].particles
        ));
      }
      
      // Sürpriz mesaj
      if (Math.random() < 0.3) {
        showFlowerMessage(flower, x, y);
      }
    }
  });
  
  // Mouse hover efekti
  flower.addEventListener('mouseenter', () => {
    flower.style.transform = 'scale(1.3) rotateY(15deg)';
    playSound(600, 0.1, 'triangle');
  });
  
  flower.addEventListener('mouseleave', () => {
    flower.style.transform = 'scale(1) rotateY(0deg)';
  });
  
  return flower;
}

// Sürpriz çiçek mesajları
function showFlowerMessage(flower, x, y) {
  const messages = [
    'Seni seviyorum! 💖',
    'Çok güzelsin! 🌸',
    'Sen benim her şeyimsin! ✨',
    'Seninle mutluyum! 🌹',
    'Aşkım! 💕'
  ];
  
  const msg = document.createElement('div');
  msg.className = 'flower-bubble';
  msg.textContent = messages[Math.floor(Math.random() * messages.length)];
  msg.style.left = (x + 30) + 'px';
  msg.style.top = (y - 40) + 'px';
  
  document.body.appendChild(msg);
  
  setTimeout(() => {
    msg.remove();
  }, 2000);
}

function renderPage(idx) {
  app.innerHTML = '';
  particles = [];
  flowers = [];
  
  const page = pages[idx];
  animateBackground(page.bgGradient);
  
  if (page.isFinal) {
    // Hologram efekti ile final
    const hologramContainer = document.createElement('div');
    hologramContainer.className = 'hologram-container';
    
    const img = document.createElement('img');
    img.src = 'image.png';
    img.alt = 'Sevgilim';
    img.className = 'final-photo hologram';
    app.appendChild(hologramContainer);
    hologramContainer.appendChild(img);
    
    const msg = document.createElement('div');
    msg.className = 'flower-message final-message';
    msg.innerHTML = page.message;
    app.appendChild(msg);
    
    // Özel final efektleri
    setTimeout(() => {
      playSound(440, 0.5, 'sine');
      playSound(554, 0.5, 'sine');
      playSound(659, 0.5, 'sine');
    }, 1000);
    
    nextBtn.style.display = 'none';
    return;
  }
  
  // Çiçekleri rastgele yerleştir
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 300) + 150;
    const flower = create3DFlower(page.flowerType, x, y);
    flowers.push(flower);
    app.appendChild(flower);
  }
  
  const msg = document.createElement('div');
  msg.className = 'flower-message';
  msg.innerHTML = page.message;
  app.appendChild(msg);
  nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
  if (currentPage < pages.length - 1) {
    playSound(523, 0.2, 'square');
    currentPage++;
    renderPage(currentPage);
  }
});

let touchStartX = null;
window.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
window.addEventListener('touchend', (e) => {
  if (touchStartX !== null) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -50 && currentPage < pages.length - 1) {
      currentPage++;
      renderPage(currentPage);
    }
    touchStartX = null;
  }
});

// Canvas'ı ekle ve animasyonu başlat
document.body.appendChild(canvas);
initAudio();
animateParticles();
renderPage(currentPage); 
