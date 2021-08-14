import { parseDetail } from "./parseDetail.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { Geo3x3 } from "https://geo3x3.com/Geo3x3.js";

const list = CSV.toJSON(await CSV.fetch("./suii_ichi.csv"));
list.forEach(l => l.id = l.URL ? l.URL.match(/sn=(\d+)&/)[1] : "");
console.log(list);
//Deno.exit(0);

const sensors = CSV.toJSON(await CSV.fetch("./sensors.csv"));
for (const d of sensors) {
  //console.log(d);
  const p = list.find(l => l.id == d.id);
  if (p) {
    //const pos = list.find(s => s.観測所名 == d.観測所名);
    //console.log(d.観測所名, pos);
    //console.log(p);
    const dms2d = (d, m, s) => {
      const p = (s) => parseFloat(s);
      return p(d) + p(m) / 60 + p(s) / (60 * 60);
    }
    const lat = dms2d(p["緯度(度)"], p["緯度(分)"], p["緯度(秒)"]);
    const lng = dms2d(p["経度(度)"], p["経度(分)"], p["経度(秒)"]);
    const geo3x3 = Geo3x3.encode(lat, lng, 16);
    console.log(d.geo3x3, geo3x3);
    d.geo3x3 = geo3x3;
  } else {
    const s = d.観測所名 + " has no id";
    console.log(s);
    //throw new Error(s);
  }
  d.url = `http://ame.pref.fukui.jp/bousai/servlet/bousaiweb.servletBousaiGraph?rg=1&sn=${d.id}&sy=gra_river`;
}
await Deno.writeTextFile("sensors.csv", CSV.encode(CSV.fromJSON(sensors)));
