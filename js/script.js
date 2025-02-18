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

  document.querySelector(".game-page").style.display = "none";

  function initializeCarPosition() {
    const container = document.querySelector(".game-page");
    const containerRect = container.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    const roadRect = document.getElementById("road-container").getBoundingClientRect();
 
    carX = containerRect.width - (roadRect.width)/0.97;
    console.log(carX);
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

      setTimeout(initializeCarPosition, 10); 
      car.focus();
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


    if (!(keys["ArrowLeft"] || keys["a"] || keys["A"] ||
      keys["ArrowRight"] || keys["d"] || keys["D"])) {
      velocityX *= friction;
    }

    carX += velocityX;

    const container = document.querySelector(".game-page");
    const containerRect = container.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    const roadRect = document.getElementById("road").getBoundingClientRect();

    const leftBoundary = containerRect.left + (containerRect.width - (roadRect.width-100))/2;
    const rightBoundary = leftBoundary + (roadRect.width-100);

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
});