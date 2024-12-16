import { gigachatTarologist } from "./gigachat";
import { groqTarologist } from "./groq";
import { ITarologist } from "./model";
import { makeTranslation } from "./prompt";
import { makeSpreadGen } from "./spread";
import { testTarologist } from "./testchat";
import { tgService } from "./tgService";
import { makeWeb } from "./web";

const { AI_TYPE, PRICE } = process.env;

const makePrice = (price?: string): number => (price ? Number(price) : 50);

const tarologists = {
  test: testTarologist,
  gigachat: gigachatTarologist,
  groq: groqTarologist,
} as const;

const makeTarologist = (type?: string): Promise<ITarologist> => {
  return tarologists[(type as keyof typeof tarologists) || "test"]();
};

const ts = await makeTranslation();
export default makeWeb(
  makeSpreadGen(),
  await makeTarologist(AI_TYPE),
  ts,
  tgService(ts),
  makePrice(PRICE)
);
