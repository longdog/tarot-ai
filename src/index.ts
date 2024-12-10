import { gigachatTarologist } from "./gigachat";
import { makeTranslation } from "./prompt";
import { makeSpreadGen } from "./spread";
import { makeWeb } from "./web";

export default makeWeb(
  makeSpreadGen(),
  await gigachatTarologist(),
  await makeTranslation()
);
