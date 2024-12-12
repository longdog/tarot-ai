export const Explain = ({ t, text }: { t: (str: string) => string; text: string; }) => (
  <div class="h-screen w-screen zoom-in grid grid-cols-1 gap-5 grid-rows-[1fr_auto]">
    <div
      class="w-full font-serif text-xl p-8 text-orange-100 overflow-auto"
      dangerouslySetInnerHTML={{ __html: `${text.replaceAll("\n", "<br />")}` }}
    ></div>
    <a
    href="/"
      class="text-yellow-100 border-red-900 border-4 bg-orange-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-2xl shadow-xl font-serif px-5 py-2.5 text-center mb-6"
    >
      {t(`I have another question`)}
    </a>
  </div>
);
