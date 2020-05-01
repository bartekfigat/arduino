const btn = document.getElementById("toggle2");

btn.addEventListener("click", () => {
  if (btn.checked) {
    fetch(`https://guarded-meadow-49625.herokuapp.com/led/?led=${true}`)
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
    fetch(`https://guarded-meadow-49625.herokuapp.com/led/?led=${false}`)
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
