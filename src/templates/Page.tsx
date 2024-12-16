import { FC } from "hono/jsx";
import { Spinner } from "./Spinner";

export const Page: FC = ({ children }) => (
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Tarot AI</title>
      <link rel="stylesheet" href="/public/main.css" />
      <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
      <script src="/public/htmx.min.js"></script>
      <script src="/public/medium-zoom.min.js"></script>
    </head>
    <body class="relative">
      <div id="bg"></div>
      <>{children}</>
      <Spinner />
      <script src="/public/telegram.js"></script>
    </body>
  </html>
);
