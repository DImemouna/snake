window.onload = function() {
  let canvasWidth = 900;
  let canvasHeight = 600;
  let blockSize = 30;
  let ctx;
  let delay = 200;
  let xCoord = 0;
  let yCoord = 0;
  let snakee;
  let applee;
  let widthInBlocks = canvasWidth / blockSize;
  let heightInBlocks = canvasHeight / blockSize;
  let score;
  let timeOut;

  init();
  changeCouleur();
  function changeCouleur() {
    let color = (document.getElementsByTagName(
      "body"
    )[0].style.backgroundImage = "url('feuille.jpeg')");
  }

  function init() {
    let canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "5px solid black";
    canvas.style.margin = "5px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "rgba(184, 241, 222, 0.162)";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
        [3, 4],
        [2, 4]
      ],
      "right"
    );
    applee = new Apple([10, 10]);
    score = 0;
    refreshCanvas();
  }

  function refreshCanvas() {
    snakee.advance();
    if (snakee.checkCollision()) {
      gameOver();
    } else {
      if (snakee.isEatingApple(applee)) {
        score++;
        snakee.ateApple = true;
        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(snakee));
        if (score % 5 == 0) {
          speedUp();
        }
      }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawScore();
      snakee.draw();
      applee.draw();
      timeOut = setTimeout(refreshCanvas, delay);
    }
  }
  function speedUp() {
    delay = delay / 2;
  }
  function gameOver() {
    ctx.save();
    ctx.font = " italic 4rem Times New Roman";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    let centreX = canvasWidth / 2;
    let centreY = canvasHeight / 2;
    ctx.strokeText("Game Over", centreX, centreY - 180);
    ctx.fillText("Game Over", centreX, centreY - 180);
    ctx.font = " 1.5rem Times New Roman";
    ctx.strokeText("Espace pour rejouer", centreX, centreY - 120);
    ctx.fillText("Espace pour rejouer", centreX, centreY - 120);
    ctx.restore();
  }

  function restart() {
    snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
        [3, 4],
        [2, 4]
      ],
      "right"
    );
    applee = new Apple([10, 10]);
    score = 0;
    delay = 200;
    clearTimeout(timeOut);
    refreshCanvas();
  }

  function drawScore() {
    ctx.save();
    ctx.font = "italic 200px Times New Roman";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let centreX = canvasWidth / 2;
    let centreY = canvasHeight / 2;
    ctx.fillText(score.toString(), centreX, centreY);
    ctx.restore();
  }

  function drawBlock(ctx, position) {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;

    this.draw = function() {
      ctx.save();
      ctx.fillStyle = "black";

      for (var i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]);
      }
      ctx.restore();
    };

    this.advance = function() {
      let nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          throw "invalid direction";
      }
      this.body.unshift(nextPosition);
      if (!this.ateApple) this.body.pop();
      else this.ateApple = false;
    };

    this.setDirection = function(newDirection) {
      var allowedDirections;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;
        case "down":
        case "up":
          allowedDirections = ["left", "right"];
          break;
        default:
          throw "invalid direction";
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        this.direction = newDirection;
      }
    };

    this.checkCollision = function() {
      let wallCollision = false;
      let snakeCollision = false;
      let head = this.body[0];
      let rest = this.body.slice(1);
      let snakeX = head[0];
      let snakeY = head[1];
      let minX = 0;
      let minY = 0;
      let maxX = widthInBlocks - 1;
      let maxY = heightInBlocks - 1;
      let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
        wallCollision = true;

      for (var i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1])
          snakeCollision = true;
      }

      return wallCollision || snakeCollision;
    };

    this.isEatingApple = function(appleToEat) {
      let head = this.body[0];
      if (
        head[0] === appleToEat.position[0] &&
        head[1] === appleToEat.position[1]
      )
        return true;
      else return false;
    };
  }

  function Apple(position) {
    this.position = position;

    this.draw = function() {
      ctx.save();
      ctx.fillStyle = "black";
      ctx.beginPath();
      let radius = blockSize / 2;
      let x = this.position[0] * blockSize + radius;
      let y = this.position[1] * blockSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    };

    this.setNewPosition = function() {
      let newX = Math.round(Math.random() * (widthInBlocks - 1));
      let newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };

    this.isOnSnake = function(snakeToCheck) {
      let isOnSnake = false;
      for (var i = 0; i < snakeToCheck.body.length; i++) {
        if (
          this.position[0] === snakeToCheck.body[i][0] &&
          this.position[1] === snakeToCheck.body[i][1]
        ) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    };
  }

  document.onkeydown = function handleKeyDown(e) {
    let key = e.keyCode;
    let newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        restart();
        return;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  };
};
