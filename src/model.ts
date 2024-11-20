
export type Orientation = "Upright" | "Reversed"


export const minorSuit = [
  "Cups",
  "Pentacles",
  "Swords",
  "Wands",
] as const

export const minorRank = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "Page", "Knight", "Queen", "King"
] as const

export type MinorSuit = typeof minorSuit[number]

export type MinorRank = typeof minorRank[number]

export type MinorArkana = {
  rank: MinorRank
  suit: MinorSuit
}

export const majorArkana = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World"
] as const

export type MajorArkana = typeof majorArkana[number] 

export type MajorArkanaCard = {
  type: "MajorArkana"
  value: MajorArkana
}

export type MinorArkanaCard = {
  type: "MinorArkana"
  value: MinorArkana
}


export type DeckType = "MajorArkana" | "MinorArkana" | "FullDeck"

export type TarotCard = 
 | MinorArkanaCard
 | MajorArkanaCard


export type CardDeck = Array<TarotCard>


export const makeMajorArcanaDeck = (): CardDeck => 
  majorArkana.map(value => ({
    type: "MajorArkana", 
    value
  }))

export const makeMinorArcanaDeck = (): CardDeck =>
  minorSuit.flatMap(suit=>
    minorRank.map(value=>value)
     .map(rank=>({rank, suit})))
     .map(value=>({value, type:"MinorArkana" }))

export const makeFullDeck = (): CardDeck => [...makeMajorArcanaDeck(), ...makeMinorArcanaDeck()]

export type CardInGame = {
  card: TarotCard,
  orientation: Orientation
}


type GetRandomOrientationFn = ()=>Promise<Orientation>
type GetRandomCardNumFn = (len:number)=>Promise<number>

const getRandomNum = (len:number) => (len)*crypto.getRandomValues(new Uint32Array(1))[0]/2**32 | 0

const getRandomCardNum:GetRandomCardNumFn = (len:number) => Promise.resolve(getRandomNum(len))
const getRandomOrientation:GetRandomOrientationFn = () => Promise.resolve(getRandomNum(2) === 0 ? "Upright" : "Reversed")

export function makeDealer(getOrientation:GetRandomOrientationFn, getRandomCardNum: GetRandomCardNumFn) {
  return  async function * (deck: CardDeck){
    let gameDeck = [...deck]
    while (gameDeck.length > 0) {
      const [orientation, position] = await Promise.all([getOrientation(), getRandomCardNum(gameDeck.length)])
      const card = { orientation, card: gameDeck.at(position)! }
      gameDeck = gameDeck.filter((_,i) => i !== position)
      yield card
    }
  }
}


const cardToString = (gameCard:CardInGame) => {
  if (gameCard.card.type === 'MajorArkana'){
    return `${gameCard.card.value}, ${gameCard.orientation}`
  }
  return `${gameCard.card.value.rank} of ${gameCard.card.value.suit}, ${gameCard.orientation}`
}



const matchDeck:Record<DeckType, ()=>CardDeck> = {
  "FullDeck": makeFullDeck,
  "MajorArkana": makeMajorArcanaDeck,
  "MinorArkana": makeMinorArcanaDeck
} 

export type Spread = {
  name: string
  question: string
  deckType: DeckType
  selectCards: number
}

export type SpreadResult = {
  name: string
  question: string
  cards: Array<CardInGame>
}


const makePrompt = (spread: SpreadResult, lang: string, prefix?: string) => `
As an experienced tarotologist explain the tarot spread ${spread.name} in ${lang}. 
Theme of divination: ${spread.question}. Cards: ${spread.cards.map(cardToString).join(", ")}.
Describe every card and at the end, provide a summary.
${prefix || ""}
`

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


export interface ITarologist {
  explain(prompt: string): Promise<string>
}

function GigachatTarologist():ITarologist{
  return {
    async explain(){
      return ""
    }
  }
}


(async()=>{
  const spread = await makeSpread({name: "Past, Present, Future", question: "I want to buy a house", deckType: "FullDeck", selectCards: 3})
  const prompt = makePrompt(spread, "Russian", "Without introductory phrases or restating the question.")
  console.log(prompt)
})()




