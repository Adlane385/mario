const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 12000;
const HOST = "0.0.0.0";

// MIME types for different file extensions
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".wav": "audio/wav",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Set CORS headers to allow access from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204; // No content
    res.end();
    return;
  }

  // Parse URL to get the file path
  let filePath = req.url;

  // Default to index.html if root path
  if (filePath === "/" || filePath === "") {
    filePath = "/index.html";
  }

  // Resolve the file path
  filePath = path.join(__dirname, filePath);

  // Get file extension
  const extname = path.extname(filePath);

  // Set content type based on file extension
  const contentType = MIME_TYPES[extname] || "application/octet-stream";

  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File not found
        console.error(`File not found: ${filePath}`);
        res.writeHead(404);
        res.end("404 Not Found");
      } else {
        // Server error
        console.error(`Server error: ${err.code}`);
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
