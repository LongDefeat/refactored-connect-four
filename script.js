/* ========GLOBAL VARIABLES========*/
let gameIsRunning = true;

/* ========SPRINGBOARD/MY CLASSES======== */

class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.players = [p1, p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops.  */

  makeHtmlBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    // store a reference to the handleClick bound function
    // so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this);

    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML board */

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
  }

  handleClick(evt) {
    // gets x from ID of clicked cell
    // remember this is an easier way to use parseInt
    const x = +evt.target.id;

    // finds next spot in column (if none, then returns nothing)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    // places piece in board and adds to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!!!");
    }

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      gameIsRunning = false;
      return this.endGame(`The ${this.currPlayer} wins the game!`);
    }
    // switch players
    function switchPlayer() {
      let soonToBeCurrPlayer = currPlayer === 1 ? 2 : 1;
      let playerText = document.querySelector(".curr-player");
      playerText.querySelector(".curr-player-number").textContent =
        //this employs one of the players 1 or 2
        soonToBeCurrPlayer;
      playerText.classList.remove(`player-1`);
      playerText.classList.remove(`player-2`);
      // allows for 1 or 2 to be switched in the player turn box
      playerText.classList.add(`player-${soonToBeCurrPlayer}`);
      currPlayer = soonToBeCurrPlayer;
    }
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

document.querySelector("#start-game").addEventListener("click", () => {
  let p1 = new Player(document.querySelector("#p1-color").value);
  let p2 = new Player(document.querySelector("#p2-color").value);
  new Game(p1, p2);
});
