const mongoose = require("mongoose");

const covidIndiaSchema = new mongoose.Schema({
  state: String,
  districts: [
    {
      name: Number,
      confirmed: Number,
      lastupdatedtime: String,
    },
  ],
});

const CovidIndia = mongoose.model("CovidIndia", covidIndiaSchema);

module.exports = CovidIndia;
