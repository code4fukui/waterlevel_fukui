import { SJIS } from "https://js.sabae.cc/SJIS.js";

const fetchSJIS = async (url) => {
  const bin = new Uint8Array(await (await fetch(url)).arrayBuffer());
  const txt = SJIS.decode(bin);
  return txt;
};

export { fetchSJIS };
