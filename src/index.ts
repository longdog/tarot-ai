import { sendPrompt } from "./gigachat"
import { GetRandomCardNumFn, GetRandomOrientationFn, makeDealer, makePrompt, matchDeck, Spread, SpreadResult } from "./model"


const getRandomNum = (len:number) => (len)*crypto.getRandomValues(new Uint32Array(1))[0]/2**32 | 0

const getRandomCardNum:GetRandomCardNumFn = (len:number) => Promise.resolve(getRandomNum(len))
const getRandomOrientation:GetRandomOrientationFn = () => Promise.resolve(getRandomNum(2) === 0 ? "Upright" : "Reversed")

const makeSpread = async (data:Spread): Promise<SpreadResult> => {
  const deck = matchDeck[data.deckType]
  const dealer = makeDealer(getRandomOrientation, getRandomCardNum)
  const hand = dealer(deck())
  const cards = (await Promise.all(Array.from({length:data.selectCards})
            .map(_=>hand.next())))
            .map(res=>res.done ? null : res.value)
            .filter(res => res !== null)
  return {
    name: data.name,
    question: data.question,
    cards
  }
}

(async()=>{
  const spread = await makeSpread({name: "Past, Present, Future", question: "I want to buy a house", deckType: "FullDeck", selectCards: 3})
  const prompt = makePrompt(spread, "Russian")
  console.log(prompt)
  const answer = await sendPrompt(prompt)
  console.log(answer);
})()