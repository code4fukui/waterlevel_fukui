import { fetchSJIS } from "./fetchSJIS.js";
import { CSV } from "https://js.sabae.cc/CSV.js";


const fn = "data/2021-08-14.csv";
const list = CSV.toJSON(await CSV.fetch(fn));
const sensors = CSV.toJSON(await CSV.fetch("./sensors.csv"));

for await (const f of Deno.readDir("data2")) {
  console.log(f);
  const data = CSV.toJSON(await CSV.fetch("data2/" + f.name));

  //console.log(data);

  for (const d of data) {
    if (!d.id) {
      d.id = sensors.find(l => l.観測所名 == d.観測所名).id;
    }
    if (list.find(l => l.id == d.id && l.日時 == d.日時)) {
      continue;
    }
    const d2 = { 日時: d.日時, 河川水位: d.河川水位, id: d.id };
    list.push(d2);
  }
}
const compareWithString = (a, b) => a == b ? 0 : a > b ? 1 : -1;
list.sort((a, b) => compareWithString(a.日時, b.日時));
console.log(list);
await Deno.writeTextFile("remake.csv", CSV.encode(CSV.fromJSON(list)));
