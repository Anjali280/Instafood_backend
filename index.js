require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./utils/connectDB");
const config = require("./configurations/config");
app.use(express.json());
const CreateUserrouter = require("./router/CreateUser");
const DisplayDatarouter = require("./router/DisplayData");
const OrderDatarouter = require("./router/OrderData");

const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", CreateUserrouter);
app.use("/api", DisplayDatarouter);
app.use("/api", OrderDatarouter);

connectDB()
  .then(() => {
    console.log("Connected to database...");

    const port = config.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log("Error!! connecting database....");
    console.error(err.message);
  });
