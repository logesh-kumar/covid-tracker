const express = require("express");
const app = express();
const cors = require("cors");
const cronTask = require("./cron");
const connectDb = require("./src/connection");
const User = require("./src/User.model");
const Covid = require("./src/Covid.model");
const CovidTracker = require("./src/CovidTracker.model");
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

app.get("/covidth", async (req, res) => {
  await CovidTracker.remove({});
  await cronTask.insertCovidTravelHistory();
  res.send("Data imported \n");
});

app.get("/covid/:country", async (req, res) => {
  const response = await Covid.find({
    countryName: req.params.country,
  });
  res.status(200).json(response);
});

app.get("/covid/nearme/:long/:latt", async (req, res) => {
  console.log(parseFloat(req.params.long), parseFloat(req.params.latt));
  let response = null;
  try {
    response = await CovidTracker.find({
      location: {
        $near: {
          $maxDistance: 1000,
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(req.params.long),
              parseFloat(req.params.latt),
            ],
          },
        },
      },
    });
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
});

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`);

  connectDb().then(() => {
    console.log("MongoDb connected");
  });
});
