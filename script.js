// 💖 Kalbe tıklayınca rastgele renk değiştir
const heart = document.querySelector('.heart');

heart.addEventListener('click', () => {
  const colors = ['#ff5c8d', '#ff3b58', '#ff9a8b', '#f1c4c1', '#ff69b4', '#e75480'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  heart.style.backgroundColor = randomColor;
});
