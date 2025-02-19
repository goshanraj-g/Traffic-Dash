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
  const friction = 0.9;

  document.querySelector(".game-page").style.display = "none";

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

  // Initialize player's car position to the center lane.
  function initializeCarPosition() {
    const container = document.querySelector(".game-page");
    const containerRect = container.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    const lanes = getLanePositions();
    carX = lanes[1] - carRect.width / 2;
    carY = containerRect.height - carRect.height - 20;
    car.style.transform = `translate(${carX}px, ${carY}px)`;
  }

  go.addEventListener("click", () => {
    if (username.value === "" || age.value === "" || color.value === "") {
      alert("Please make sure you have entered appropriate inputs");
    } else {
      document.querySelector(".intro-box").style.display = "none";
      document.querySelector(".game-page").style.display = "flex";
      body.style.backgroundImage = "none";

      setTimeout(() => {
        createTrafficNPCs();
        car.focus();
      }, 10);

      setTimeout(initializeCarPosition, 10);
    }
  });

  const keys = {};
  document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  });
  document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });

  function update() {
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
      velocityX -= acceleration;
    }
    if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
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

    const container = document.querySelector(".game-page");
    const containerRect = container.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    const roadRect = document.getElementById("road").getBoundingClientRect();
    const roadLeft = (containerRect.width - roadRect.width) / 2;
    const leftBoundary = roadLeft + roadLeft*0.1;
    const rightBoundary = roadLeft + roadRect.width - roadLeft*0.1;

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

  const npcCars = [];

  function createTrafficNPCs() {
    const gameContainer = document.querySelector(".game-page");
    const roadContainer = document.getElementById("road-container");
    const carImages = [
      "./images/traffic1.png",
      "./images/traffic2.png",
      "./images/traffic3.png",
      "./images/traffic4.png",
    ];
    const numberOfCars = 4;
    const minSpeed = 2;
    const maxSpeed = 6;
    const lanes = getLanePositions();
    for (let i = 0; i < numberOfCars; i++) {
      createNPCCar();
    }

    function createNPCCar() {
      const npcCar = document.createElement("img");
      const carModel = carImages[Math.floor(Math.random() * carImages.length)];
      npcCar.src = carModel;
      npcCar.classList.add("npcCar");
      roadContainer.appendChild(npcCar);

      const initialY = -200 - Math.random() * 500;
      const carSpeed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const laneIndex = Math.floor(Math.random() * lanes.length);

      const carData = {
        element: npcCar,
        lane: laneIndex,
        y: initialY,
        speed: carSpeed,
      };

      npcCar.style.position = "absolute";
      npcCar.style.left = lanes[laneIndex] + "px";
      npcCar.style.top = carData.y + "px";
      npcCar.style.width = "80px";
      npcCar.style.zIndex = "5";

      npcCars.push(carData);
      return carData;
    }

    function updateTraffic() {
      const lanes = getLanePositions();
      const playerCar = document.getElementById("car");
      const playerRect = playerCar.getBoundingClientRect();
      const containerRect = gameContainer.getBoundingClientRect();

      npcCars.forEach((car) => {
        car.y += car.speed;
        car.element.style.top = car.y + "px";
        car.element.style.left = lanes[car.lane] + "px";

        if (car.y > containerRect.height + 100) {
          car.y = -200 - Math.random() * 500;
          car.lane = Math.floor(Math.random() * lanes.length);
          car.element.style.top = car.y + "px";
          car.element.style.left = lanes[car.lane] + "px";
        }
        const npcCarRect = car.element.getBoundingClientRect();
        if (isColliding(playerRect, npcCarRect)) {
          handleCollision(car);
        }
      });

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

    function handleCollision(car) {
      console.log("Collision detected with NPC car!", car);
      // Handle collision: you might want to end the game or subtract points here.
    }

    updateTraffic();
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
});
