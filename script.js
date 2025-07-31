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

  const playRound = (cell) => {
    const playBoard = board.getBoard();
    playBoard[cell].setValue(getActivePlayer().token);

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
  };
}
const game = gameController();
