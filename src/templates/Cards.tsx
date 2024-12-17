import { html, raw } from "hono/html";
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
  invoice,
}: {
  question: string;
  spread: SpreadResult;
  t: (str: string) => string;
  lang: string;
  userName: string;
  invoice: string;
}) => {
  return (
    <div class="flex flex-col justify-between pt-10 items-center h-screen w-screen overflow-hidden zoom-in gap-5">
      <div class="flex flex-col gap-2 mb-2 w-full">
        <span class="leading-tight align-left text-start mx-5 font-extrabold text-3xl text-[#e0c36b] bg-clip-text">
          {t(userName || "Wanderer")},
        </span>
        <span class="leading-tight align-left text-start mx-5 font-extralight text-3xl text-[#e0c36b] bg-clip-text">
          {t(`Fate hath chosen thy cards!`)}
        </span>
      </div>
<div class="w-full h-full">
      <CardSpread>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card data={spread.cards[i]} t={t} />
        ))}
      </CardSpread>
</div>
      <form class="flex justify-center w-full z-50">
        <input type="hidden" value={question} name="question" />
        <input id="invoice" type="hidden" value={invoice} name="invoice" />
        <input type="hidden" value={lang} name="lang" />
        <input type="hidden" value={JSON.stringify(spread)} name="cards" />

        <button
          id="invoice"
          onClick={`getInvoice(event)` as any} // for client script
          class="text-yellow-100 border-red-900 border-4 bg-[#42465c] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-xl text-2xl shadow-xl px-5 py-2.5 text-center mb-6"
        >
          {t(`Interpret Cards`)}&nbsp;★
        </button>

        <button
          id="explain"
          hidden
          hx-post="/explain"
          hx-indicator="#spinner"
          type="submit"
        ></button>
      </form>
      {html`<script>
        panzoom(document.getElementById("cards"),{
          bounds: true,
          boundsPadding: 0.5
        })
        function getInvoice(e) {
          e.preventDefault();
          e.stopPropagation();
          const $invoice = document.getElementById("invoice");
          const link = $invoice.getAttribute("value");
          if (link && tg) {
            tg.openInvoice(link, (status) => {
              if (status === "paid") {
                htmx.trigger("#explain", "click");
              } else {
                tg.showAlert("${t("Bless my hand with gold!")}");
              }
            });
          }
          return 0;
        }
      </script>`}
    </div>
  );
};
const CardSpread: FC = ({ children }) => (
  <>
    <div id="cards" class="mx-auto grid grid-cols-3 grid-rows-1 gap-4 grid-row-auto grid-columns-auto w-full max-w-[700px] ">
      {children}
    </div>
  </>
);
