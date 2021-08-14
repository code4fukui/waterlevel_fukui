import { parseDetail } from "./parseDetail.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { fetchSJIS } from "./fetchSJIS.js";

/*
sn
http://ame.pref.fukui.jp/bousai/servlet/bousaiweb.servletBousaiGraph?unq=12171482154&sb2=1&mnflg=0&tmgo=&vo=0&mty=0&rk=1&og11=0&og10=0&og9=0&og8=0&og7=0&og6=0&og5=0&og4=0&og3=0&og2=0&og1=0&ost=0&omp=0&gm=0&go=0&gc=0&gw=0&gl=0&gn=0&gk5=0&gk4=0&gk3=0&gk2=0&gk1=0&gk=0&ga=4&sb=1&tk=0&tsw=0&tsk=0&it=0&st=0&cn=0&fn=0&tvm=0&vm=0&pg=1&sn=95&tm=000101010000&nw=1&no=0&mp=0&dk=2&sv=1&sb1=1&lod=0&nwg=1&tmg=202108140900&wsl=0&wl=1&rg=1&sy=gra_river
http://ame.pref.fukui.jp/bousai/servlet/bousaiweb.servletBousaiGraph?unq=12171482154&sb2=1&mnflg=0&tmgo=&vo=0&mty=0&rk=1&og11=0&og10=0&og9=0&og8=0&og7=0&og6=0&og5=0&og4=0&og3=0&og2=0&og1=0&ost=0&omp=0&gm=0&go=0&gc=0&gw=0&gl=0&gn=0&gk5=0&gk4=0&gk3=0&gk2=0&gk1=0&gk=0&ga=4&sb=1&tk=0&tsw=0&tsk=0&it=0&st=0&cn=0&fn=0&tvm=0&vm=0&pg=1&sn=124&tm=000101010000&nw=1&no=0&mp=0&dk=2&sv=1&sb1=1&lod=0&nwg=1&tmg=202108140900&wsl=0&wl=1&rg=1&sy=gra_river
http://ame.pref.fukui.jp/bousai/servlet/bousaiweb.servletBousaiGraph?unq=12171482154&sb2=1&mnflg=0&tmgo=&vo=0&mty=0&rk=1&og11=0&og10=0&og9=0&og8=0&og7=0&og6=0&og5=0&og4=0&og3=0&og2=0&og1=0&ost=0&omp=0&gm=0&go=0&gc=0&gw=0&gl=0&gn=0&gk5=0&gk4=0&gk3=0&gk2=0&gk1=0&gk=0&ga=4&sb=1&tk=0&tsw=0&tsk=0&it=0&st=0&cn=0&fn=0&tvm=0&vm=0&pg=1&sn=1&tm=000101010000&nw=1&no=0&mp=0&dk=2&sv=1&sb1=1&lod=0&nwg=1&tmg=202108140900&wsl=0&wl=1&rg=1&sy=gra_river
*/

const list = CSV.toJSON(await CSV.fetch("./list.csv"));
const res = [];
for (const d of list) {
  const id = d.id;
  const url = `http://ame.pref.fukui.jp/bousai/servlet/bousaiweb.servletBousaiGraph?unq=12171482154&sb2=1&mnflg=0&tmgo=&vo=0&mty=0&rk=1&og11=0&og10=0&og9=0&og8=0&og7=0&og6=0&og5=0&og4=0&og3=0&og2=0&og1=0&ost=0&omp=0&gm=0&go=0&gc=0&gw=0&gl=0&gn=0&gk5=0&gk4=0&gk3=0&gk2=0&gk1=0&gk=0&ga=4&sb=1&tk=0&tsw=0&tsk=0&it=0&st=0&cn=0&fn=0&tvm=0&vm=0&pg=1&sn=${id}&tm=000101010000&nw=1&no=0&mp=0&dk=2&sv=1&sb1=1&lod=0&nwg=1&tmg=202108140900&wsl=0&wl=1&rg=1&sy=gra_river`;
  const txt = await fetchSJIS(url);
  const data = parseDetail(txt);
  const d2 = { id };
  delete data.時間;
  delete data.水位;
  Object.assign(d2, data);
  d2.geo3x3 = d.geo3x3;
  d2.url = url;
  res.push(d2);
}
await Deno.writeTextFile("sensors.csv", CSV.encode(CSV.fromJSON(res)));
