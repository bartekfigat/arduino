const btn = Array.from(document.getElementsByClassName("led"));

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
    } else {
      switches(element, false);
    }
  });
});

// <%= relay.forEach(element => { %>
//   <li><%=element.id%></li>
//  <% }); %>
