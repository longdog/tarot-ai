import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { FC } from "hono/jsx";
import { CardInGame, ISpreadGen, ITarologist, SpreadResult } from "./model";
import { html } from "hono/html";

const Page: FC = ({ children }) => (
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Tarot AI</title>
      <link rel="stylesheet" href="/public/main.css" />
      <script src="/public/htmx.min.js"></script>
      <script src="/public/medium-zoom.min.js"></script>
    </head>
    <body>
      <>
      {children}
      </>
    </body>
  </html>
);

const Explain = ({text}:{text: string}) =>(<div class="h-screen w-screen zoom-in grid grid-cols-1 gap-5 grid-rows-[1fr_auto]">
  <div class="w-full font-serif text-xl p-8 text-orange-100 overflow-auto" 
  dangerouslySetInnerHTML={{__html: `${text.replaceAll("\n", "<br />")}`}}>
  </div>
      <button
        hx-validate="true"
        hx-get="/"
        type="submit"
        class="text-yellow-100 border-red-900 border-4 bg-orange-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-2xl shadow-xl font-serif px-5 py-2.5 text-center mb-6"
      >
       I have another question 
      </button>
</div>)

const QuestionForm = ({ defaultQuestion }: { defaultQuestion: string }) => (
  <div class="h-full zoom-in">
    <form class="flex flex-col justify-center items-center h-full">
      <label
        class="leading-tight align-middle text-center m-5 font-extrabold font-serif text-5xl bg-gradient-to-b from-orange-200 via-yellow-200 to-orange-300 bg-clip-text text-transparent"
        for="question"
      >
        The Tarot cards await thy question!
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
        send question
      </button>
    </form>
  </div>
);

const getCardImg = (c:CardInGame) =>`background-image: url(/public/img/cards/${String(c.card.value).replaceAll(" ", "-")}.jpg)`.toLowerCase()
const getCardFile = (c:CardInGame) =>`/public/img/cards/${String(c.card.value).replaceAll(" ", "-")}.jpg`.toLowerCase()
const getCardName = (c:CardInGame) =>`${String(c.card.value)}`


const Card = ({data}:{data:CardInGame}) => (
  <div class={`card`}>
    <div class="card-inner">
      <div class={`card-back ${data.orientation.toLowerCase()}`} 
      // style={`${getCardImg(data)}`}
      >
        <img src={getCardFile(data)} alt={getCardName(data)} class={`zoomable`} />
        {/* <span>{getCardName(data)}</span> */}
      </div>
      <div class={`card-front`} ></div>
    </div>
  </div>
);

const Cards = ({ question, spread }: { question: string, spread: SpreadResult }) => (
  <div class="flex flex-col justify-center items-center h-full w-screen zoom-in gap-5">
    <div class="leading-tight align-middle text-center m-5 font-extrabold font-serif text-5xl bg-gradient-to-b from-orange-200 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
      Fate hath chosen thy cards!
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
        Interpret Cards
      </button>
    </form>
      {html`
      <script>mediumZoom(".zoomable")</script>
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

export const makeWeb = (spredGen: ISpreadGen, tarologistService:Promise<ITarologist>) => {
  const app = new Hono();
  app.use("/public/*", serveStatic({ root: "./" }));
  app.post("/question", async (c) => {
    try {
      const { question } = await c.req.parseBody<{ question: string }>();
      const spread = await spredGen.makeSpread({
        name:"Past, Present, Future", 
        question, 
        deckType: "MajorArkana", 
        selectCards: 3})
        
      return c.html(<Cards question={question} spread={spread} />);
    } catch (error) {
      return c.notFound();
    }
  });

  app.post("/explain", async (c) => {
    try {
      const { question, cards } = await c.req.parseBody<{ question: string, cards: string }>();
      const spread = JSON.parse(cards)        
      return c.html(<Explain text={`Прошлое: 10 Жезлов перевернутая
Эта карта говорит о том, что в прошлом вы могли испытывать сильное давление или нести непосильную ношу. Возможно, ваши усилия были направлены на решение финансовых вопросов или преодоление трудностей, связанных с покупкой жилья. Перевернутое положение карты подчеркивает, что этот период был сложным и требовал значительных усилий.

Настоящее: 4 Жезлов перевернутая
Карта символизирует радость и стабильность, однако в перевернутом положении она может указывать на проблемы в отношениях или недостаток гармонии в текущей ситуации. Возможно, вы столкнулись с трудностями при выборе дома или возникли разногласия с партнерами или семьей. Это также может означать задержку в процессе покупки недвижимости.

Будущее: 3 Мечей перевернутая
В будущем вам предстоит преодолеть некоторые эмоциональные трудности. Эта карта в перевернутом виде указывает на возможность разрешения конфликтов и снятия напряжения. Несмотря на возможные сложности, ситуация постепенно улучшится, и вы сможете двигаться дальше. Возможно, покупка дома принесет больше радости и удовлетворения, чем ожидалось.

Итог:
Несмотря на то, что прошлое было тяжелым, а настоящее вызывает определенные затруднения, будущее обещает улучшение ситуации. Вам нужно будет проявить терпение и настойчивость, чтобы справиться с текущими проблемами. В конечном итоге, ваша мечта о собственном доме может стать реальностью, хотя путь к этому может быть непростым.`} />);
    } catch (error) {
      return c.notFound();
    }
  });
  app.get("/start", async (c) => {
    return c.html(<QuestionForm defaultQuestion="Will I get lucky today?" />);
  });

  app.get("/", (c) => {
    return c.html(
      <Page>
        <div
          class="h-full"
          hx-get="/start"
          hx-trigger="load"
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
