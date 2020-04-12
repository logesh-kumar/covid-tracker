var cron = require("node-cron");
const moment = require("moment");
const fetch = require("node-fetch");
const Covid = require("./src/Covid.model");
const CovidTracker = require("./src/CovidTracker.model");

let url = "https://pomber.github.io/covid19/timeseries.json";
let settings = { method: "Get" };

const insertData = async () => {
  let respose = await fetch(url, settings);
  let covidData = await respose.json();

  for (const key in covidData) {
    const covid = new Covid({
      countryName: key,
      cases:
        covidData[key] && covidData[key].length
          ? covidData[key].map(({ date, confirmed, deaths, recovered }) => ({
              date: moment(date, "YYYY-M-D").toDate(),
              dateString: date,
              confirmed,
              deaths,
              recovered,
            }))
          : [],
    });

    try {
      await covid.save();
    } catch (error) {
      console.log(error);
    }
  }
};

const insertCovidIndiaDistrictWaise = async () => {
  let respose = await fetch(
    "https://api.covid19india.org/state_district_wise.json",
    settings
  );
  let covidData = await respose.json();
  for (const key in covidData) {
  }
};

const insertCovidTravelHistory = async () => {
  let respose = await fetch(
    "https://api.covid19india.org/travel_history.json",
    settings
  );
  let covidData = await respose.json();
  covidData =
    covidData && covidData.travel_history ? covidData.travel_history : [];

  let latlong = "";

  covidData.forEach(async (c) => {
    latlong =
      c.latlong && c.latlong.split(",") ? c.latlong.split(",") : ["0.0", "0.0"];
    latlong = latlong.map(function (item) {
      return parseFloat(item.trim());
    });
    const covidTracker = new CovidTracker({
      location: {
        type: "Point",
        // Place longitude first, then latitude
        coordinates: latlong.reverse(),
      },
      accuracylocation: c.accuracylocation,
      address: c.address,
      datasource: c.datasource,
      latlong: c.latlong,
      modeoftravel: c.modeoftravel,
      pid: c.pid,
      placename: c.placename,
      timefrom: c.timefrom,
      timeto: c.timeto,
      type: c.type,
    });

    try {
      await covidTracker.save();
    } catch (error) {
      console.log(error);
    }
  });
};

cron.schedule("* * * * *", async () => {
  console.log("################STARTED INSERTING COVID DATA");
  //await insertData();
  console.log("################FINISHED INSERTING COVID DATA");
});

module.exports = {
  insertData,
  insertCovidTravelHistory,
};
