//Canvas Setup
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let score = 0; //счёт игры, кол-во лопнутых шаров.
let gameFrame = 0;
ctx.font = '50px Georgia';
let gameSpeed = 1;
let gameOver = false;



//Активность мыши
let canvasPosition = canvas.getBoundingClientRect();
const mouse = { //координаты мыши изначально, середина оси х и середина оси у, линия к ней не рисуется
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}


canvas.addEventListener('mousemove', function (event) {
    mouse.click = true;//появляется линия , которая идёт от игрока к месту клика
    //Отслеживаем координаты клика мыши относительно канваса
    mouse.x = event.x - canvasPosition.left;// координата mouse.x = координата клика по оси х относительно левой границы экрана отнимаем расстояние между канвас и левой стороной экрана = получаем координату клика по х относительно левой границы канваса
    mouse.y = event.y - canvasPosition.top;
});
window.addEventListener('mousemove', function (event) {
    mouse.click = false;//исчезает линия , которая идёт от игрока к месту клика
})
//Player
const playerLeft = new Image();
playerLeft.src = './sprites/fish.png';
const playerRight = new Image();
playerRight.src = './sprites/output-onlinepngtools1.png';


class Player {
    constructor() {
        this.x = canvas.width; //передаём player координату х, == в конце холста по оси х
        this.y = canvas.height / 2; //передаём player координату y, == в середине холста по оси у
        this.radius = 50;
        this.angle = 20;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if (mouse.x != this.x) {
            this.x -= dx / 10; //скорость движения по оси х
        }
        if (mouse.y != this.y) {
            this.y -= dy / 10;//скорость движения по оси у
        }
    }

    draw() {
        if (mouse.click) { //делаем линия от игрока до клика мышки
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        //отрисовываем круг
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.fillRect(this.x, this.y, this.radius, 10);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if(this.x >= mouse.x) {
            console.log('playerLeftplayerLeft', playerLeft)
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0-60, 0-40, this.spriteWidth / 4, this.spriteHeight / 4);
            if(gameFrame % 10 == 0) { //анимация игрока
                this.frame++;
                if(this.frame >= 12) this.frame = 0;
                if(this.frame == 3 || this.frame == 7 || this.frame == 11) {
                    this.frameX = 0;
                } else {
                    this.frameX++;
                }
                if(this.frame < 3) this.frameY = 0;
                else if (this.frame < 7) this.frameY = 1;
                else if (this.frame < 11) this.frameY = 2;
                else this.frameY = 0;
            }
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0-60, 0-40, this.spriteWidth / 4, this.spriteHeight / 4)
            if(gameFrame % 10 == 0) {
                this.frame++;
                if(this.frame >= 12) this.frame = 0;
                if(this.frame == 3 || this.frame == 7 || this.frame == 11) {
                    this.frameX = 0;
                } else {
                    this.frameX++;
                }
                if(this.frame < 3) this.frameY = 0;
                else if (this.frame < 7) this.frameY = 1;
                else if (this.frame < 11) this.frameY = 2;
                else this.frameY = 0;
            }
        }
        ctx.restore();
    }
}

const player = new Player();
//Bubbles
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = './images/bubble_pop_frame_01.png'

class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width; //по оси х случайное число от 0 до 1 умноженноме на макс. значение (ширина холста)
        this.y = canvas.height + Math.random() * canvas.height;// по оси у случайное число от 0 до 1 умноженноме на макс. значение (высота холста)
        this.radius = 50;
        this.speed = Math.random() * 5 + 1; //скорость пузырей
        this.distance; //дистанция
        this.counted = false; //объявляем событие счётчика
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        // console.log(this.sound)
    }

    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);

    }

    draw() {
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(bubbleImage, this.x - 60, this.y - 60, this.radius * 2.5, this.radius * 2.5);
    }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = './audio/bubbles-single1.wav';
bubblePop1.autoplay = true;
const bubblePop2 = document.createElement('audio');
bubblePop2.src = './audio/Plop.ogg';
bubblePop1.autoplay = true;

function handleBubbles() {
    if (gameFrame % 50 == 0) {
        bubblesArray.push(new Bubble());
    }
    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();

    }
    for (i = 0; i < bubblesArray.length; i++) {
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) { //если у пузыря по оси у меньше (0 - радиус пузыря)  то он вырезается из массива
            bubblesArray.splice(i, 1);
        }
        if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) { //если игрок и пузырь сталкиваются
            // console.log('vzriv')
            if (!bubblesArray[i].counted) { //счётчик один раз срабатывает на событие
                if (bubblesArray[i].sound == 'sound1') {
                    bubblePop1.play();
                } else {
                    bubblePop2.play();
                }
                score++;
                bubblesArray[i].counted = true;
                bubblesArray.splice(i, 1);
            }

        }
        ;
    }
}
//Повторяющийся бекграунд
const background = new Image();
background.src = './sprites/background1.png'


const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,
}


function handleBackground(){
    BG.x1-= gameSpeed;
    if(BG.x1 < -BG.width) BG.x1 = BG.width;
    BG.x2-= gameSpeed;
    if(BG.x2 < -BG.width) BG.x2 = BG.width;
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height); //Первая волна с начала холста
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height); //Подрисовываем втору волну в конце холста для непрерывности
}
///Враги
const enemyImage = new Image();
enemyImage.src = './sprites/red_swim.png';

class Enemy {
    constructor() {
        this.x = canvas.width + 200;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY =  0;
        this.spriteWidth = 418;
        this.spriteHeight = 397;
    }
    draw(){
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
        // ctx.fill();
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 60, this.y - 70, this.spriteWidth/3, this.spriteHeight/3)
    }
    update(){
        this.x -= this.speed;
        if( this.x < 0 - this.radius * 2) {
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2 + 2;
        }
        if(gameFrame % 10 == 0 ) { //анимация красной рыбёхи
            this.frame++;
            if(this.frame >= 12) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame == 11) {
                this.frameX = 0;
            } else {
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else this.frameY = 0;
        }
        //Столкновение с игроком
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + player.radius){
            handleGameOver();
        }
    }
}
const enemy1 = new Enemy();
function handleEnemies() {
    enemy1.draw();
    enemy1.update();

}
function handleGameOver() {
    ctx.fillStyle = 'white';
    let textOver = ctx.measureText('Game Over, you reached score'+ score);
    // console.log(textOver.width);
    ctx.fillText('Game Over, you reached score ' + score, (canvas.width/2 - textOver.width/2), canvas.height/2);
    gameOver = true;
}

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleBubbles();
    handleEnemies();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    if(!gameOver) requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvasPosition = canvas.getBoundingClientRect();
});


//исчезновение стартового экрана
let startBg = document.querySelector('.start'),
    startBtn = startBg.querySelector('.start-btn'),
    body = document.querySelector('body');
startBtn.addEventListener('click',() => {
    startBg.remove();
    body.style.cursor = 'none';
});
