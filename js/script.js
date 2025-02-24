// Goshanraj Govindaraj 400569969
// Feburary 17 2025
// JavaScript Code for Logic

window.addEventListener("load", () => {
  const go = document.getElementById("go");
  const username = document.getElementById("name");
  const age = document.getElementById("age");
  const color = document.getElementById("color");
  const body = document.body;
  const car = document.getElementById("car");
  let carX = 0;
  let carY = 0;
  let velocityX = 0;
  let velocityY = 0;
  const acceleration = 0.2;
  const maxSpeed = 30;
  const friction = 0.85;

  // Game state variables
  let score = 0;
  let collisions = 0;
  let currentRound = 1;
  let npcCarSpeed = 3;
  let spawnDelay = 1500;
  let maxNPCCount = 4;
  let spawnInterval;
  let scoreInterval;
  const npcCars = [];

  document.querySelector(".game-page").style.display = "none";


  /**
   * Gets the position of each of the 3 lanes
   * @returns the specific position of each of the three lanes in the image
   */
  function getLanePositions() {
    const roadContainer = document.getElementById("road-container");
    const containerRect = roadContainer.getBoundingClientRect();
    const road = document.getElementById("road");
    const roadRect = road.getBoundingClientRect();
    const roadLeft = (containerRect.width - roadRect.width) / 2;
    const shift = roadRect.width * 0.05;
    const lane1 = roadLeft + roadRect.width * (1 / 6);
    const lane2 = roadLeft + roadRect.width * (1 / 2) - shift;
    const lane3 = roadLeft + roadRect.width * (5 / 6) - shift * 3;
    return [lane1, lane2, lane3];
  }

  /**
   * Calculates the starting position of the car, in order for the car to be spawned inside of a lane
   * @returns positions where the car can spawn, ensuring that it's on the road
   */
  function initializeCarPosition() {
    const container = document.querySelector(".game-page");
    const containerRect = container.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    const lanes = getLanePositions();
    carX = lanes[1] - carRect.width / 2;
    carY = containerRect.height - carRect.height - 20;
    car.style.transform = `translate(${carX}px, ${carY}px)`;
  }

  /**
   * Updates the scoreboard, from events such as score change, round number, and collision updates
   * @returns {string} Updated scoreboard
   */

  function updateScoreBoard() {
    const scoreBoard = document.getElementById("score-board");
    if (scoreBoard) {
      scoreBoard.innerText = `Score: ${score} | Round: ${getRoundName()} | Hits: ${collisions}/5`;
    }
  }

  /**
   * Starts the updating the score, adds one score every second
   * 
   */
  function startScoreUpdate() {
    scoreInterval = setInterval(() => {
      score++;
      checkRoundTransition();
      updateScoreBoard();
    }, 1000);
  }

  function updateBackgroundSpeed() {
    const road = document.getElementById("road");
    if (currentRound === 1) {
      road.style.animationDuration = "15s";
    } else if (currentRound === 2) {
      road.style.animationDuration = "10s";
    } else if (currentRound === 3) {
      road.style.animationDuration = "5s";
    }
  }

  function checkRoundTransition() {
    if (currentRound === 1 && score >= 10) {
      currentRound = 2;
      npcCarSpeed = 5;
      spawnDelay = 1000;
      maxNPCCount = 5;
      car.src = "images/bike.png";
      car.style.height = "15%";
      resetSpawnInterval();
      updateBackgroundSpeed();
    } else if (currentRound === 2 && score >= 40) {
      currentRound = 3;
      npcCarSpeed = 7;
      spawnDelay = 800;
      maxNPCCount = 6;
      resetSpawnInterval();
      updateBackgroundSpeed();
    }
  }

  function getRoundName() {
    if (currentRound === 1) return "Easy";
    if (currentRound === 2) return "Medium";
    if (currentRound === 3) return "Hard";
    return "";
  }

  function gameOver() {
    clearInterval(spawnInterval);
    clearInterval(scoreInterval);
    const gameOverScreen = document.getElementById("game-over-screen");
    const finalScoreEl = document.getElementById("final-score");
    finalScoreEl.innerText = `Final Score: ${score}`;
    gameOverScreen.style.display = "flex";
  }

  function restartGame() {
    window.location.reload();
  }

  function startGame() {
    document.getElementById("intro-box").style.display = "none";
    document.getElementById("game-over-screen").style.display = "none";
    document.querySelector(".game-page").style.display = "flex";
    body.style.backgroundImage = "none";

    const scoreBoard = document.getElementById("score-board");
    scoreBoard.style.color = color.value;
    updateScoreBoard();

    score = 0;
    collisions = 0;
    currentRound = 1;
    npcCarSpeed = 3;
    spawnDelay = 1500;
    maxNPCCount = 4;
    car.src = "images/car.png";

    startScoreUpdate();

    npcCars.length = 0;
    const roadContainer = document.getElementById("road-container");
    document.querySelectorAll(".npcCar").forEach((el) => el.remove());

    resetSpawnInterval();
    updateBackgroundSpeed();

    car.focus();
    setTimeout(initializeCarPosition, 10);
  }

  function createNPCCar() {
    const roadContainer = document.getElementById("road-container");
    const lanes = getLanePositions();
    const carImages = [
      "images/traffic1.png",
      "images/traffic2.png",
      "images/traffic3.png",
      "images/traffic4.png",
    ];

    const npcCar = document.createElement("img");
    const carModel = carImages[Math.floor(Math.random() * carImages.length)];
    npcCar.src = carModel;
    npcCar.classList.add("npcCar");
    npcCar.style.width = "80px";
    npcCar.style.position = "absolute";
    npcCar.style.zIndex = "5";

    const safePosition = findSafeSpawnPosition(lanes);
    if (!safePosition) {
      return null;
    }

    roadContainer.appendChild(npcCar);

    const carData = {
      element: npcCar,
      lane: safePosition.lane,
      y: safePosition.y,
      speed: npcCarSpeed,
      width: 80,
      height: 160,
    };

    npcCar.style.left = lanes[carData.lane] + "px";
    npcCar.style.top = carData.y + "px";

    npcCars.push(carData);
    return carData;
  }

  function findSafeSpawnPosition(lanes) {
    const minVerticalGap = 200;
    const spawnAttempts = 10;

    for (let attempt = 0; attempt < spawnAttempts; attempt++) {
      const laneIndex = Math.floor(Math.random() * lanes.length);
      let initialY = -200;

      const isSafe = npcCars.every((existingCar) => {
        if (existingCar.lane === laneIndex) {
          const verticalDistance = Math.abs(existingCar.y - initialY);
          return verticalDistance >= minVerticalGap;
        }
        return true;
      });

      if (isSafe) {
        return { lane: laneIndex, y: initialY };
      }

      initialY -= Math.random() * 300;
    }

    return null;
  }

  function resetSpawnInterval() {
    clearInterval(spawnInterval);
    spawnInterval = setInterval(() => {
      if (npcCars.length < maxNPCCount) {
        const newCar = createNPCCar();
        if (!newCar) {
          clearInterval(spawnInterval);
          setTimeout(() => resetSpawnInterval(), 500);
        }
      }
    }, spawnDelay);
  }

  function updateTraffic() {
    const gameContainer = document.querySelector(".game-page");
    const lanes = getLanePositions();
    const playerRect = car.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    for (let i = npcCars.length - 1; i >= 0; i--) {
      const carData = npcCars[i];

      carData.y += carData.speed;
      carData.element.style.top = carData.y + "px";

      if (carData.y > containerRect.height + 100) {
        carData.element.remove();
        npcCars.splice(i, 1);
        continue;
      }

      const npcCarRect = carData.element.getBoundingClientRect();
      if (isColliding(playerRect, npcCarRect)) {
        handleCollision(carData, i);
      }
    }

    requestAnimationFrame(updateTraffic);
  }

  function isColliding(rect1, rect2) {
    return !(
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right
    );
  }

  function handleCollision(carData, index) {
    collisions++;
    updateScoreBoard();
    if (collisions >= 5) {
      gameOver();
      return;
    }
    carData.element.remove();
    npcCars.splice(index, 1);
  }

  window.addEventListener("resize", () => {
    const carRect = car.getBoundingClientRect();
    const lanes = getLanePositions();
    const carCenter = carX + carRect.width / 2;
    let closestLane = lanes[0];
    let minDist = Math.abs(carCenter - lanes[0]);
    lanes.forEach((lane) => {
      const dist = Math.abs(carCenter - lane);
      if (dist < minDist) {
        minDist = dist;
        closestLane = lane;
      }
    });
    carX = closestLane - carRect.width / 2;
    car.style.transform = `translate(${carX}px, ${carY}px)`;
  });

  const keys = {};
  document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  });
  document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);
  document.addEventListener("touchmove", handleTouchMove);

  let touchDirection = null;
  let touchActive = false;

  function handleTouchStart(event) {
    if (event.touches.length > 0) {
      const touchX = event.touches[0].clientX;
      const screenWidth = window.innerWidth;

      if (touchX < screenWidth / 2) {
        touchDirection = "left";
        velocityX = -maxSpeed / 2;
      } else {
        touchDirection = "right";
        velocityX = maxSpeed / 2;
      }
      touchActive = true;
    }
  }

  function handleTouchMove(event) {
    if (event.touches.length > 0 && touchActive) {
      const touchX = event.touches[0].clientX;

      const screenWidth = window.innerWidth;

      if (touchX < screenWidth / 2) {
        touchDirection = "left";
        velocityX = -maxSpeed / 2;
      } else {
        touchDirection = "right";
        velocityX = maxSpeed / 2;
      }

    }
  }

  function handleTouchEnd(event) {
    touchActive = false;
    touchDirection = null;
    velocityX = 0;
  }

  function update() {
    if (keys["ArrowLeft"] || keys["a"] || keys["A"] || touchDirection === "left") {
      velocityX -= acceleration;
    }
    if (keys["ArrowRight"] || keys["d"] || keys["D"] || touchDirection === "right") {
      velocityX += acceleration;
    }
    velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, velocityX));
    velocityY = Math.max(-maxSpeed, Math.min(maxSpeed, velocityY));
    if (
      !(
        keys["ArrowLeft"] ||
        keys["a"] ||
        keys["A"] ||
        keys["ArrowRight"] ||
        keys["d"] ||
        keys["D"]
      )
    ) {
      velocityX *= friction;
    }
    carX += velocityX;
    const containerRect = document
      .querySelector(".game-page")
      .getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    const roadRect = document.getElementById("road").getBoundingClientRect();
    const roadLeft = (containerRect.width - roadRect.width) / 2;
    const leftBoundary = roadLeft + roadLeft * 0.1;
    const rightBoundary = roadLeft + roadRect.width - roadLeft * 0.1;
    if (carRect.left < leftBoundary) {
      carX += leftBoundary - carRect.left;
      velocityX = 0;
    }
    if (carRect.right > rightBoundary) {
      carX += rightBoundary - carRect.right;
      velocityX = 0;
    }
    if (carRect.top < containerRect.top) {
      carY += containerRect.top - carRect.top;
      velocityY = 0;
    }
    if (carRect.bottom > containerRect.bottom) {
      carY += containerRect.bottom - carRect.bottom;
      velocityY = 0;
    }
    car.style.transform = `translate(${carX}px, ${carY}px)`;
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  go.addEventListener("click", () => {
    if (username.value === "" || age.value === "" || color.value === "") {
      let errorMsg = document.getElementById("error-message");
      if (!errorMsg) {
        errorMsg = document.createElement("div");
        errorMsg.id = "error-message";
        errorMsg.style.color = "red";
        errorMsg.style.marginTop = "10px";
        document.querySelector(".intro-box").appendChild(errorMsg);
      }
      errorMsg.innerText =
        "Please make sure you have entered appropriate inputs";
      errorMsg.style.color = "red";
    } else {
      const errorMsg = document.getElementById("error-message");
      if (errorMsg) errorMsg.remove();
      document.getElementById("intro-box").style.display = "none";
      document.getElementById("instructions-overlay").style.display = "flex";
    }
  });

  document.getElementById("instructions-ok").addEventListener("click", () => {
    document.getElementById("instructions-overlay").style.display = "none";
    startGame();
  });

  document.getElementById("restart-btn").addEventListener("click", () => {
    restartGame();
  });

  updateTraffic();
});
