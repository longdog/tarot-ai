const {BOT_URL}  = process.env

export const NoTelegram = () => (<>
<div class="flex flex-col w-full h-full justify-center items-center">
  <a class="text-3xl flex flex-col gap-5 text-[#e0c36b]" href={`${BOT_URL}`}>
  <img src="/public/img/cardicon.svg" alt="Tarot Telegram" />
    Tarot Telegram Bot</a>
</div>
</>)