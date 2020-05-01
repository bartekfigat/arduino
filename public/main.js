const btn = document.getElementById("toggle2");

btn.addEventListener("click", () => {
  if (btn.checked) {
    fetch(`/led/?led=${true}`).then((res) => {
      res.json();
    });
  } else {
    fetch(`/led/?led=${false}`).then((res) => {
      res.json();
    });
  }
});
