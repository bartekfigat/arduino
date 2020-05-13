const Home = require("../models/Home");

const updateState = async (led, id) => {
  try {
    const agg = await Home.find(
      { lighting: { $elemMatch: { switch: id } } },
      { "lighting.$": 1 }
    );

    const match = agg[0].lighting[0].switch;
    matchOne = match;

    if (match === id) {
      await Home.updateOne(
        {
          _id: "5eb5cdbb0ea7d8211d97e76e",
          lighting: { $elemMatch: { switch: id } },
        },
        { $set: { "lighting.$.state": led } }
      );
    } else {
      console.log("not ok");
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  updateState,
};
