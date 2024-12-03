
// (async()=>{
//   const spread = await makeSpread({name: "Past, Present, Future", question: "Хочу купить машину", deckType: "MajorArkana", selectCards: 3})
//   const t = await makeTranslation()
//   const prompt = makePrompt(spread, t("ru"))
//   console.log(prompt)
//   const tarotologist = await gigachatTarologist()
//   const answer = await tarotologist.explain(prompt)
//   console.log(answer);
// })()

import { gigachatTarologist } from "./gigachat";
import { makeSpreadGen } from "./spread";
import { makeWeb } from "./web";

export default makeWeb(makeSpreadGen(), gigachatTarologist())