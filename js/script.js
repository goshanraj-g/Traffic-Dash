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
  const friction = 0.95;

  const speed = 3;

  document.querySelector(".game-page").style.display = "none";

  go.addEventListener("click", () => {
    if (username.value === "" || age.value === "" || color.value === "") {
      alert("Please make sure you have entered appropriate inputs");
    } else {
      document.querySelector(".intro-box").style.display = "none";

      document.querySelector(".game-page").style.display = "flex";

      body.style.backgroundImage = "none";
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
    if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
      velocityY -= acceleration;
    }
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
      velocityX -= acceleration;
    }
    if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
      velocityY += acceleration;
    }
    if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
      velocityX += acceleration;
    }

    velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, velocityX));
    velocityY = Math.max(-maxSpeed, Math.min(maxSpeed, velocityY));

    if (
      !(
        keys["ArrowUp"] ||
        keys["w"] ||
        keys["W"] ||
        keys["ArrowDown"] ||
        keys["s"] ||
        keys["S"]
      )
    ) {
      velocityY *= friction;
    }
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
    carY += velocityY;

    const container = document.querySelector(".game-page");
    const containerRect = container.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();

    if (carRect.left < containerRect.left) {
      carX += containerRect.left - carRect.left;
      velocityX = 0;
    }
    if (carRect.right > containerRect.right) {
      carX += containerRect.right - carRect.right;
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
