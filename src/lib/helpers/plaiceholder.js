import { getPlaiceholder } from "plaiceholder";

let getBase64 = async (url) => {
  try {
    let res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network response is not ok");
    }
    let buffer = await res.arrayBuffer();
    let { base64 } = await getPlaiceholder(Buffer.from(buffer));
    return base64;
  } catch (error) {
    console.log(error);
  }
};

export default getBase64;
