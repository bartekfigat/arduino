const btn = Array.from(document.getElementsByClassName("led"));

function switches(element, state) {
  fetch(`/led/?led=${state}&id=${element.attributes.id.value}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

btn.map((element) => {
  element.addEventListener("click", () => {
    if (element.checked) {
      switches(element, true);
    } else {
      switches(element, false);
    }
  });
});
