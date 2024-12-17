import { readdir } from "node:fs/promises";

import { CardInGame, ITranslationService, Prompt, SpreadResult } from "./model";

const {LNG} = process.env;

const getTranslationFiles = async () => {
  return (await readdir(__dirname + "/translations")).filter((f) =>
    f.includes(".json")
  );
};

const readTranslation = (filename: string) => {
  return Bun.file(__dirname + "/translations/" + filename, {
    type: "application/json",
  }).json();
};

const getLangFromName = (filename: string) =>
  filename.toLowerCase().replace(".json", "");

export const makeTranslation = async (): Promise<ITranslationService> => {
  const langFiles = await getTranslationFiles();
  const trans = Object.fromEntries(
    await Promise.all(
      langFiles.map(async (f) => [getLangFromName(f), await readTranslation(f)])
    )
  );
  
  return (lang: string) => (str: string) => {
    const baseLang = LNG || lang.substring(0,2);

    return trans?.[baseLang]?.[str] || str;
  };
};

const cardToString = (t: (str: string) => string) => (gameCard: CardInGame) => {
  if (gameCard.card.type === "MajorArkana") {
    return `${gameCard.orientation === 'Reversed'? t("Reversed"):""} ${t(gameCard.card.value)}`;
  }
  return `${gameCard.orientation === 'Reversed'? t("Reversed"):""} ${t(gameCard.card.value.rank)} ${t("of")} ${t(
    gameCard.card.value.suit
  )}`;
};

export const makePrompt = (
  spread: SpreadResult,
  t: (str: string) => string
): Array<Prompt> => [
  {
    role: "system",
    content:
      t(`As an experienced tarotologist explain the tarot spread`) +
      " " +
      t(spread.name) +
      " " + t("and return text in markdown format")
      ,
  },
  {
    role: "user",
    content:
      t(`Theme of divination:`) +
      " " +
      `${spread.question}. ` +
      String(spread.cards.length) + " " +
      t(`cards:`) +
      " " +
      `${spread.cards.map(cardToString(t)).join(", ")}.`,
  },
];
