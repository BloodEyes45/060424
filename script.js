const champions = {
  top: ["Darius", "Garen", "Camille", "Fiora", "Shen"],
  jungle: ["Lee Sin", "Elise", "Kha'Zix", "Warwick", "Vi"],
  mid: ["Ahri", "Zed", "Katarina", "Yasuo", "Annie"],
  adc: ["Jinx", "Ezreal", "Kai'Sa", "Caitlyn", "Samira"],
  support: ["Thresh", "Leona", "Lulu", "Nami", "Blitzcrank"]
};

function getRandomChampion(role) {
  let pool;

  if (role === 'all') {
    // Tüm rollerden birleştir
    pool = Object.values(champions).flat();
  } else {
    pool = champions[role];
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedChampion = pool[randomIndex];

  document.getElementById('championName').innerText = selectedChampion;
}
