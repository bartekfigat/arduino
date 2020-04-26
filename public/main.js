const btn = document.getElementById("toggle2");

alert("connect");

btn.addEventListener("click", () => {
  if (btn.checked) {
    fetch(`http://127.0.0.1:8080/led/?led=${true}`)
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
    fetch(`http://127.0.0.1:8080/led/?led=${false}`)
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
