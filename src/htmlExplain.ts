import { marked } from "marked";
import { ExplainFormated } from "./model";

export const htmlExplain:ExplainFormated = async (text:string) => {
  return await marked.parse(text.replaceAll("`", ""));
}