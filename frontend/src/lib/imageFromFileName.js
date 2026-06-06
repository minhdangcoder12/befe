import kenobi1 from "../images/kenobi1.jpg";
import kenobi2 from "../images/kenobi2.jpg";
import kenobi3 from "../images/kenobi3.jpg";
import kenobi4 from "../images/kenobi4.jpg";
import ludgate1 from "../images/ludgate1.jpg";
import malcolm1 from "../images/malcolm1.jpg";
import malcolm2 from "../images/malcolm2.jpg";
import ouster from "../images/ouster.jpg";
import ripley1 from "../images/ripley1.jpg";
import ripley2 from "../images/ripley2.jpg";
import took1 from "../images/took1.jpg";
import took2 from "../images/took2.jpg";

const BY_FILE_NAME = {
  "kenobi1.jpg": kenobi1,
  "kenobi2.jpg": kenobi2,
  "kenobi3.jpg": kenobi3,
  "kenobi4.jpg": kenobi4,
  "ludgate1.jpg": ludgate1,
  "malcolm1.jpg": malcolm1,
  "malcolm2.jpg": malcolm2,
  "ouster.jpg": ouster,
  "ripley1.jpg": ripley1,
  "ripley2.jpg": ripley2,
  "took1.jpg": took1,
  "took2.jpg": took2,
};

const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

function imageUrlFromFileName(fileName) {
  if (!fileName) {
    return undefined;
  }
  return BY_FILE_NAME[fileName] || `${API_BASE}/images/${fileName}`;
}

export default imageUrlFromFileName;
