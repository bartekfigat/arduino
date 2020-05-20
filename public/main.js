const btn = Array.from(document.getElementsByClassName("led"));

const socket = io(); // TIP: io() with no args does auto-discovery

socket.on("client", (data) => {
  console.log(data);
});
async function switches(element, state) {
  await fetch(`/led/?led=${state}&id=${element.attributes.id.value}`, {
    method: "GET",
    mode: "cors",
  });
}

btn.map((element) => {
  element.addEventListener("click", () => {
    if (element.checked) {
      switches(element, true);
      socket.emit(
        "dataFromClient",
        `${element.attributes.id.value}`,
        `${true}`
      );
    } else {
      switches(element, false);
      socket.emit(
        "dataFromClient",
        `${element.attributes.id.value}`,
        `${false}`
      );
    }
  });
});
