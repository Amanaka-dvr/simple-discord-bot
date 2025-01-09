import { sendAD } from "./http/advertise.js";
import { resetOmikuji } from "./text/umamusume/omikuji.js";

async function wakeEvent() {
  sendAD();
  resetOmikuji();
}

export { wakeEvent };