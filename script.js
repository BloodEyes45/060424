document.addEventListener("DOMContentLoaded", function () {
  const greeting = document.querySelector(".greeting");
  setTimeout(() => {
    greeting.innerHTML += " 🌙";
  }, 4000); // "İyi Geceler" yazısına gece simgesi ekleme
});
 
