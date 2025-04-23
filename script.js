// script.js
document.body.style.transition = "background-color 1s ease";
document.body.style.backgroundColor = "#1c1c1c";

// Typewriter effect
let typewriter = document.getElementById('typewriter');
let text = "İyi Geceler Sevgilim!";
let index = 0;

function typeWriter() {
    if (index < text.length) {
        typewriter.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 100);
    }
}

window.onload = typeWriter;
