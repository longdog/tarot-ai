let tg = undefined;
document.addEventListener('DOMContentLoaded', (event) => {
  tg = window.Telegram?.WebApp;
  if (!tg){
    console.log("No Telegram API");
    // return;
  }
  const tData = {data:tg.initData};
  const $startPage = document.getElementById("startPage");
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
