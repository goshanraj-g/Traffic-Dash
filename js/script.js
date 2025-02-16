window.addEventListener("load", () => {
  go.addEventListener("click", () => {
    const username = document.getElementById("name");
    const age = document.getElementById("age");
    const color = document.getElementById("color");
    console.log(username.value, age.value, color.value);
    if( username.value ) && (age.value) && (color.value)
    window.location.href = "game.html";
  });
});





