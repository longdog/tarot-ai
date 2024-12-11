import { Context, Hono } from "hono";
import { serveStatic } from "hono/bun";
import { FC } from "hono/jsx";
import {
  CardInGame,
  ISpreadGen,
  ITarologist,
  ITgService,
  ITranslationService,
  SpreadResult,
  TgUser,
} from "./model";
import { html } from "hono/html";
import { makePrompt } from "./prompt";

const Page: FC = ({ children }) => (
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Tarot AI</title>
      <link rel="stylesheet" href="/public/main.css" />
      <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
      <script src="/public/htmx.min.js"></script>
      <script src="/public/medium-zoom.min.js"></script>
    </head>
    <body>
      <>{children}</>
      <script src="/public/telegram.js"></script>
    </body>
  </html>
);

const Explain = ({ t, text }: { t: (str: string) => string; text: string }) => (
  <div class="h-screen w-screen zoom-in grid grid-cols-1 gap-5 grid-rows-[1fr_auto]">
    <div
      class="w-full font-serif text-xl p-8 text-orange-100 overflow-auto"
      dangerouslySetInnerHTML={{ __html: `${text.replaceAll("\n", "<br />")}` }}
    ></div>
    <button
      hx-validate="true"
      hx-get="/"
      type="submit"
      class="text-yellow-100 border-red-900 border-4 bg-orange-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-2xl shadow-xl font-serif px-5 py-2.5 text-center mb-6"
    >
      {t(`I have another question`)}
    </button>
  </div>
);

const getName = (u: TgUser | undefined):string => u?.first_name || u?.last_name || u?.username || ""

const QuestionForm = ({
  user,
  t,
  defaultQuestion,
}: {
  user?: TgUser,
  t: (str: string) => string;
  defaultQuestion: string;
}) => (
  <div class="h-full zoom-in">
    <form class="flex flex-col justify-center items-center h-full">
      <label
        class="leading-tight align-middle text-center m-5 font-extrabold font-serif text-5xl bg-gradient-to-b from-orange-200 via-yellow-200 to-orange-300 bg-clip-text text-transparent"
        for="question"
      >
        {getName(user)}
        <br/>
        {t(`The Tarot cards await thy question!`)}
      </label>
      <div class="w-full p-4">
        <input
          required
          type="text"
          maxlength={500}
          value={defaultQuestion}
          name="question"
          id="question"
          class="bg-yellow-200 font-serif rounded-xl mb-2 p-3 w-full text-2xl"
        />
      </div>
      <button
        hx-validate="true"
        hx-post="/question"
        type="submit"
        class="text-yellow-100 border-red-900 border-4 bg-orange-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-2xl shadow-xl font-serif px-5 py-2.5 text-center mb-6"
      >
        {t(`Pose Question`)}
      </button>
    </form>
  </div>
);

const getCardImg = (c: CardInGame) =>
  `background-image: url(/public/img/cards/${String(c.card.value).replaceAll(
    " ",
    "-"
  )}.jpg)`.toLowerCase();
const getCardFile = (c: CardInGame) =>
  `/public/img/cards/${String(c.card.value).replaceAll(
    " ",
    "-"
  )}.jpg`.toLowerCase();
const getCardName = (c: CardInGame) => `${String(c.card.value)}`;

const Card = ({ data }: { data: CardInGame }) => (
  <div class={`card`}>
    <div class="card-inner">
      <div
        class={`card-back ${data.orientation.toLowerCase()}`}
        // style={`${getCardImg(data)}`}
      >
        <img
          src={getCardFile(data)}
          alt={getCardName(data)}
          class={`zoomable`}
        />
        {/* <span>{getCardName(data)}</span> */}
      </div>
      <div class={`card-front`}></div>
    </div>
  </div>
);

const Cards = ({
  question,
  spread,
  t,
}: {
  question: string;
  spread: SpreadResult;
  t: (str: string) => string;
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

export const makeWeb = (
  spredGen: ISpreadGen,
  tarologist: ITarologist,
  trans: ITranslationService,
  tg: ITgService
) => {
  const getLang = (c: Context) => {
    const lang =
      c.req.header("Accept-Language")?.substring(0, 2)?.toLowerCase() || "";
    return trans(lang);
  };
  const app = new Hono();
  app.use("/public/*", serveStatic({ root: "./" }));
  app.post("/question", async (c) => {
    const t = getLang(c);
    try {
      const { question } = await c.req.parseBody<{ question: string }>();
      const spread = await spredGen.makeSpread({
        name: t("Past, Present, Future"),
        question,
        deckType: "MajorArkana",
        selectCards: 3,
      });

      return c.html(<Cards question={question} spread={spread} t={t} />);
    } catch (error) {
      return c.notFound();
    }
  });

  app.post("/explain", async (c) => {
    const t = getLang(c);
    try {
      const { cards } = await c.req.parseBody<{
        question: string;
        cards: string;
      }>();
      const spread = JSON.parse(cards);
      const prompt = makePrompt(spread, t);
      const explanation = await tarologist.explain(prompt);
      return c.html(<Explain t={t} text={explanation} />);
    } catch (error) {
      return c.notFound();
    }
  });
  app.post("/start", async (c) => {
    const t = getLang(c);
    const tgdata = await c.req.parseBody<{data?:string}>();
    let user = undefined;
    if (tgdata && tgdata.data){
      user = tg.getUserData(tgdata.data)
    } 
    return c.html(
      <QuestionForm user={user} t={t} defaultQuestion={t("Will I get lucky today?")} />
    );
  });

  app.get("/health", (c) => c.text("ok"));

  app.get("/", (c) => {
    return c.html(
      <Page>
        <div
          id="startPage"
          class="h-full"
          hx-post="/start"
          hx-trigger="start"
          hx-target="#content"
          hx-swap="innerHTML"
        >
          <div class="h-full" id="content"></div>
        </div>
      </Page>
    );
  });
  return app;
};
