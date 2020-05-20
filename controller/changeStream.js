const updatechangeStream = async (num, isOne, relay, led, id, io) => {
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
    default:
      console.log(`Sorry, we are out of ${id}.`);
  }
  // console.log("==================================================");
  // console.log(`id:--------->${id}`);
  // console.log(`led:-------->${led}`);
  // console.log(`relay PIN:-->${relay[num].pin}`);
  // console.log(`number:----->${num}`);
  // console.log("==================================================");

  // setTimeout(function(){  }, 5000);

  if (isOne) {
    relay[num].on();
  } else {
    relay[num].off();
  }
};

module.exports = {
  updatechangeStream,
};
