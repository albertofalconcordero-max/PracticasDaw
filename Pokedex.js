const img = document.querySelector("img");
img.style.opacity=0;

img.onload = () => {
let opacidad=0;
const intervalo = setInterval(() => {
    opacidad += 0.05;
    img.style.opacity = opacidad;
    if (opacidad >= 1) clearInterval(intervalo);
}, 30)};