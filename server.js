const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 8000);
const progressFile = path.join(root, "data", "progress.json");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function readProgress() {
  try {
    const raw = await fs.promises.readFile(progressFile, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.entries === "object" ? parsed : { entries: {} };
  } catch (error) {
    if (error.code === "ENOENT") return { entries: {} };
    throw error;
  }
}

async function writeProgress(entries) {
  await fs.promises.mkdir(path.dirname(progressFile), { recursive: true });
  await fs.promises.writeFile(
    progressFile,
    JSON.stringify({ updatedAt: new Date().toISOString(), entries }, null, 2),
    "utf8"
  );
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/progress") {
    try {
      if (req.method === "GET") {
        sendJson(res, 200, await readProgress());
        return;
      }

      if (req.method === "PUT") {
        const payload = JSON.parse(await readBody(req) || "{}");
        const entries = payload.entries && typeof payload.entries === "object" ? payload.entries : null;
        if (!entries) {
          sendJson(res, 400, { error: "Missing progress entries." });
          return;
        }
        const fitEntries = Object.entries(entries)
          .filter(([key]) => key.startsWith("fit."))
          .reduce((all, [key, value]) => {
            all[key] = String(value);
            return all;
          }, {});
        await writeProgress(fitEntries);
        sendJson(res, 200, { ok: true, count: Object.keys(fitEntries).length });
        return;
      }

      sendJson(res, 405, { error: "Method not allowed." });
      return;
    } catch (error) {
      sendJson(res, 500, { error: error.message });
      return;
    }
  }

  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "text/plain; charset=utf-8" });
    res.end(data);
  });
}).listen(port, () => {
  console.log(`Training app running at http://localhost:${port}`);
});
