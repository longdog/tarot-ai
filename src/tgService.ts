import { createHmac } from "node:crypto";
import { IDbService, ITgService, ITranslationService, PaidUser, TgUser } from "./model";
import { Bot, InlineKeyboard } from "grammy";
const { TG_SECRET, APP_URL } = process.env;

function hmac(data: string, key: any): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

function processTelegramData(
  qs: string,
  token: string
): { ok: false } | { ok: true; data: Record<string, string> } {
  const sk = hmac(token, "WebAppData");
  const parts = qs.split("&").map((p) => p.split("="));
  const hashpart = parts.splice(
    parts.findIndex((p) => p[0] === "hash"),
    1
  )[0];
  const dcs = parts
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map((p) => decodeURIComponent(p.join("=")))
    .join("\n");
  if (hmac(dcs, sk).toString("hex") !== hashpart[1]) return { ok: false };
  const o: Record<string, string> = {};
  for (const part of parts) {
    o[part[0]] = decodeURIComponent(part[1]);
  }
  return { ok: true, data: o };
}

export function tgService(trans: ITranslationService, db:IDbService): ITgService {
  const bot = new Bot(TG_SECRET!);
  bot.command("start", async (ctx) => {
    const tgUser = ctx?.update?.message?.from as TgUser;
    db.setUser({...tgUser, status: "startBot" })
    const t = trans(tgUser?.language_code || "");
    const name =
      tgUser?.first_name ||
      tgUser?.last_name ||
      tgUser?.username ||
      t("Wanderer");
    console.log("start", JSON.stringify(ctx, null, 2));
    ctx.reply(t("I bid thee welcome") + ", " + name, {
      reply_markup: new InlineKeyboard().webApp(
        t("The Tarot cards await thy question!"),
        APP_URL!
      ),
    });
  });
  bot.on("pre_checkout_query", async (ctx) => {
    // Answer the pre-checkout query, confer https://core.telegram.org/bots/api#answerprecheckoutquery
    console.log("precheck", JSON.stringify(ctx, null, 2));
    const user = (await ctx.getAuthor()).user;
    db.setUser({...user, isPaid:true} as PaidUser)
    await ctx.answerPreCheckoutQuery(true);
  });

  bot.on("message:successful_payment", async (ctx) => {
    console.log("payment", JSON.stringify(ctx, null, 2));
    ctx.reply("payment-success").catch(console.error);
  });
  bot.start();
  return {
    getUserData(str?: string) {
      if (!str) return undefined;
      const ret = processTelegramData(str, TG_SECRET!);
      if (ret.ok) {
        const user = JSON.parse(ret.data.user) as TgUser;
        db.setUser({...user, status: "startApp" })
        return user;
      }
      return undefined;
    },
    async makeInvoceLink({ description, title, price, payload }) {
      const currency = "XTR";

      const invoiceLink = await bot.api.createInvoiceLink(
        title,
        description,
        payload ? payload : "{}",
        "", // Provider token must be empty for Telegram Stars
        currency,
        [price]
      );
      console.log("inv", invoiceLink);

      return invoiceLink;
    },
  };
}
