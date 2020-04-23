const btn = document.getElementById("toggle2");

console.log(btn.checked);

btn.addEventListener("click", () => {
  if (btn.checked) {
    fetch(`http://localhost:3000/led/?led=${true}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { l } = data;
        console.log(l);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    fetch(`http://localhost:3000/led/?led=${false}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { l } = data;
        console.log(l);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
