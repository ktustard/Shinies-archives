const board = document.getElementById("puzzleBoard");
const moveCount = document.getElementById("moveCount");
const shuffleBtn = document.getElementById("shuffleBtn");
const puzzleMessage = document.getElementById("puzzleMessage");

let tiles = [];
let moves = 0;

const solvedTiles = [0, 1, 2, 3, 4, 5, 6, 7, null];

function startPuzzle(){
    tiles = [...solvedTiles];
    moves = 0;
    shuffleTiles();
    renderPuzzle();
}

function shuffleTiles(){
    do{
        tiles = [...solvedTiles].sort(() => Math.random() - 0.5);
    }while(!isSolvable(tiles) || isSolved());

    moves = 0;
    puzzleMessage.textContent = "Arrange the pieces to complete the image.";
    puzzleMessage.classList.remove("win");
    renderPuzzle();
}

function renderPuzzle(){
    board.innerHTML = "";
    moveCount.textContent = `Moves: ${moves}`;

    tiles.forEach((tile, index) => {
        const button = document.createElement("button");
        button.className = "puzzle-tile";

        if(tile === null){
            button.classList.add("empty");
        }else{
            const x = tile % 3;
            const y = Math.floor(tile / 3);

            button.style.backgroundPosition = `${x * 50}% ${y * 50}%`;

            button.addEventListener("click", () => moveTile(index));
        }

        board.appendChild(button);
    });
}

function moveTile(index){
    const emptyIndex = tiles.indexOf(null);

    if(!isAdjacent(index, emptyIndex)) return;

    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];

    moves++;

    renderPuzzle();

    if(isSolved()){
        puzzleMessage.textContent = `Puzzle complete! ✨ Finished in ${moves} moves.`;
        puzzleMessage.classList.add("win");
    }
}

function isAdjacent(index, emptyIndex){
    const row = Math.floor(index / 3);
    const col = index % 3;

    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    return Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
}

function isSolved(){
    return tiles.every((tile, index) => tile === solvedTiles[index]);
}

function isSolvable(array){
    const numbers = array.filter(tile => tile !== null);

    let inversions = 0;

    for(let i = 0; i < numbers.length; i++){
        for(let j = i + 1; j < numbers.length; j++){
            if(numbers[i] > numbers[j]){
                inversions++;
            }
        }
    }

    return inversions % 2 === 0;
}

shuffleBtn.addEventListener("click", shuffleTiles);

startPuzzle();