// Define the canvas and its context
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Define the size of each cell and the number of cells
var cellSize = 30;
var gridWidth = Math.floor(canvas.width / cellSize);
var gridHeight = Math.floor(canvas.height / cellSize);

// Initialize the snake's position and speed
var snake = [{ x: 120, y: 120 }];
var dx = cellSize;
var dy = 0;

// Initialize the food's position
var food = { x: 0, y: 0 };

// Generate random positions for the food
function generateFood() {
  food.x = Math.floor(Math.random() * gridWidth) * cellSize;
  food.y = Math.floor(Math.random() * gridHeight) * cellSize;
}

// Handle keyboard input
document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  var keyPressed = event.keyCode;
  if (keyPressed === 37 && dx !== cellSize) {
    // Left arrow key
    dx = -cellSize;
    dy = 0;
  } else if (keyPressed === 38 && dy !== cellSize) {
    // Up arrow key
    dx = 0;
    dy = -cellSize;
  } else if (keyPressed === 39 && dx !== -cellSize) {
    // Right arrow key
    dx = cellSize;
    dy = 0;
  } else if (keyPressed === 40 && dy !== -cellSize) {
    // Down arrow key
    dx = 0;
    dy = cellSize;
  }
}

// Check for collision with the food or the wall
function checkCollision() {
  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Check for collision with the food
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    generateFood();
  } else {
    snake.pop();
  }

  // Check for collision with the wall
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    clearInterval(game);
    document.removeEventListener("keydown", handleKeyPress); // Remove the event listener
    let playAgain = confirm("Game over! Your score is " + snake.length + ". Do you want to play again?");
    if (playAgain) {
      resetGame();
    }
  }

  // Check for collision with the snake's body
  for (var i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(game);
      document.removeEventListener("keydown", handleKeyPress); // Remove the event listener
      let playAgain = confirm("Game over! Your score is " + snake.length + ". Do you want to play again?");
      if (playAgain) {
        resetGame();
      }
    }
  }

  snake.unshift(head);
}

// Reset the game state
function resetGame() {
  location.reload();
}

// Update the game state and render the snake and food
function update() {
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  checkCollision();

  for (var i = 0; i < snake.length; i++) {
    var cell = snake[i];
    drawCell(cell.x, cell.y, "#00FF00"); // Green snake
  }

  drawCell(food.x, food.y, "#FF0000"); // Red apple
}

// Draw a single cell
function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, cellSize, cellSize);
}

// Start the game
generateFood();
var game = setInterval(update, 100);
