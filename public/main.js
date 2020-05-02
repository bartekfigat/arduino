const btn = document.getElementById("toggle2");
const socket = io();

btn.addEventListener("click", () => {
  if (btn.checked) {
    fetch(`/led/?led=${true}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  } else {
    fetch(`/led/?led=${false}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
});
