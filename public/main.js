const btn = document.getElementById("toggle2");
const socket = io();

btn.addEventListener("click", () => {
  if (btn.checked) {
    fetch(`https://guarded-meadow-49625.herokuapp.com/led/?led=${true}`).then(
      (res) => {
        res.json();
      }
    );
  } else {
    fetch(`https://guarded-meadow-49625.herokuapp.com/led/?led=${false}`).then(
      (res) => {
        res.json();
      }
    );
  }
});
