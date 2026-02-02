import { createServer } from "http";
import next from "next";
import dns from "dns";
import dotenv from "dotenv";
import { socketConfig } from "./src/lib/websocket/index.js";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.NEXT_PUBLIC_SITE_URL.split("//")[1].split(":")[0];
const port = Number(process.env.PORT || 3001);
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

dns.setDefaultResultOrder("ipv4first");

app.prepare().then(() => {
  const httpServer = createServer(handler);

  httpServer
    .once("error", (err) => {
      console.error(`❌ Server Error: `, err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`✔️  Ready on http://${hostname}:${port}`);
      socketConfig(httpServer);
    });
});
