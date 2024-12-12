import { TgUser, getName } from "../model";

export const QuestionForm = ({
  userName, t, lang, defaultQuestion,
}: {
  userName?: string;
  t: (str: string) => string;
  lang: string, 
  defaultQuestion: string;
}) => (
  <div class="h-full zoom-in">
    <form class="flex flex-col justify-center items-center h-full">
      <label
        class="leading-tight align-middle text-center m-5 font-extrabold font-serif text-5xl bg-gradient-to-b from-orange-200 via-yellow-200 to-orange-300 bg-clip-text text-transparent"
        for="question"
      >
        {t(userName || "Wanderer")},
        <br />
        {t(`The Tarot cards await thy question!`)}
      </label>
      <div class="w-full p-4">
        <input 
          name="lang"
          value={lang}
          type="hidden" />
        <input 
          name="user"
          value={userName || ""}
          type="hidden" />
        <input
          required
          type="text"
          maxlength={500}
          value={defaultQuestion}
          name="question"
          id="question"
          class="bg-yellow-200 font-serif rounded-xl mb-2 p-3 w-full text-2xl" />
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
