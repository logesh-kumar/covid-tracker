const express = require("express");
const app = express();
const cors = require("cors");
const cronTask = require("./cron");
const connectDb = require("./src/connection");
const User = require("./src/User.model");
const Covid = require("./src/Covid.model");
app.use(cors());
const PORT = 5000;

app.get("/users", async (req, res) => {
  const users = await User.find();

  res.json(users);
});

app.get("/user-create", async (req, res) => {
  const user = new User({ username: "userTest" });

  await user.save().then(() => console.log("User created"));

  res.send("User created \n");
});

app.get("/cron", async (req, res) => {
  await Covid.remove({});
  await cronTask.insertData();
  res.send("Data imported \n");
});

app.get("/covid/:country", async (req, res) => {
  const response = await Covid.find({
    countryName: req.params.country,
  });
  res.status(200).json(response);
});

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`);

  connectDb().then(() => {
    console.log("MongoDb connected");
  });
});
