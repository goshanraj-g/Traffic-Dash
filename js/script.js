window.addEventListener("load", () => {
  const go = document.getElementById("go");
  const username = document.getElementById("name");
  const age = document.getElementById("age");
  const color = document.getElementById("color");
  const body = document.body;
  const car = document.getElementById("car");
  let carX = 0;
  let carY = 0;
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

  document.addEventListener("keydown", (event) =>{
    keys[event.key] = true;
  });

  document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  })

  function update() {
    if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
      carY -= speed;
    }

    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
      carX -= speed;
    }

    if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
      carY += speed;
    }

    if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
      carX += speed;
    }

    car.style.transform = `translate(${carX}px, ${carY}px)`;

    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  });;
