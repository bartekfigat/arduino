const updatechangeStream = async (changeStream, num, isOne, relay, led, id) => {
  changeStream.on("change", (result) => {
    isOne = led === "true";

    switch (id) {
      case "kuchnia":
        num = 0;
        break;
      case "pokoj":
        num = 1;
        break;
      case "garaz":
        num = 2;
        break;
    }
    console.log("==================================================");
    console.log(
      `relay ID:${relay[num].id}  relay PIN:${relay[num].pin}  number:${num}`
    );
    console.log("==================================================");

    // setTimeout(function(){  }, 5000);

    if (isOne) {
      relay[num].open();
    } else {
      relay[num].close();
    }
  });
};

module.exports = {
  updatechangeStream,
};
