const mongoose = require("mongoose");

const covidSchema = new mongoose.Schema({
  countryName: {
    type: String,
  },
  cases: [
    {
      date: Date,
      dateString: String,
      confirmed: Number,
      deaths: Number,
      recovered: Number,
    },
  ],
});

const Covid = mongoose.model("Covid", covidSchema);

module.exports = Covid;
