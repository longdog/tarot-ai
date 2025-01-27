import { ExplainFormated, ISpreadGen, ITarologist } from "./model";
import { makePrompt } from "./prompt";
import { ImgCard } from "./templates/Cards";
export const makeDailyCardService = (
  spredGen: ISpreadGen,
  tarologist: ITarologist,
  format:ExplainFormated
) => {
  const name = "Daily Card";
  const question = "What does fate have in store for me today?";
  const deckType = "MajorArkana";
  const selectCards = 1;

  const t = (str: string) => str;

  return async () => {
    const spread = await spredGen.makeSpread({
      name,
      question,
      deckType,
      selectCards,
    });

    const prompt = makePrompt(spread, t);
    const explanation = await tarologist.explain(prompt);
    const text = await format(explanation); 
    const card = (<ImgCard data={spread.cards[0]} t={t} />).toString();
    return {
      card,
      text,
    };
  };
};
