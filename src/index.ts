import { gigachatTarologist } from "./gigachat.js"
import { GetRandomCardNumFn, GetRandomOrientationFn, makeDealer, matchDeck, Spread, SpreadResult } from "./model"
import { makePrompt, makeTranslation } from "./prompt.js"


const getRandomNum = (len:number) => (len)*crypto.getRandomValues(new Uint32Array(1))[0]/2**32 | 0

const getRandomCardNum:GetRandomCardNumFn = (len:number) => Promise.resolve(getRandomNum(len))
const getRandomOrientation:GetRandomOrientationFn = () => Promise.resolve(getRandomNum(2) === 0 ? "Upright" : "Reversed")

const makeSpread = async (data:Spread): Promise<SpreadResult> => {
  const deck = matchDeck[data.deckType]
  const dealer = makeDealer(getRandomOrientation, getRandomCardNum)
  const hand = dealer(deck(), data.selectCards)
  let cards = []
  for await (const card of hand) {
    cards.push(card)
  }
  return {
    name: data.name,
    question: data.question,
    cards
  }
}

(async()=>{
  const spread = await makeSpread({name: "Past, Present, Future", question: "Хочу купить машину", deckType: "MajorArkana", selectCards: 3})
  const t = await makeTranslation()
  const prompt = makePrompt(spread, t("ru"))
  console.log(prompt)
  const tarotologist = await gigachatTarologist()
  // const answer = await tarotologist.explain(prompt)
  // console.log(answer);
})()