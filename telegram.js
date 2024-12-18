let tg = undefined;
document.addEventListener('DOMContentLoaded', (event) => {
  tg = window.Telegram?.WebApp;
  const $startPage = document.getElementById("startPage");
  if (!tg || !tg.initData){
    console.log("No Telegram API");
    htmx.trigger("#startPage", "start")
    return;
  }
  const tData = {data:tg.initData};
  $startPage.setAttribute("hx-vals", JSON.stringify(tData))
  console.log("Telegram API");
  htmx.trigger("#startPage", "start")


  // for mobile keyboard
const windowSizeChanged = () => {
  const viewport = document.querySelector("meta[name=viewport]");
  viewport.setAttribute(
    "content", "width=" + window.visualViewport.innerWidth + ", height=" + window.visualViewport.innerHeight + ", initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
  );
}
window.addEventListener("resize", windowSizeChanged);
if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", windowSizeChanged)
  }
})
