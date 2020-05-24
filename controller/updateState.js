require("dotenv").config();
const Home = require("../models/Home");

const updateState = async (led, id, io) => {
  try {
    const agg = await Home.find(
      { lighting: { $elemMatch: { switch: id } } },
      { "lighting.$": 1 }
    );
    // console.log(`updateState: ${led}/:${id}`);

    const match = agg[0].lighting[0].switch;
    matchOne = match;

    if (match === id) {
      await Home.updateOne(
        {
          _id: `${process.env.id}`,
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
