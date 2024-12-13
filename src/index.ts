import { gigachatTarologist } from "./gigachat";
import { makeTranslation } from "./prompt";
import { makeSpreadGen } from "./spread";
import { testTarologist } from "./testchat";
import { tgService } from "./tgService";
import { makeWeb } from "./web";

export default makeWeb(
  makeSpreadGen(),
  // await gigachatTarologist(),
  await testTarologist(),
  await makeTranslation(),
  tgService()
);
