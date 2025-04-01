import fetch from 'node-fetch';

app.get('/download', async (req, res) => {
    try {
        const { url } = req.query; // Get the streaming URL from the query parameter
        
        if (!url) {
            return res.status(400).json({ error: "Missing URL parameter" });
        }

        // Fetch the media from the provided URL
        const response = await fetch(url);
        
        // Check if the response is OK (status 200)
        if (!response.ok) {
            return res.status(500).json({ error: "Failed to fetch media from the URL" });
        }
        
        // Set the appropriate headers to force a download (Content-Disposition)
        res.setHeader("Content-Disposition", "attachment; filename=downloaded-media");
        res.setHeader("Content-Type", response.headers.get('Content-Type'));

        // Pipe the media data directly to the response
        response.body.pipe(res);

    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
