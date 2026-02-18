const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

// --- NỘI DUNG CHỮ ---
const textList = [
    "❤️", 
    "3", "2", "1", 
    "HAPPY", "NEW YEAR", "2026", 
    "CHÚC EM", "VUI VẺ", "HẠNH PHÚC"
];

let textIndex = 0;
let isRunning = false;

// --- CLICK ---
const overlay = document.getElementById('overlay');
const audio = document.getElementById('player');

overlay.addEventListener('click', function() {
    overlay.style.display = 'none';
    audio.play();
    isRunning = true;
    init(textList[0]);
    animate();
    setInterval(autoChangeText, 2500); 
});

// --- HẠT ---
const mouse = { x: null, y: null, radius: 150 }
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });

ctx.font = 'bold 30px Verdana';

class Particle {
    constructor(x, y){
        this.x = x; this.y = y;
        this.size = 3;
        this.baseX = x; this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.color = 'gold';
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius){
            this.x -= directionX * 3;
            this.y -= directionY * 3;
        } else {
            if (this.x !== this.baseX){ let dx = this.x - this.baseX; this.x -= dx/10; }
            if (this.y !== this.baseY){ let dy = this.y - this.baseY; this.y -= dy/10; }
        }
    }
}

function init(textInput){
    particleArray = [];
    let fontSize = 100;
    if (window.innerWidth < 600) fontSize = 50;
    ctx.font = 'bold ' + fontSize + 'px Verdana';
    const textWidth = ctx.measureText(textInput).width;
    const startX = (canvas.width - textWidth) / 2;
    const startY = canvas.height / 2;
    ctx.fillText(textInput, startX, startY);
    const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                if (x % 4 === 0 && y % 4 === 0) { 
                    particleArray.push(new Particle(x, y));
                }
            }
        }
    }
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}

function autoChangeText() {
    if (!isRunning) return;
    if (document.getElementById('gallery').style.display === 'block') return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    textIndex++;

    if (textIndex >= textList.length) {
        document.getElementById('gallery').style.display = 'block';
        init("HAPPY 2026"); 
    } else {
        init(textList[textIndex]);
    }
}