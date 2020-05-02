const btn = document.getElementById("toggle2");
const socket = io();

btn.addEventListener("click", () => {
  if (btn.checked) {
    fetch(`https://guarded-meadow-49625.herokuapp.com/led/?led=${true}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  } else {
    fetch(`https://guarded-meadow-49625.herokuapp.com/led/?led=${false}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
});
