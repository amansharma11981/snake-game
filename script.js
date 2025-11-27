const board = document.querySelector('.board');
const startBtn = document.querySelector('.btn-start');
const restartBtn = document.querySelector('.btn-restart');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');

const highScoreElement = document.querySelector('#high-score');
const currentScoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

const blockHeight = 10;
const blockWidth = 10;  

let time = '00-00';
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timeIntervalId = null;
let food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};


const blocks = []
let Snake = [
    {    x: 5, y: 5    },
    {    x: 5, y: 6    },
 
   ]

let direction = 'down'; 

for (let row = 0; row < rows ; row++) 
{
    for (let col = 0;col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }   
}


function render() {
    
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add('food');

    if (direction === 'right') {
        head = { x: (Snake[0].x) , y: Snake[0].y + 1 };

    } else if (direction === 'left') {
         head = { x: Snake[0].x, y: (Snake[0].y - 1) };
    } else if (direction === 'up') {
         head = { x: (Snake[0].x - 1 ), y: Snake[0].y };
      
    } else if (direction === 'down') { 
        head = { x: (Snake[0].x + 1) , y: Snake[0].y };
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        modal.style.display = 'flex';
        startGameModal.style.display = 'none';
        gameOverModal.style.display = 'flex';
        return;
    }

    const ate = (head.x === food.x && head.y === food.y);
    if (ate) {
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};
        score += 10;
        currentScoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.innerText = highScore.toString();
        }
    }

    Snake.forEach( segment => { 
        const el = blocks[`${segment.x}-${segment.y}`];
        if (el) el.classList.remove('fill', 'head');
    })
    Snake.unshift(head);
   if (!ate) Snake.pop();
    

    Snake.forEach((segment, idx) => {
        const el = blocks[`${segment.x}-${segment.y}`];
        if (!el) return;
        if (idx === 0) el.classList.add('head');
        else el.classList.add('fill');
    });
   
}



addEventListener('click', (e) => {
    if (e.target === startBtn) {
       intervalId = setInterval(() => {
        modal.style.display = 'none';
    render();
}, 100)
timeIntervalId = setInterval(() => {
   let [minutes, seconds] = time.split('-').map(Number);
   seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    time = `${minutes}-${seconds}`
    timeElement.textContent = time;
}, 1000);
   
}});
addEventListener('click', (e) => {
    if (e.target === restartBtn) {
       resetGame();
    }});


function resetGame() {
    blocks[`${food.x}-${food.y}`].classList.remove('food');
    Snake.forEach( segment => { 
        const el = blocks[`${segment.x}-${segment.y}`];
        if (el) el.classList.remove('fill','head');
    })
    score = 0;
    time = '00-00';
    highScoreElement.textContent = highScore;
    currentScoreElement.textContent = score; 
    timeElement.textContent = time;   
    
    modal.style.display = 'none';
    gameOverModal.style.display = 'none';
    direction = 'down';
    food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};
    Snake.length = 0;
    Snake.push({ x: 5, y: 5 });
    intervalId = setInterval(() => {
        render();
    }, 100);
}


addEventListener('keydown', (e) => {
     const key = e.key;
    let newDir = null;
    if (key === 'ArrowRight' || key === 'd' || key === 'D') newDir = 'right';
    else if (key === 'ArrowLeft' || key === 'a' || key === 'A') newDir = 'left';
    else if (key === 'ArrowUp' || key === 'w' || key === 'W') newDir = 'up';
    else if (key === 'ArrowDown' || key === 's' || key === 'S') newDir = 'down';
    if (!newDir) return;

    const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (opposite[direction] === newDir) return; // ignore reverse input

    direction = newDir;
});


setInterval(() => {
    const now = new Date();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    time.textContent = `${minutes}:${seconds}`;
}, 1000);






