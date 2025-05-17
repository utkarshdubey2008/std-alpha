const express = require("express");
const request = require("request");
const path = require("path");

const app = express();

app.get("/download", (req, res) => {
    const fileUrl = req.query.url;
    const fileName = req.query.name || "download";
    const fileExt = req.query.ext || "mp4";

    if (!fileUrl) {
        return res.status(400).json({ error: "No URL provided" });
    }

    // Supported MIME types
    const mimeTypes = {
        "mp4": "video/mp4",
        "webm": "audio/webm",
        "mp3": "audio/mpeg",
        "m4a": "audio/mp4",
        "ogg": "audio/ogg",
        "wav": "audio/wav",
        "flac": "audio/flac",
        "mov": "video/quicktime",
        "avi": "video/x-msvideo",
        "mkv": "video/x-matroska"
    };

    const mimeType = mimeTypes[fileExt.toLowerCase()] || "application/octet-stream";

    // Set headers to force file download
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}.${fileExt}`);
    res.setHeader("Content-Type", mimeType);

    // Stream the file to the response
    request(fileUrl)
        .on("response", (response) => {
            if (response.statusCode !== 200) {
                return res.status(500).json({ error: "Failed to fetch file" });
            }
        })
        .on("error", (err) => {
            console.error("Download error:", err);
            return res.status(500).json({ error: "Download failed" });
        })
        .pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
