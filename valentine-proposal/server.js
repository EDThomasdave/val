const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

const PORT = process.env.PORT || 10000;  // Change port if needed

// Function to serve static files
function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
}

// Create server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const queryObject = parsedUrl.query;

    console.log("Request received for:", pathname);

    // Serve static HTML pages
    const staticPages = ["/", "/yes.html", "/confirm.html", "/roseDay.html"];
    if (staticPages.includes(pathname)) {
        serveStaticFile(res, pathname === "/" ? "index.html" : pathname.substring(1), "text/html");
        return;
    }

    // Serve static assets (CSS, JS, Images)
    const ext = path.extname(pathname);
    if (ext) {
        const contentType = {
            ".css": "text/css",
            ".js": "application/javascript",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".gif": "image/gif",
            ".html": "text/html"
        }[ext] || "text/plain";

        serveStaticFile(res, "." + pathname, contentType);
        return;
    }

    // Handle "Yes" or "No" responses
    if (pathname === "/response") {
        const answer = queryObject.answer;
        if (!answer) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Bad Request");
            return;
        }

        // Redirect based on answer
        res.writeHead(302, {
            Location: answer === "Yes" ? "/yes.html" : "/confirm.html",
        });
        res.end();
        return;
    }

    // If no route matches, return 404
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
