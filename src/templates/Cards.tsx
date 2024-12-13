import { html } from "hono/html";
import { FC } from "hono/jsx";
import { CardInGame, SpreadResult } from "../model";
import { CardImg } from "./CardImg";
import { Base64 } from "js-base64";

const getCardName = (c: CardInGame) => `${String(c.card.value)}`;
const Card = ({
  data,
  t,
}: {
  data: CardInGame;
  t: (str: string) => string;
}) => {
  const cardName = getCardName(data);
  const cardIcon = Base64.encode(
    html`${(<CardImg img={cardName} name={t(cardName)} />)}`.toString()
  );
  return (
    <div class={`card`}>
      <div class="card-inner">
        <div class={`card-back ${data.orientation.toLowerCase()}`}>
          <img
            src={`data:image/svg+xml;base64,${cardIcon}`}
            alt={t(cardName)}
            class={`zoomable`}
          />
        </div>
        <div class={`card-front`}></div>
      </div>
    </div>
  );
};
export const Cards = ({
  question,
  spread,
  t,
  lang,
  userName,
}: {
  question: string;
  spread: SpreadResult;
  t: (str: string) => string;
  lang: string;
  userName: string;
}) => (
  <div class="flex flex-col justify-center items-center h-full w-screen zoom-in gap-5">
    <div class="flex flex-col gap-2 mb-2" for="question">
      <span class="leading-tight align-left text-start mx-5 font-extrabold text-5xl text-[#e0c36b] bg-clip-text">
        {t(userName || "Wanderer")},
      </span>
      <span class="leading-tight align-left text-start mx-5 font-extralight text-5xl text-[#e0c36b] bg-clip-text">
        {t(`Fate hath chosen thy cards!`)}
      </span>
    </div>

    <CardSpread>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card data={spread.cards[i]} t={t} />
      ))}
    </CardSpread>

    <form class="flex justify-center">
      <input type="hidden" value={question} name="question" />
      <input type="hidden" value={lang} name="lang" />
      <input type="hidden" value={JSON.stringify(spread)} name="cards" />

      <button
        hx-post="/explain"
        hx-indicator="#spinner"
        type="submit"
        class="text-yellow-100 border-red-900 border-4 bg-[#42465c] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-xl text-2xl shadow-xl px-5 py-2.5 text-center mb-6"
      >
        {t(`Interpret Cards`)} ★
      </button>
    </form>
    {html`
      <script>
        mediumZoom(".zoomable");
      </script>
    `}
  </div>
);
const CardSpread: FC = ({ children }) => (
  <>
    <div class="mx-auto grid grid-cols-3 grid-rows-1 gap-4 grid-row-auto grid-columns-auto w-full max-w-[700px] ">
      {children}
    </div>
  </>
);
