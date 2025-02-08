const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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

    // Serve the main page when visiting localhost:3000
    if (pathname === "/") {
        serveStaticFile(res, "index.html", "text/html");
        return;
    } else if (pathname === "/roseDay.html") {
        serveStaticFile(res, "roseDay.html", "text/html");
        return;
    }

    // Serve static files (CSS, JS, etc.)
    const ext = path.extname(pathname);
    if (ext) {
        const contentType = {
            ".css": "text/css",
            ".js": "application/javascript",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".gif": "image/gif",
            ".html": "text/html"  // Added for HTML files
        }[ext] || "text/plain";

        serveStaticFile(res, "." + pathname, contentType);
        return;
    }

    // Handle user responses (Yes or No)
    if (pathname === "/response") {
        const answer = queryObject.answer;
        const reason = queryObject.reason || "N/A"; // Default to "N/A" if no reason

        if (!answer) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Bad Request");
            return;
        }

        // Log answer and reason to responses.txt
        const logEntry = `Answer: ${answer}\nReason: ${reason}\nTime: ${new Date().toLocaleString()}\n\n`;
        fs.appendFile("responses.txt", logEntry, (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error writing to file.");
                return;
            }

            // Redirect based on the answer
            res.writeHead(302, {
                Location: answer === "Yes" ? "/yes.html" : "/confirm.html",
            });
            res.end();
        });

        return;
    }

    // Handle responses for Kitchen, Pre-Made, No Hotel
    if (pathname === "/log-choice") {
        const choice = queryObject.choice;

        if (!choice) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Bad Request");
            return;
        }

        // Log the choice (Kitchen, Pre-Made, No Hotel) to responses.txt
        const logEntry = `Choice: ${choice}\nTime: ${new Date().toLocaleString()}\n\n`;
        fs.appendFile("responses.txt", logEntry, (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error writing to file.");
                return;
            }

            // Redirect to the corresponding page
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

    // Serve the HTML pages (yes.html, confirm.html, etc.)
    if (["/yes.html", "/confirm.html", "/reason.html", "/kitchen.html", "/preMade.html", "/noHotel.html"].includes(pathname)) {
        serveStaticFile(res, pathname.substring(1), "text/html");
        return;
    }

    // If route is unknown, return 404
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
