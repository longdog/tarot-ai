(()=>{document.addEventListener("DOMContentLoaded",(a)=>{let t=window.Telegram?.WebApp;if(!t)console.log("No Telegram API");let e={data:t.initData};document.getElementById("startPage").setAttribute("hx-vals",JSON.stringify(e)),console.log("Telegram API"),htmx.trigger("#startPage","start")})})();

//# debugId=632B919AB48ED40464756E2164756E21
//# sourceMappingURL=telegram.js.map
