const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const config = require("../configurations/config");

const client = new MongoClient(config.DB_CONNECTION_URL);
const dbName = "instafood";
async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection1 = db.collection("food_items");
  const collection2 = db.collection("foodCategory");

  const findFood_item = await collection1.find({}).toArray();
  const findfoodCategory = await collection2.find({}).toArray();
  const findResult = { findFood_item, findfoodCategory };
  return findResult;
}

router.get("/displayfooddata", async (req, res) => {
  try {
    await main()
      .then((data) => {
        res.send({ payload: data });
      })
      .catch(console.error);
  } catch (err) {
    console.error(err.message);
    res.send("Server Error");
  }
});

module.exports = router;
