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
        class="flex flex-col gap-2 mb-2"
        for="question"
      >
        <span
        class="leading-tight align-left text-start mx-5 font-extrabold text-5xl text-[#e0c36b] bg-clip-text"
        >
          {t(userName || "Wanderer")},
        </span>
        <span
        class="leading-tight align-left text-start mx-5 font-extralight text-5xl text-[#e0c36b] bg-clip-text"
        >
        {t(`The Tarot cards await thy question!`)}
        </span>
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
          class="bg-yellow-200 rounded-xl mb-2 p-3 w-full text-2xl" />
      </div>
      <button
        hx-validate="true"
        hx-post="/question"
        type="submit"
        class="text-yellow-100 border-red-900 border-4 bg-[#42465c] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-xl text-2xl shadow-xl px-5 py-2.5 text-center mb-6"
      >
        {t(`Pose Question`)}
      </button>
    </form>
  </div>
);
