const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core');
const app = express();
const cors = require('cors');
const { URL } = require('url');
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Function to validate YouTube URL
function isValidYouTubeUrl(url) {
    try {
        const parsedUrl = new URL(url);

        // Check for standard YouTube URL
        if (parsedUrl.hostname === 'www.youtube.com') {
            return (
                parsedUrl.searchParams.has('v') &&
                parsedUrl.searchParams.get('v').length === 11
            );
        }

        // Check for shortened YouTube URL
        if (parsedUrl.hostname === 'youtu.be') {
            const videoId = parsedUrl.pathname.substring(1); // Extract the video ID
            return videoId.length === 11;
        }

        // Return false for non-YouTube URLs
        return false;
    } catch (error) {
        console.log('Error:', error.message);
        return false;
    }
}

// Route to fetch video info
app.get('/video-info', async (req, res) => {
    const { Url } = req.query;

    if (!Url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    if (!isValidYouTubeUrl(Url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        const info = await ytdl.getInfo(Url);
        res.json({
            tags: info.videoDetails.keywords,
        });
    } catch (error) {
        if (error.message.includes('Status code: 410')) {
            return res.status(410).json({ error: 'The video is no longer available.' });
        }
        console.error('Error fetching video info:', error.message);
        res.status(500).json({ error: 'Error fetching video info', details: error.message });
    }
});

// Route for /extractedtags page
app.get('/extractedtags', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'extractedtags.html'));
});

app.get('/error.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'error.html'));
});

// Handle other routes
app.use((req, res) => {
    res.redirect('/error.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
