let grid = document.querySelector(".grid");
const container = document.querySelector(".container");
const coverScreen = document.querySelector(".cover-screen");
const result = document.getElementById("result");
const overText = document.getElementById("over-text");
const styles = {
  2: { backgroundColor: "#eee4da", textColor: "black" },
  4: { backgroundColor: "#eee1c9", textColor: "black" },
  8: { backgroundColor: "#f3b27a", textColor: "white" },
  16: { backgroundColor: "#f69664", textColor: "white" },
  32: { backgroundColor: "#f77c5f", textColor: "white" },
  64: { backgroundColor: "#f75f3b", textColor: "white" },
  128: { backgroundColor: "#edd073", textColor: "white" },
  256: { backgroundColor: "#edcc63", textColor: "white" },
  512: { backgroundColor: "#edc651", textColor: "white" },
  1024: { backgroundColor: "#eec744", textColor: "white" },
  2048: { backgroundColor: "#ecc230", textColor: "white" },
};

let matrix,
  score,
  isSwiped,
  touchY,
  initialY = 0,
  touchX,
  initialX = 0,
  rows = 4,
  columns = 4,
  swipeDirection;

let rectLeft = grid.getBoundingClientRect().left;
let rectTop = grid.getBoundingClientRect().top;

const getXY = (e) => {
  touchX = e.touches[0].pageX - rectLeft;
  touchY = e.touches[0].pageY - rectTop;
};

const createGrid = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const canvas = document.createElement("canvas");
      canvas.classList.add("box");
      canvas.setAttribute("data-position", `${i}_${j}`);
      canvas.width = 100;
      canvas.height = 100;
      grid.appendChild(canvas);
    }
  }
};

const drawCanvas = (element, value) => {
  const canvas = element;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (styles[value]) {
    ctx.fillStyle = styles[value].backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = styles[value].textColor;
  }
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, canvas.width / 2, canvas.height / 2);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
};

const adjacentCheck = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] == arr[i + 1]) {
      return true;
    }
  }
  return false;
};

const possibleMovesCheck = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (matrix[i][j] === 0) {
        return true;
      }

      if (i > 0 && matrix[i - 1][j] === matrix[i][j]) {
        return true;
      }
      if (i < rows - 1 && matrix[i + 1][j] === matrix[i][j]) {
        return true;
      }
      if (j > 0 && matrix[i][j - 1] === matrix[i][j]) {
        return true;
      }
      if (j < columns - 1 && matrix[i][j + 1] === matrix[i][j]) {
        return true;
      }
    }
  }
  return false;
};

const hasEmptyBox = () => {
  for (let r in matrix) {
    for (let c in matrix[r]) {
      if (matrix[r][c] == 0) {
        return true;
      }
    }
  }
  return false;
};

const gameOverCheck = () => {
  if (!possibleMovesCheck()) {
    setTimeout(() => {
      coverScreen.classList.remove("hide");
      container.classList.add("hide");
      overText.classList.remove("hide");
      result.innerText = `Final score: ${score}`;
    }, 1500);
  }
};

const generateTile = (value) => {
  if (hasEmptyBox()) {
    let randomRow, randomCol;
    do {
      randomRow = Math.floor(Math.random() * matrix.length);
      randomCol = Math.floor(Math.random() * matrix[0].length);
    } while (matrix[randomRow][randomCol] !== 0);

    matrix[randomRow][randomCol] = value;
    drawCanvas(
      document.querySelector(`[data-position = '${randomRow}_${randomCol}']`),
      value
    );
    gameOverCheck();
  } else gameOverCheck();
};

const generateTwo = () => {
  generateTile(2);
};

const generateFour = () => {
  generateTile(4);
};

const removeZero = (arr) => arr.filter((num) => num);
const checker = (arr, reverseArr = false) => {
  arr = reverseArr ? removeZero(arr).reverse() : removeZero(arr);

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] == arr[i + 1]) {
      arr[i] += arr[i + 1];
      arr[i + 1] = 0;
      score += arr[i];
    }
  }

  arr = reverseArr ? removeZero(arr).reverse() : removeZero(arr);

  let missingCount = 4 - arr.length;
  while (missingCount > 0) {
    if (reverseArr) {
      arr.unshift(0);
    } else {
      arr.push(0);
    }
    missingCount -= 1;
  }
  return arr;
};

