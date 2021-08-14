import { fetchSJIS } from "./fetchSJIS.js";
import { parseList } from "./parseList.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { sleep } from "https://js.sabae.cc/sleep.js";

const getUniqueValue = () => {
  const d = new Date();
  const z = (n) => n < 10 ? "0" + n : n;
  return "" + d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate()) + z(d.getHours()) + z(d.getMinutes()) + z(d.getSeconds());
}

const download = async () => {
  const url = "http://ame.pref.fukui.jp/bousai/servlet/bousaiweb.servletBousaiMap?lod=0&sb1=1&mp=0&no=0&fn=0&sv=1&dk=2&mp=0&no=0&nw=1&tm=000101010000&sn=0&pg=1&vm=0&tvm=0&fn=0&cn=0&st=0&it=0&tsk=0&tsw=0&tk=0&sb=1&ga=4&gk=0&gk1=0&gk2=0&gk3=0&gk4=0&gk5=0&gn=0&gl=0&gw=0&gc=0&go=0&gm=0&omp=0&ost=0&og1=0&og2=0&og3=0&og4=0&og5=0&og6=0&og7=0&og8=0&og9=0&og10=0&og11=0&rk=1&mty=0&vo=0&tmgo=&mnflg=0&sb2=1&unq=" + getUniqueValue();
  const txt = await fetchSJIS(url);
  //console.log(txt);
  //await Deno.writeTextFile("list.html", txt);

  const data = parseList(txt);

  const fn = "data/" + data[0].日時.substring(0, 10) + ".csv";
  const list = await (async () => {
    try {
      return CSV.toJSON(await CSV.fetch(fn));
    } catch (e) {
    }
    return [];
  })();

  for (const d of data) {
    if (list.find(l => l.id == d.id && l.日時 == d.日時)) {
      continue;
    }
    const d2 = { 日時: d.日時, 河川水位: d.河川水位, id: d.id };
    list.push(d2);
  }

  await Deno.writeTextFile(fn, CSV.encode(CSV.fromJSON(list)));
};

/*
for (;;) {
  await download();
  await sleep(60 * 1000);
}
*/
await download();
