const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

const PORT = process.env.PORT || 3000;

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

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const queryObject = parsedUrl.query;

    console.log("Request received for:", pathname);

    // Serve main page
    if (pathname === "/") {
        serveStaticFile(res, path.join(__dirname, "index.html"), "text/html");
        return;
    } else if (pathname === "/roseDay.html") {
        serveStaticFile(res, path.join(__dirname, "roseDay.html"), "text/html");
        return;
    }

    // Serve static files (CSS, JS, Images)
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

        serveStaticFile(res, path.join(__dirname, pathname), contentType);
        return;
    }

    // Handle user responses
    if (pathname === "/response") {
        const answer = queryObject.answer;
        const reason = queryObject.reason || "N/A";

        if (!answer) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Bad Request");
            return;
        }

        const logEntry = `Answer: ${answer}\nReason: ${reason}\nTime: ${new Date().toLocaleString()}\n\n`;
        fs.appendFile(path.join(__dirname, "responses.txt"), logEntry, (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error writing to file.");
                return;
            }

            res.writeHead(302, {
                Location: answer === "Yes" ? "/yes.html" : "/confirm.html",
            });
            res.end();
        });

        return;
    }

    // Handle other choices
    if (pathname === "/log-choice") {
        const choice = queryObject.choice;

        if (!choice) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Bad Request");
            return;
        }

        const logEntry = `Choice: ${choice}\nTime: ${new Date().toLocaleString()}\n\n`;
        fs.appendFile(path.join(__dirname, "responses.txt"), logEntry, (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error writing to file.");
                return;
            }

            let redirectPage = '';
            if (choice === 'Kitchen') {
                redirectPage = '/kitchen.html';
            } else if (choice === 'Pre-Made') {
                redirectPage = '/preMade.html';
            } else if (choice === 'No Hotel') {
                redirectPage = '/noHotel.html';
            }

            res.writeHead(302, { Location: redirectPage });
            res.end();
        });

        return;
    }

    // Serve other HTML pages
    const validPages = ["/yes.html", "/confirm.html", "/reason.html", "/kitchen.html", "/preMade.html", "/noHotel.html"];
    if (validPages.includes(pathname)) {
        serveStaticFile(res, path.join(__dirname, pathname.substring(1)), "text/html");
        return;
    }

    // 404 Not Found
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
});

// ✅ Bind to 0.0.0.0 for Render
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
