const startDate = new Date("2025-05-02");
const today = new Date();
const diffTime = today - startDate;
const dayNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

document.getElementById("dayNumber").textContent = dayNumber;
document.getElementById("currentDate").textContent = today.toLocaleDateString("tr-TR");

// Görevler (örnek: Gün 1)
const dailyWorkouts = {
  1: ["5 dakika ısınma", "15 squat", "10 şınav", "15 mekik", "5 dakika esneme"],
  2: ["20 dakika yürüyüş", "3x plank (30sn)", "20 crunch", "10 burpee", "5 dakika esneme"],
  // devamı gelecek...
};

const dailyNutrition = {
  1: ["Kahvaltı: Yumurta + yulaf", "Öğle: Tavuk + salata", "Akşam: Yoğurt + ceviz", "2.5 litre su", "Şeker/tatlı yok"],
  2: ["Kahvaltı: Haşlanmış yumurta + peynir", "Öğle: Izgara sebze + ton balığı", "Akşam: Mercimek çorbası + yoğurt", "2.5 litre su", "Cips/fast food yok"],
  // devamı gelecek...
};

const motivationQuotes = [
  "Hiçbir şey değişmezsen, hiçbir şey değişmez.",
  "Yorgunluk geçer, gurur kalır.",
  "Başlamak için mükemmel olmak zorunda değilsin, ama mükemmel olmak için başlamak zorundasın.",
  "Bugün başlarsan, yarın daha iyi görünürsün.",
  "49 gün sonra kendine teşekkür edeceksin."
];

function loadList(id, data) {
  const list = document.getElementById(id);
  const items = data[dayNumber] || ["Bugünün görevleri eklenmedi."];
  list.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(item));
    list.appendChild(li);
  });
}

function loadMotivation() {
  const quote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
  document.getElementById("motivationQuote").textContent = quote;
}

// Günlük görevleri ve motivasyonu yükleyelim
loadList("workoutList", dailyWorkouts);
loadList("nutritionList", dailyNutrition);
loadMotivation();
