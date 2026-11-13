#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const port = Number(process.argv[2] ?? 4173);
const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "..", "out");
const PREFIX = "/isavel-redesign";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function safeJoin(base, rel) {
  const resolved = path.normalize(path.join(base, rel));
  if (!resolved.startsWith(base)) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  try {
    const raw = (req.url ?? "/").split("?")[0];
    if (!raw.startsWith(PREFIX)) {
      res.writeHead(302, { Location: `${PREFIX}/` });
      res.end();
      return;
    }
    let rel = decodeURIComponent(raw.slice(PREFIX.length) || "/");
    if (rel.endsWith("/")) rel = `${rel}index.html`;

    let filePath = safeJoin(outDir, rel.startsWith("/") ? rel.slice(1) : rel);
    if (!filePath) {
      res.writeHead(403).end();
      return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const withIndex = safeJoin(
        outDir,
        path.join(rel.startsWith("/") ? rel.slice(1) : rel, "index.html"),
      );
      if (withIndex && fs.existsSync(withIndex)) filePath = withIndex;
    }
    if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const fallback = path.join(outDir, "404.html");
      if (fs.existsSync(fallback)) {
        filePath = fallback;
        res.statusCode = 404;
      } else {
        res.writeHead(404).end("Not found");
        return;
      }
    }
    const ext = path.extname(filePath);
    res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(500).end();
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static export at http://127.0.0.1:${port}${PREFIX}/`);
});
