import { CSV } from "https://js.sabae.cc/CSV.js";

const url = "https://www.pref.fukui.lg.jp/doc/dx-suishin/opendata/list_1_d/fil/suii_ichi.csv";
const data = await CSV.fetch(url);
await Deno.writeTextFile("suii_ichi.csv", CSV.encode(data));
