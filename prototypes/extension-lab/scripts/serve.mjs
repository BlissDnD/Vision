/** Loopback-only static server for the generated isolated gallery. */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist"),
  port = Number(process.env.VEL_LAB_PORT || 5192);
const types = {
  ".html": "text/html; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".otf": "font/otf",
  ".map": "application/json",
  ".json": "application/json",
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost"),
        file = path.resolve(
          root,
          "." +
            decodeURIComponent(
              url.pathname === "/" ? "/index.html" : url.pathname,
            ),
        );
      if (!file.startsWith(root + path.sep)) throw new Error("Outside dist");
      const data = await fs.readFile(file);
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Vel bővítménylabor: http://127.0.0.1:${port}`),
  );
