import { Context, Hono } from "hono";
import { serveStatic } from "hono/bun";
import {
  getName,
  ISpreadGen,
  ITarologist,
  ITgService,
  ITranslationService,
} from "./model";
import { makePrompt } from "./prompt";
import { QuestionForm } from "./templates/QuestionForm";
import { Cards } from "./templates/Cards";
import { marked } from "marked";
import { Explain } from "./templates/Explain";
import { Page } from "./templates/Page";

export const makeWeb = (
  spredGen: ISpreadGen,
  tarologist: ITarologist,
  trans: ITranslationService,
  tg: ITgService
) => {
  const getWebLang = (c: Context) => {
    const lang =
      c.req.header("Accept-Language")?.substring(0, 2)?.toLowerCase() || "";
    return trans(lang);
  };

  const getTgLang = (lang: string | undefined) => ({
    t:trans(lang || ""),
    lang: lang || ""
  })

  const app = new Hono();
  app.use("/public/*", serveStatic({ root: "./" }));
  

  /**
   * Explain Cards
   */
  app.post("/explain", async (c) => {
    try {
      const { cards, lang } = await c.req.parseBody<{
        question: string;
        cards: string;
        lang: string;
      }>();
      const tr = getTgLang(lang)
      const spread = JSON.parse(cards);
      const prompt = makePrompt(spread, tr.t);
      const explanation = await tarologist.explain(prompt);
      const formated = await marked.parse(explanation)
      return c.html(<Explain {...tr} text={formated} />);
    } catch (error) {
      return c.notFound();
    }
  });


  /**
   * Get question and show cards
   */
  app.post("/question", async (c) => {
    try {
      const { question, lang, user } = await c.req.parseBody<{ question: string, lang:string, user:string }>();
      const tr = getTgLang(lang);
      const spread = await spredGen.makeSpread({
        name: tr.t("Past, Present, Future"),
        question,
        deckType: "MajorArkana",
        selectCards: 3,
      });

      return c.html(<Cards question={question} spread={spread} {...tr} />);
    } catch (error) {
      return c.notFound();
    }
  });


  /**
   * Start Question
   */
  app.post("/start", async (c) => {
    const tgdata = await c.req.parseBody<{data?:string}>();
    const user = tg.getUserData(tgdata?.data);
    const tr = getTgLang(user?.language_code)
    return c.html(
      <QuestionForm 
        {...tr}
        userName={getName(user)} 
        defaultQuestion={tr.t("Will I get lucky today?")} />
    );
  });

  /**
   * Healthcheck
   */
  app.get("/health", (c) => c.text("ok"));
  
  /**
   * Index
   */
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
