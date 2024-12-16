import { Prompt } from "./model.js";
import { ITarologist } from "./model.js";


// fix fectch error SELF_SIGNED_CERT_IN_CHAIN: self signed certificate in certificate chain
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const AI_URL =
  `https://api.groq.com/openai/v1/chat/completions` as const;

const { AI_AUTH_KEY } = process.env;

export async function groqTarologist(): Promise<ITarologist> {

  return {
    explain: async (prompt: Array<Prompt>) => {
      const data = {
        model: "llama3-8b-8192",
        messages: prompt,
      };
      console.log("send prompt data", data);
      try {
        const promptReq = await fetch(AI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${AI_AUTH_KEY}`,
          },
          body: JSON.stringify(data),
        });
        const result = await promptReq.json();
        console.log("result", result);
        return (result?.choices?.[0]?.message?.content || "") as string;
      } catch (error) {
        console.log(error);
        throw new Error("Groq send data error");
      }
    },
  };
}
