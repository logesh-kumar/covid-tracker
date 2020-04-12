var cron = require("node-cron");
const moment = require("moment");
const fetch = require("node-fetch");
const Covid = require("./src/Covid.model");

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

cron.schedule("* * * * *", async () => {
  console.log("################STARTED INSERTING COVID DATA");
  //await insertData();
  console.log("################FINISHED INSERTING COVID DATA");
});

module.exports = {
  insertData,
};
