const express = require("express");
const request = require("request");
const app = express();

app.get("/download", (req, res) => {
    const videoUrl = req.query.url; // Get the stream link from query params

    if (!videoUrl) {
        return res.status(400).json({ error: "No URL provided" });
    }

    // Set headers to force download
    res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
    res.setHeader("Content-Type", "video/mp4");

    // Pipe the video stream to the response
    request(videoUrl)
        .on("error", () => res.status(500).json({ error: "Download failed" }))
        .pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)
