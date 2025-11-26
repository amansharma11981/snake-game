const board = document.querySelector('.board');
const blockHeight = 10;
const blockWidth = 10;  

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

for (let i = 0; i < rows ; i++) {
    for (let j = 0; j < cols; j++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
    }   
      
    }