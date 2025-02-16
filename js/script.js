window.addEventListener("load", () => {
  go.addEventListener("click", () => {
    const username = document.getElementById("name");
    const age = document.getElementById("age");
    const color = document.getElementById("color");
    console.log(username.value, age.value, color.value);
    if ((username.value === "") || (age.value === "") || (color.value === "")){
      alert("Please make sure you have entered appropriate inputs");
    } else {
      window.location.href="game.html";
    }
  });
});





