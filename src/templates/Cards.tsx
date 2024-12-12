import { html } from "hono/html";
import { FC } from "hono/jsx";
import { CardInGame, SpreadResult } from "../model";

const getCardImg = (c: CardInGame) => `background-image: url(/public/img/cards/${String(c.card.value).replaceAll(
  " ",
  "-"
)}.jpg)`.toLowerCase();
const getCardFile = (c: CardInGame) => `/public/img/cards/${String(c.card.value).replaceAll(
  " ",
  "-"
)}.jpg`.toLowerCase();
const getCardName = (c: CardInGame) => `${String(c.card.value)}`;
const Card = ({ data }: { data: CardInGame; }) => (
  <div class={`card`}>
    <div class="card-inner">
      <div
        class={`card-back ${data.orientation.toLowerCase()}`}
      >
        <img
          src={getCardFile(data)}
          alt={getCardName(data)}
          class={`zoomable`} />
        {/* <span>{getCardName(data)}</span> */}
      </div>
      <div class={`card-front`}></div>
    </div>
  </div>
);
export const Cards = ({
  question, spread, t, lang,
}: {
  question: string;
  spread: SpreadResult;
  t: (str: string) => string;
  lang: string
}) => (
  <div class="flex flex-col justify-center items-center h-full w-screen zoom-in gap-5">
    <div class="leading-tight align-middle text-center m-5 font-extrabold font-serif text-5xl bg-gradient-to-b from-orange-200 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
      {t(`Fate hath chosen thy cards!`)}
    </div>
    <CardSpread>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card data={spread.cards[i]} />
      ))}
    </CardSpread>

    <form class="flex justify-center">
      <input type="hidden" value={question} name="question" />
      <input type="hidden" value={lang} name="lang" />
      <input type="hidden" value={JSON.stringify(spread)} name="cards" />

      <button
        hx-post="/explain"
        type="submit"
        class="text-yellow-100 border-red-900 border-4 bg-orange-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-2xl shadow-xl font-serif px-5 py-2.5 text-center mb-6"
      >
        {t(`Interpret Cards`)}
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
