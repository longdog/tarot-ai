import { makeDailyCardService } from "./dailyCardService";
import { gigachatTarologist } from "./gigachat";
import { groqTarologist } from "./groq";
import { htmlExplain } from "./htmlExplain";
import { ITarologist } from "./model";
import { makeSpreadGen } from "./spread";
import { testTarologist } from "./testchat";

const { AI_TYPE } = process.env;


const tarologists = {
  test: testTarologist,
  gigachat: gigachatTarologist,
  groq: groqTarologist,
} as const;

const makeTarologist = (type?: string): Promise<ITarologist> => {
  return tarologists[(type as keyof typeof tarologists) || "test"]();
};

await (makeDailyCardService(
      makeSpreadGen(), 
      await makeTarologist(AI_TYPE), 
      htmlExplain)
());