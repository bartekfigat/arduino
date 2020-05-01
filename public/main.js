const btn = document.getElementById("toggle2");

btn.addEventListener("click", () => {
  if (btn.checked) {
    fetch(`http://localhost:8080/led/?led=${true}`).then((res) => {
      res.json();
    });
  } else {
    fetch(`http://localhost:8080/led/?led=${false}`).then((res) => {
      res.json();
    });
  }
});
