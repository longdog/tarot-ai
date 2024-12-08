import { readdir } from "node:fs/promises";

import { CardInGame, ITranslationService, Prompt, SpreadResult } from "./model";

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
    return trans?.[lang]?.[str] || str;
  };
};

const cardToString = (t: (str: string) => string) => (gameCard: CardInGame) => {
  if (gameCard.card.type === "MajorArkana") {
    return `${t(gameCard.card.value)}, ${t(gameCard.orientation)}`;
  }
  return `${t(gameCard.card.value.rank)} ${t("of")} ${t(
    gameCard.card.value.suit
  )}, ${t(gameCard.orientation)}`;
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
      t(spread.name),
  },
  {
    role: "user",
    content:
      t(`Theme of divination:`) +
      " " +
      `${spread.question}. ` +
      t(`Cards:`) +
      " " +
      `${spread.cards.map(cardToString(t)).join(", ")}.`,
  },
];
