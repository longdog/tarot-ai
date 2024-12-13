export function Spinner(){

  return <div id="spinner" class="htmx-indicator z-50 absolute top-0 left-0 bottom-0 right-0 w-screen h-screen">
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" >
      <img  id="spinnerImg" src="/public/img/cardicon.svg" />
    </div>
    </div>
}