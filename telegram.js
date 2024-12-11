(()=>{
document.addEventListener('DOMContentLoaded', (event) => {
  const tg = window.Telegram?.WebApp;
  if (!tg){
    console.log("No Telegram API");
    // return;
  }
  const tData = {data:tg.initData};
  const $startPage = document.getElementById("startPage");
  $startPage.setAttribute("hx-vals", JSON.stringify(tData))
  console.log("Telegram API");
  htmx.trigger("#startPage", "start")
})

})()