const updateCanvas = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const element = document.querySelector(`[data-position = '${i}_${j}']`);
      drawCanvas(element, matrix[i][j] || "");
      element.classList.value = "";
      element.classList.add("box", `box-${matrix[i][j]}`);
    }
  }
};

const slideDown = () => {
  for (let i = 0; i < columns; i++) {
    let num = [];
    for (let j = 0; j < rows; j++) {
      num.push(matrix[j][i]);
    }
    num = checker(num, true);
    for (let j = 0; j < rows; j++) {
      matrix[j][i] = num[j];
    }
  }

  let decision = Math.floor(Math.random() * 10);

  if (decision === 9) {
    setTimeout(generateFour, 200);
  } else {
    setTimeout(generateTwo, 200);
  }

  updateCanvas();
};

const slideUp = () => {
  for (let i = 0; i < columns; i++) {
    let num = [];
    for (let j = 0; j < rows; j++) {
      num.push(matrix[j][i]);
    }
    num = checker(num);
    for (let j = 0; j < rows; j++) {
      matrix[j][i] = num[j];
    }
  }

  let decision = Math.floor(Math.random() * 10);

  if (decision === 9) {
    setTimeout(generateFour, 200);
  } else {
    setTimeout(generateTwo, 200);
  }

  updateCanvas();
};

const slideRight = () => {
  for (let i = 0; i < rows; i++) {
    let num = [];
    for (let j = 0; j < columns; j++) {
      num.push(matrix[i][j]);
    }
    num = checker(num, true);
    for (let j = 0; j < columns; j++) {
      matrix[i][j] = num[j];
    }
  }

  let decision = Math.floor(Math.random() * 10);

  if (decision === 9) {
    setTimeout(generateFour, 200);
  } else {
    setTimeout(generateTwo, 200);
  }

  updateCanvas();
};

const slideLeft = () => {
  for (let i = 0; i < rows; i++) {
    let num = [];
    for (let j = 0; j < columns; j++) {
      num.push(matrix[i][j]);
    }

    num = checker(num);
    for (let j = 0; j < columns; j++) {
      matrix[i][j] = num[j];
    }
  }
  let decision = Math.floor(Math.random() * 10);
  if (decision === 9) {
    setTimeout(generateFour, 200);
  } else {
    setTimeout(generateTwo, 200);
  }

  updateCanvas();
};

document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    slideLeft();
  } else if (e.code == "ArrowRight") {
    slideRight();
  } else if (e.code == "ArrowUp") {
    slideUp();
  } else if (e.code == "ArrowDown") {
    slideDown();
  }
  document.getElementById("score").innerText = score;
});

grid.addEventListener("touchstart", (event) => {
  isSwiped = true;
  getXY(event);
  initialX = touchX;
  initialY = touchY;
});

grid.addEventListener("touchmove", (event) => {
  if (isSwiped) {
    getXY(event);
    let diffX = touchX - initialX;
    let diffY = touchY - initialY;
    if (Math.abs(diffY) > Math.abs(diffX)) {
      swipeDirection = diffX > 0 ? "down" : "up";
    } else {
      swipeDirection = diffX > 0 ? "right" : "left";
    }
  }
});

grid.addEventListener("touchend", () => {
  isSwiped = false;
  let swipeCalls = {
    up: slideUp,
    down: slideDown,
    left: slideLeft,
    right: slideRight,
  };
  swipeCalls[swipeDirection]();
  document.getElementById("score").innerText = score;
});

const startGame = () => {
  score = 0;
  document.getElementById("score").innerText = score;
  grid.innerHTML = "";
  matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  container.classList.remove("hide");
  coverScreen.classList.add("hide");
  createGrid();
  generateTwo();
  generateTwo();
};

startGame();
updateCanvas();
