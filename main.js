const gameGrid = document.getElementById('game-grid');
const dialogContainer = document.getElementById('players-dialog');
const messageArea = document.getElementById('message-area');

const cells = Array.from(document.querySelectorAll('.cell'));
let availableCells = cells.length;

const MARK_X = "X";
const MARK_O = "O";

let players = [];
let currentPlayerID = 0;

let timerID = null;

window.addEventListener('load', () => {
    dialogContainer.showModal();
});

dialogContainer.addEventListener('input', () => {
    const form = dialogContainer.querySelector('form');
    const submitButton = dialogContainer.querySelector('input[type=submit]');

    submitButton.disabled = form.checkValidity() ? false : true;
});

dialogContainer.addEventListener('cancel', (event) => {
    event.preventDefault();
});

dialogContainer.addEventListener('submit', () => {
    players[0] = {
        name: dialogContainer.querySelector('#player1-name').value,
        mark: MARK_X
    };
    players[1] = {
        name: dialogContainer.querySelector('#player2-name').value,
        mark: MARK_O
    };

    showPlayersInfo();
    showMessage(`Vez do jogador ${players[currentPlayerID].name}`);

    startTimer();
});

gameGrid.addEventListener('click', clickHandler);

function clickHandler(event) {
    if (!targetIsCell(event.target)) {
        return;
    }

    const cell = event.target;
    if (isMarked(cell)) {
        return;
    }

    markCell(cell);

    if (gameHasWinner(cell)) {
        showMessage(`Jogador ${players[currentPlayerID].name} venceu!`);
        finishGame();
        return;
    }

    if (availableCells === 0) {
        showMessage(`Empate!`);
        finishGame();
        return;
    }

    changePlayerTurns();
    showMessage(`Vez do jogador ${players[currentPlayerID].name}`);
}

function finishGame() {
    stopTimer();
    gameGrid.classList.toggle('opaque');
    gameGrid.removeEventListener('click', clickHandler);

    const gameContainer = document.getElementById('game-container');

    const restartButton = document.createElement('button');
    restartButton.id = 'restart-button';
    restartButton.textContent = 'Jogar novamente';
    restartButton.classList.toggle('btn');

    restartButton.onclick = () => {
        players = [];
        currentPlayerID = 0;
        timerID = null;

        cells.forEach((cell) => {
            cell.innerHTML = '';
        });
        availableCells = cells.length;

        showMessage('');

        restartButton.remove();

        gameGrid.addEventListener('click', clickHandler);
        gameGrid.classList.toggle('opaque');

        dialogContainer.showModal();
    };

    gameContainer.appendChild(restartButton)
}

function startTimer() {
    const timer = document.getElementById('time-counter');
    let counter = 0;
    timerID = setInterval(() => {
        const min = `${Math.floor(counter / 60)}`.padStart(2, '0');
        const sec = `${counter % 60}`.padStart(2, '0');
        timer.innerHTML = `Tempo: ${min}:${sec}`;
        counter++;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerID);
}

function showPlayersInfo() {
    players.forEach((player, i) => {
        const playerInfo = document.getElementById(`player${i + 1}`);
        playerInfo.innerHTML = `${player.name}: <span class="mark-${player.mark.toLowerCase()}">${player.mark}</span>`;
    });
}

function showMessage(msg) {
    messageArea.textContent = msg;
}

function changePlayerTurns() {
    currentPlayerID = currentPlayerID === 0 ? 1 : 0;
}

function isMarked(cell) {
    return cell.textContent.length !== 0;
}

function markCell(cell) {
    const player = players[currentPlayerID];
    cell.innerHTML = `<span class="mark-${player.mark.toLowerCase()}">${player.mark}</span>`;
    availableCells--;
}

function targetIsCell(target) {
    return target.classList.contains('cell');
}

function gameHasWinner(cell) {
    const [row, col] = coordFromIndex(cells.indexOf(cell));

    return checkRow(cell, row) || checkColumn(cell, col) ||
        checkPrimaryDiagonal(cell) || checkSecundaryDiagonal(cell);
}

function coordFromIndex(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return [row, col];
}

function indexFromCoord(row, col) {
    return 3 * row + col;
}

function checkRow(cell, row) {
    let res = true;
    for (let i = 0; i < 3; i++) {
        res = res && (cell.textContent === cells[indexFromCoord(row, i)].textContent);
    }
    return res;
}

function checkColumn(cell, col) {
    let res = true;
    for (let i = 0; i < 3; i++) {
        res = res && (cell.textContent === cells[indexFromCoord(i, col)].textContent);
    }
    return res;
}

function checkPrimaryDiagonal(cell) {
    let res = true;
    for (let i = 0; i < 3; i++) {
        res = res && (cell.textContent === cells[indexFromCoord(i, i)].textContent);
    }
    return res;
}

function checkSecundaryDiagonal(cell) {
    let res = true;
    for (let i = 2, j = 0; i >= 0 && j < 3; i--, j++) {
        res = res && (cell.textContent === cells[indexFromCoord(i, j)].textContent);
    }
    return res;
}
