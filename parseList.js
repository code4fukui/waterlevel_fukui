import HTMLParser from "https://dev.jspm.io/node-html-parser";
import { Geo3x3 } from "https://geo3x3.com/Geo3x3.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

/*
  html += "    <td class='popKyoku' colspan='2' nowrap='nowrap'>" + myPop.getAttribute("na") + "</td>";
  html += "    <td class='popKyoku' colspan='2' nowrap='nowrap'>" + myPop.getAttribute("r_na") + "</td>";
  html += "    <td class='popName' nowrap='nowrap'>日時</td>";
  html += "    <td class='popData' nowrap='nowrap'>" + myPop.getAttribute("time") + "</td>";
  html += "    <td class='popName' nowrap='nowrap'>河川水位</td>";
  html += "    <td class='popData' nowrap='nowrap'>" + myPop.getAttribute("suii") + "</td>";
  html += "    <td class='popName' nowrap='nowrap'>水防団待機水位(通報水位)</td>";
  html += "    <td class='popData' nowrap='nowrap'>" + myPop.getAttribute("sitei") + "</td>";
  html += "    <td class='popName' nowrap='nowrap'>はん濫注意水位(警戒水位)</td>";
  html += "    <td class='popData' nowrap='nowrap'>" + myPop.getAttribute("keikai") + "</td>";
  html += "    <td class='popName' nowrap='nowrap'>避難判断水位(特別警戒水位)</td>";
  html += "    <td class='popData' nowrap='nowrap'>" + myPop.getAttribute("spkeikai") + "</td>";
  html += "    <td class='popName' nowrap='nowrap'>はん濫危険水位(危険水位)</td>";
  html += "    <td class='popData' nowrap='nowrap'>" + myPop.getAttribute("kiken") + "</td>";
  html += "    <td class='popName' nowrap='nowrap'>警報状態</td>";
  html += "    <td class='popData' nowrap='nowrap'>" + myPop.getAttribute("flag") + "</td>";
  */
const parseList = (txt) => {
  const root = HTMLParser.parse(txt);
  const data = root.querySelectorAll("#river_set div").map(div => {
    const a = div.attributes;
    //console.log(a);
    //Deno.exit(0);
    if (!a.na) {
      return null;
    }
    const p = (s) => {
      if (s == "---") {
        return "-";
      }
      if (s == "***[m]") {
        return "*";
      }
      const n = s.match(/(\d+\.\d+)/);
      if (!n) {
        throw new Error(s);
      }
      return n[1];
    }
    const pos = a.style.match(/left:(\d+)px;top:(\d+)px/);
    const ll = [
      /*
      [36.458197 - .2, 135.121321],
      [35.367722 - .2, 136.947154],
      */
      [35.471726413, 135.49042613], // 関屋川
      [35.873929392, 136.75262102], // 箱ケ瀬
    ];
    const map = [
      [32, 359], // 関屋川
      [538, 203], // 箱ケ瀬
    ];
    // 600px 450px
    const x = pos[1];
    const y = pos[2];
    const lat = ((y - map[0][1]) / (map[1][1] - map[0][1])) * (ll[1][0] - ll[0][0]) + ll[0][0];
    const lng = ((x - map[0][0]) / (map[1][0] - map[0][0])) * (ll[1][1] - ll[0][1]) + ll[0][1];
    const geo3x3 = Geo3x3.encode(lat, lng, 14);
    return {
      "id": a.id.substring(5),
      "観測所名": a.na,
      "河川名": a.r_na,
      "日時": new Date().getFullYear() + "-" + a.time.replace(/\//g, "-").replace("：", ":").replace(" ", "T"),
      "河川水位": p(a.suii),
      "水防団待機水位(通報水位)": p(a.sitei),
      "はん濫注意水位(警戒水位)": p(a.keikai),
      "避難判断水位(特別警戒水位)": p(a.spkeikai),
      "はん濫危険水位(危険水位)": p(a.kiken),
      "警報状態": a.flag,
      "geo3x3": geo3x3,
    };
  }).filter(div => div);
  return data;
};

export { parseList };

/*
const txt = await Deno.readTextFile("list.html");
const data = parseList(txt);
console.log(data);

const fn = "list.csv";
await Deno.writeTextFile(fn, CSV.encode(CSV.fromJSON(data)));
*/
