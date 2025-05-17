export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing 'url' query parameter.");
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    const fileName = decodedUrl.split('/').pop().split('?')[0] || 'video.mp4';

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const response = await fetch(decodedUrl);

    if (!response.ok) {
      return res.status(500).send("Failed to fetch the video.");
    }

    response.body.pipe(res);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}
