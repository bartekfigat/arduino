const updatechangeStream = async (num, isOne, relay, clientLed, clientID) => {
  isOne = clientLed === "true";

  switch (clientID) {
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

  if (isOne) {
    relay[num].on();
  } else {
    relay[num].off();
  }
};

module.exports = {
  updatechangeStream,
};
