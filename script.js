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

function gameController(p1, p2) {
  const board = gameBoard();

  const players = [
    {
      name: p1,
      token: "X",
      token_icon: "token-X.png",
    },
    {
      name: p2,
      token: "O",
      token_icon: "token-O.png",
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

  function checkWinner(myBoard) {
    for (let pattern of winPatterns) {
      const pos1val = myBoard[pattern[0]].getValue();
      const pos2val = myBoard[pattern[1]].getValue();
      const pos3val = myBoard[pattern[2]].getValue();

      if (pos1val !== null && pos1val === pos2val && pos2val === pos3val) {
        return `${getActivePlayer().name} Won.`;
      }
    }
    if (myBoard.every((cell) => cell.getValue() !== null)) {
      return "Draw";
    }
  }

  function displayCurrentPlayer(div, player) {
    div.textContent = `${player.name}'s turn`;
  }

  function playRound() {
    const currentBoard = board.getBoard();
    const cells = document.querySelectorAll(".cell");
    let gameOver = false;

    cells.forEach((currentCell, index) => {
      currentCell.addEventListener("click", () => {
        if (gameOver) return;
        if (currentBoard[index].getValue() !== null) return;

        const activePlayer = getActivePlayer();
        displayResult.textContent = `${activePlayer.name}'s turn`;
        currentBoard[index].setValue(activePlayer.token);

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
          gameOver = true;
          return;
        }
        switchPlayerTurn();
        displayCurrentPlayer(displayResult, getActivePlayer());
      });
    });
  }
  playRound();
}

const startBtn = document.querySelector("#start-btn");

function startGame() {
  const player1 = document.querySelector("#player1").value;
  const player2 = document.querySelector("#player2").value;
  if (player1 && player2) {
    displayResult.textContent = `${player1}'s turn`;
    gameController(player1, player2);
    startBtn.removeEventListener("click", startGame);
  } else {
    displayResult.textContent = "Please choose player name(s)";
  }
}
startBtn.addEventListener("click", startGame);
