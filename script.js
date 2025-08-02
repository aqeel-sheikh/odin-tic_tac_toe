function gameBoard() {
  let board = [];
  const totalCells = 9;
  for (let i = 0; i < totalCells; i++) {
    board[i] = Cell();
  }

  const getBoard = () => board;

  function Cell() {
    let value = null;
    return {
      getValue: () => value,
      setValue: (newValue) => {
        if (value === null) {
          value = newValue;
        }
      },
    };
  }

  function printBoard() {
    for (let i = 0; i < 3; i++) {
      let grid = board
        .map((cell) => cell.getValue() || "_")
        .slice(i * 3, i * 3 + 3)
        .join("|");
      console.log(grid);
    }
  }
  return {
    getBoard,
    printBoard,
  };
}
const displayResult = document.querySelector(".result");
const startBtn = document.querySelector("#start-btn");
const resetBtn = document.querySelector("#reset-btn");
const rematchBtn = document.querySelector("#play-again-btn");
const playerSetup = document.querySelector(".player-setup");
const gameContainer = document.querySelector(".game-container");
const displayPlayer1Name = document.querySelector("#player1-name");
const displayPlayer2Name = document.querySelector("#player2-name");
const displayPlayer1score = document.querySelector("#player1-score");
const displayPlayer2score = document.querySelector("#player2-score");

function gameController(p1, p2) {
  let board = gameBoard();

  let players = [
    {
      name: p1,
      token: "X",
      token_icon: "token-X.png",
      score: 0,
    },
    {
      name: p2,
      token: "O",
      token_icon: "token-O.png",
      score: 0,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const winPatterns = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6], // diagonal top-right to bottom-left
  ];
  let player1score = players[0].score;
  let player2score = players[1].score;

  function checkWinner(myBoard) {
    for (let pattern of winPatterns) {
      const pos1val = myBoard[pattern[0]].getValue();
      const pos2val = myBoard[pattern[1]].getValue();
      const pos3val = myBoard[pattern[2]].getValue();

      if (pos1val !== null && pos1val === pos2val && pos2val === pos3val) {
        if (getActivePlayer() === players[0]) {
          player1score++;
        } else {
          player2score++;
        }
        return `${getActivePlayer().name} Won.`;
      }
    }
    // players[0].score = player1score;
    // players[1].score = player2score;
    if (myBoard.every((cell) => cell.getValue() !== null)) {
      return "Draw";
    }
  }

  function displayCurrentPlayer(div, player) {
    div.textContent = `${player.name}'s turn`;
  }

  let gameOver = false;
  const cells = document.querySelectorAll(".cell");

  function playRound() {
    cells.forEach((currentCell, index) => {
      currentCell.addEventListener("click", () => playGame(currentCell, index));
    });
  }

  resetBtn.addEventListener("click", reset);
  rematchBtn.addEventListener("click", rematch);

  function playGame(currentCell, i) {
    const currentBoard = board.getBoard();
    if (gameOver) return;
    if (currentBoard[i].getValue() !== null) return;

    let activePlayer = getActivePlayer();
    displayResult.textContent = `${activePlayer.name}'s turn`;
    currentBoard[i].setValue(activePlayer.token);

    const img = document.createElement("img");
    img.src = activePlayer.token_icon;
    // Prevent image duplications
    let imageExists = false;
    const existingImage = currentCell.querySelectorAll("img");
    for (let i = 0; i < existingImage.length; i++) {
      if (existingImage[i].src === img.src) {
        imageExists = true;
        break;
      }
    }
    if (!imageExists) {
      currentCell.appendChild(img);
    }

    let results = checkWinner(currentBoard);
    board.printBoard();

    if (results) {
      displayResult.textContent = results;
      displayPlayer1score.textContent = player1score;
      displayPlayer2score.textContent = player2score;
      console.log(player1score);
      console.log(player2score);
      gameOver = true;
      return;
    }
    switchPlayerTurn();
    displayCurrentPlayer(displayResult, getActivePlayer());
  }
  function reset() {
    const inputFields = document.querySelectorAll(".player");
    startBtn.addEventListener("click", startGame);
    displayResult.textContent = "";
    clearInputFields(inputFields);
    clearCells(cells);
    activePlayer = players[0];
    board = gameBoard();
    gameOver = true;
    resetBtn.removeEventListener("click", reset);
    toggleHideElements(gameContainer);
    toggleHideElements(playerSetup);
  }
  function rematch() {
    board = gameBoard();
    clearCells(cells);
    activePlayer = players[0];
    gameOver = false;
    cells.forEach((currentCell, index) => {
      currentCell.addEventListener("click", () => playGame(currentCell, index));
    });
  }
  function clearCells(parentNode) {
    parentNode.forEach((cell) => {
      const img = cell.querySelector("img");
      if (img) {
        img.remove();
      }
    });
  }
  function clearInputFields(inputField) {
    inputField.forEach((field) => {
      if (field.value) {
        field.value = "";
      }
    });
  }

  playRound();
}
const message = document.querySelector(".enter-name");

function startGame() {
  const player1Name = document.querySelector("#player1").value;
  const player2Name = document.querySelector("#player2").value;
  if (player1Name && player2Name) {
    displayResult.textContent = `${player1Name}'s turn`;
    displayPlayer1Name.textContent = player1Name + ":";
    displayPlayer2Name.textContent = player2Name + ":";
    gameController(player1Name, player2Name);
    startBtn.removeEventListener("click", startGame);
    toggleHideElements(gameContainer);
    toggleHideElements(playerSetup);
  } else {
    message.textContent = "Please choose player name(s)";
  }
}

startBtn.addEventListener("click", startGame);

document.addEventListener("DOMContentLoaded", () =>
  toggleHideElements(gameContainer)
);

function toggleHideElements(container) {
  container.classList.toggle("hidden");
}
