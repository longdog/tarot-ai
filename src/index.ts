import { gigachatTarologist } from "./gigachat";
import { ITarologist } from "./model";
import { makeTranslation } from "./prompt";
import { makeSpreadGen } from "./spread";
import { testTarologist } from "./testchat";
import { tgService } from "./tgService";
import { makeWeb } from "./web";


const {AI_TYPE} = process.env;

const tarologists = {
  test: testTarologist,
  gigachat: gigachatTarologist
} as const

const makeTarologist = (type?:string):Promise<ITarologist> => {
  return tarologists[type as keyof typeof tarologists || "test"]()
}

export default makeWeb(
  makeSpreadGen(),
  await makeTarologist(AI_TYPE),
  await makeTranslation(),
  tgService()
);
