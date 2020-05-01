const btn = document.getElementById("toggle2");

btn.addEventListener("click", () => {
  if (btn.checked) {
    fetch(`/led/?led=${true}`)
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
    fetch(`/led/?led=${false}`)
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
