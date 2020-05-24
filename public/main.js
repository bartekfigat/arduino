const btn = Array.from(document.getElementsByClassName("led"));

pubnub = new PubNub({
  publishKey: "pub-c-603786a3-1528-4e67-8707-c1bb35b6d3ac",
  subscribeKey: "sub-c-942deb3a-9bd1-11ea-8e2f-c62edd1c297d",
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
    } else {
      switches(element, false);
    }
  });
});
