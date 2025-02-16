window.addEventListener("load", () => {
    let car = document.getElementById("car");
    car.addEventListener("keydown"), (event) => {
        switch (event.key) {
            case "W":
                car.style.top = `${car.offsetTop - 10}px`;
                break;
        }
    }
  
});
