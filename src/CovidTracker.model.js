const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const CovidTrackerSchema = new mongoose.Schema({
  location: {
    type: pointSchema,
    required: true,
  },
  accuracylocation: String,
  address: String,
  datasource: String,
  lat: String,
  lng: String,
  modeoftravel: String,
  pid: String,
  placename: String,
  timefrom: String,
  timeto: String,
  type: String,
});

CovidTrackerSchema.index({ location: "2dsphere" });
const CovidTracker = mongoose.model("CovidTracker", CovidTrackerSchema);

module.exports = CovidTracker;
