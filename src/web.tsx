import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
const app = new Hono()
app.use('/public/*', serveStatic({ root: './' }))

const Page = ({children}) => (<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tarot AI</title>
    <link rel="stylesheet" href="/public/main.css" />
    <script src="/public/htmx.min.js"></script>
  </head>
  <body>
    {children}
  </body>
</html>)

const Card = () => (
      <div class="card">
        <div class="card-inner">
          <div class="card-back"></div>
          <div class="card-front"></div>
        </div>
      </div>
)

const CardSpread = ({children}) => (
<div class="flex justify-center items-center h-full w-full">
  <div class="grid grid-cols-3 grid-rows-1 gap-4">
    {children}
    </div></div>
)

app.get('/', (c) => {
  return c.html(<Page>
    <CardSpread>
      {Array.from({length:3}).map((_,i)=><Card key={i} />)}
    </CardSpread>
  </Page>)
})

export default app
