const canvas = $("#board").get(0);
const ctx = canvas.getContext("2d");

const cellSize = 100;
const map = Array(9).fill(0);
const winPatterns = [
  // Rows
  0b111000000, 0b000111000, 0b000000111,
  // Columns
  0b100100100, 0b010010010, 0b001001001,
  // Diagonals
  0b100010001, 0b001010100,
];

const markEnum = Object.freeze({
  BLANK: 0,
  X: 1,
  O: 2,
});
map[0] = markEnum.X;

canvas.width = 300;
canvas.height = 300;

class Coord {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function drawLine(canvasContext, from, to) {
  canvasContext.beginPath();
  canvasContext.moveTo(from.x, from.y);
  canvasContext.lineTo(to.x, to.y);
  canvasContext.stroke();
}

function getCellCoords(cellNum) {
  const x = (cellNum % 3) * cellSize;
  const y = Math.floor(cellNum / 3) * cellSize;

  return new Coord(x, y);
}

function draw() {
  function drawBoard() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;

    // Vertical lines
    drawLine(ctx, new Coord(cellSize, 0), new Coord(cellSize, canvas.height));
    drawLine(
      ctx,
      new Coord(cellSize * 2, 0),
      new Coord(cellSize * 2, canvas.height)
    );

    // Horizontal lines
    drawLine(ctx, new Coord(0, cellSize), new Coord(canvas.width, cellSize));
    drawLine(
      ctx,
      new Coord(0, cellSize * 2),
      new Coord(canvas.width, cellSize * 2)
    );
  }

  function drawX() {
    ctx.beginPath();
    drawLine(
      ctx,
      new Coord(-cellSize / 3, -cellSize / 3),
      new Coord(cellSize / 3, cellSize / 3)
    );
    drawLine(
      ctx,
      new Coord(-cellSize / 3, cellSize / 3),
      new Coord(cellSize / 3, -cellSize / 3)
    );
    ctx.stroke();
  }

  function drawMark(position) {
    switch (position) {
      case markEnum.X:
        drawX();
        break;
      default:
        break;
    }
  }

  function fillBoard() {
    for (let i = 0; i < map.length; i++) {
      const coords = getCellCoords(i);

      ctx.save();
      ctx.translate(coords.x + cellSize / 2, coords.y + cellSize / 2);
      drawMark(map[i]);
      ctx.restore();
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  fillBoard();
  requestAnimationFrame(draw);
}

draw();
