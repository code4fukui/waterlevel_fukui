import HTMLParser from "https://dev.jspm.io/node-html-parser";
import { Day } from "https://code4fukui.github.io/day-es/Day.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const parseTable = (tbl) => {
  const res = [];
  tbl.querySelectorAll("tr").forEach(tr => {
    const row = [];
    tr.querySelectorAll("th").forEach(th => {
      row.push(th.text.trim());
    })
    tr.querySelectorAll("td").forEach(td => {
      row.push(td.text.trim());
    })
    res.push(row);
  });
  return res;
};

const transpose = (ar) => {
  let max = ar.reduce((n, pre) => n < pre.length ? pre.length : n, 0);
  const res = new Array(max);
  for (let i = 0; i < max; i++) {
    const row = [];
    for (let j = 0; j < ar.length; j++) {
      row.push(ar[j][i]);
    }
    res.push(row);
  }
  return res;
};

const parseSiteInfo = (root) => {
  const d = parseTable(root.querySelector(".siteInfo"));
  const res = {};
  res[d[2][0]] = d[2][2];
  res[d[1][1]] = d[1][3];
  res[d[1][0]] = d[1][2];
  res[d[2][1]] = d[2][3];
  return res;
};
const parseControlPanel = (root) => {
  const d = parseTable(root.querySelector(".controlPanel"));
  const res = {};
  for (let i = 6; i < d.length; i++) {
    if (d[i].length < 2) {
      continue;
    }
    const n = d[i][2].match(/(.+)\(\s*(.+)m\)/);
    if (n) {
      res[n[1]] = n[2];
    }
  }
  return res;
};
const parseLog = (root) => {
  const d = parseTable(root.querySelector(".tablelog"));
  const date = new Date().getFullYear() + "/" + d[3][d[3].length - 2];
  const time = d[4][d[4].length - 1].replace("：", ":");
  const value = d[5][d[5].length - 1];
  const res = {};
  res["日付"] = new Day(date).toString();
  res["時間"] = time;
  res["水位"] = value;
  return res;
};

const parseDetail = (txt) => {
  const root = HTMLParser.parse(txt);
  const res = parseLog(root);
  Object.assign(res, parseSiteInfo(root));
  Object.assign(res, parseControlPanel(root));
  return res;
};

export { parseDetail };

/*
const txt = await Deno.readTextFile("b.html");
const data = parse(txt);
console.log(data);
*/
