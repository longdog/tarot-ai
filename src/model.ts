
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


export type GetRandomOrientationFn = ()=>Promise<Orientation>
export type GetRandomCardNumFn = (len:number)=>Promise<number>


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



export const matchDeck:Record<DeckType, ()=>CardDeck> = {
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


export type Prompt = {
  type: "user" | "system"
  content: string
}

export const makePrompt = (spread: SpreadResult, lang: string): Array<Prompt> => [{
  type: "system",
  content: `Answer in ${lang} as experienced tarotologist`},
  {type: "user",
    content: `Explain the tarot spread ${spread.name}. Theme of divination: ${spread.question}. Cards: ${spread.cards.map(cardToString).join(", ")}.
Describe every card and at the end, provide a summary.
`}]


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






