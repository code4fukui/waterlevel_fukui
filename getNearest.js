import { getDistance } from "https://js.sabae.cc/getDistance.js";
import { Day } from "https://code4fukui.github.io/day-es/Day.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { Geo3x3 } from "https://geo3x3.com/Geo3x3.js";

let sensors;

const getNearest = async (lat, lng) => {
  if (!sensors) {
    sensors = CSV.toJSON(await CSV.fetch("./sensors.csv"));
  }
  sensors.forEach(d => {
    const p = Geo3x3.decode(d.geo3x3);
    d.distance = getDistance(lat, lng, p.lat, p.lng);
  });
  sensors.sort((a, b) => a.distance - b.distance);
  //console.log(sensors);
  for (const sensor of sensors) {
    const data = CSV.toJSON(await CSV.fetch("https://code4fukui.github.io/waterlevel_fukui/data/" + new Day().toString() + ".csv")).reverse();
    const d = data.find(d => d.id == sensor.id);
    const res = {};
    Object.assign(res, sensor);
    Object.assign(res, d);
    return res;
  }
  return null;
};

export { getNearest };
