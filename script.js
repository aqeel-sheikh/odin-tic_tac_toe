function gameBoard() {
  const board = [];
  for (let i = 0; i < 9; i++) {
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
      let rows = board
        .slice(i * 3, i * 3 + 3)
        .map((cell) => cell.getValue() || "_")
        .join("|");
      console.log(rows);
    }
  }

  return {
    getBoard,
    printBoard,
  };
}

function gameController() {
  playerOneName = "Player 1";
  playerTwoName = "Player 2";
  const board = gameBoard();

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

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
  const checkWinner = (board) => {
    for (let pattern of winPatterns) {
      const pos1val = board[pattern[0]].getValue();
      const pos2val = board[pattern[1]].getValue();
      const pos3val = board[pattern[2]].getValue();

      if (pos1val !== null && pos1val === pos2val && pos2val === pos3val) {
        return `${getActivePlayer().name} Won`;
      }
    }

    if (board.every((cell) => cell.getValue() !== null)) {
      return "Draw";
    }

    return;
  };
  const playRound = (cell) => {
    const currentBoard = board.getBoard();

    if (cell > currentBoard.length - 1) {
      console.log("Invalid cell");
      return;
    }
    if (currentBoard[cell].getValue() !== null) {
      console.log("Cell already taken");
      return;
    }
    
    currentBoard[cell].setValue(getActivePlayer().token);
    if (checkWinner(currentBoard)) {
      board.printBoard();
      console.log(checkWinner(currentBoard));
      return;
    }
    switchPlayerTurn();
    printNewRound()
  };

  printNewRound();

  return {
    playRound,
  };
}
const game = gameController();
// game.playRound(0);
// game.playRound(1);
// game.playRound(5);
// game.playRound(3);
// game.playRound(4);
// game.playRound(2);
// game.playRound(7);
// game.playRound(8);
// game.playRound(6);
