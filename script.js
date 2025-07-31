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

