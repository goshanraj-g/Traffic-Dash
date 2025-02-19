window.addEventListener("load", () => {
  const go = document.getElementById("go");
  const username = document.getElementById("name");
  const age = document.getElementById("age");
  const color = document.getElementById("color");
  const body = document.body;
  const bodyRect = document.body.getBoundingClientRect();
  const car = document.getElementById("car");
  let carX = 0;
  let carY = 0;
  let velocityX = 0;
  let velocityY = 0;
  const acceleration = 0.2;
  const maxSpeed = 30;
  const friction = 0.9;

  document.querySelector(".game-page").style.display = "none";

  function initializeCarPosition() {
    const container = document.querySelector(".game-page");
    const containerRect = container.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    const roadRect = document
      .getElementById("road-container")
      .getBoundingClientRect();

    carX = containerRect.width - roadRect.width / 0.97;
    console.log("Initial carX:", carX);
    carY = containerRect.height - carRect.height;

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

    const leftBoundary =
      containerRect.left + (containerRect.width - (roadRect.width - 100)) / 2;
    const rightBoundary = leftBoundary + (roadRect.width - 100);

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

  const initialX = [
    bodyRect.width / 2 -25,
    bodyRect.width / 2 + 100,
    bodyRect.width / 2 - 180,
  ];

  function createTrafficNPCs() {
    const gameContainer = document.querySelector(".game-page");
    const roadContainer = document.getElementById("road-container");

    const cars = [
      "./images/traffic1.png",
      "./images/traffic2.png",
      "./images/traffic3.png",
      "./images/traffic4.png",
    ];
    const npcCars = [];

    const numberOfCars = 4;
    const minSpeed = 2;
    const maxSpeed = 6;

    for (let i = 0; i < numberOfCars; i++) {
      createNPCCar();
    }

    function createNPCCar() {
      const npcCar = document.createElement("img");
      const carModel = cars[Math.floor(Math.random() * cars.length)];
      npcCar.src = carModel;
      npcCar.classList.add("npcCar");

      roadContainer.appendChild(npcCar);

      const initialY = -200 - Math.random() * 500;
      const carSpeed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const carData = {
        element: npcCar,
        x: initialX[Math.floor(Math.random() * initialX.length)],
        y: initialY,
        speed: carSpeed,
      };
      npcCar.style.position = "absolute";
      npcCar.style.left = carData.x + "px";
      npcCar.style.top = carData.y + "px";
      npcCar.style.width = "80px";
      npcCar.style.zIndex = "5";
      npcCar.style.transform = "rotate(180deg)";

      npcCars.push(carData);

      return carData;
    }

    function updateTraffic() {
      const playerCar = document.getElementById("car");
      const playerRect = playerCar.getBoundingClientRect();

      npcCars.forEach((car) => {
        car.y += car.speed;
        car.element.style.top = car.y + "px";

        if (car.y > gameContainer.getBoundingClientRect().height + 100) {
          car.y = -200 - Math.random() * 500;
          car.x = initialX[Math.floor(Math.random() * initialX.length)];
          car.element.style.left = car.x + "px";
          car.element.style.top = car.y + "px";
        }
        const carRect = car.element.getBoundingClientRect();
        if (isColliding(playerRect, carRect)) {
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
    }

    updateTraffic();
  }
});
