export const Explain = ({ t, text }: { t: (str: string) => string; text: string; }) => (
  <div class="h-screen w-screen zoom-in grid grid-cols-1 gap-5 grid-rows-[1fr_auto]">
    <div
      class="w-full text-xl prose-xl p-8 text-[#e0c36b] font-extralight overflow-auto"
      dangerouslySetInnerHTML={{ __html: `${text}` }}
    ></div>
    <div class="flex justify-center">
    <a
    href="/"
        class="text-yellow-100 border-red-900 border-4 bg-[#42465c] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-xl text-2xl shadow-xl px-5 py-2.5 text-center mb-6"
    >
      {t(`I have another question`)}
    </a>
    </div>
  </div>
);
