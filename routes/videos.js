const fs = require('fs');
const express = require('express');
const router = express.Router();
const generateUniqueId = require('generate-unique-id');

const videosDataPath = "./data/videos.json";

const readVideoData = () => {
  try {
    const data = fs.readFileSync(videosDataPath);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading video data:", error);
    return [];
  }
};
  
  const writeVideosData = (videos) => {
    try {
      fs.writeFileSync(videosDataPath, JSON.stringify(videos, null, 2));
  } catch (error) {
      console.error("Error writing video data:", error);
  }
};

  
  // GET /videos
router.get('/', (req, res) => {
    try {
      const videos = readVideoData();
      const nextVideo = videos.map(video => ({
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image
      }));
      res.status(200).json(nextVideo);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      fs.readFile(videosDataPath, (err, data) => {
        if (err) {
          res.status(500).json({ message: 'Internal server error' });
          return;
        }
        const videos = JSON.parse(data);
        const video = videos.find((video) => video.id === id);
        if (video) {
          res.json(video);
        } else {
          res.status(404).json({ message: 'Video not found' });
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
});
  
// GET /videos/:id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile(videosDataPath, (err, data) => {
      if (err) {
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      const videos = JSON.parse(data);
      const video = videos.find((v) => v.id === id);
      if (video) {
        res.json(video);
      } else {
        res.status(404).json({ message: 'Video not found' });
      }
    });
});
  
// POST /videos
router.post('/', (req, res) => {
  const { title, description, image } = req.body;
  const videos = readVideoData();
  const id = generateUniqueId({
    length: 38,
    capitalization:'lowercase',
    excludeSymbols: ['@','#','|'],
    symbols: false
  });
  const channel = "Ryan Hernandez";
  const views = '0';
  const likes = '0';
  const comments = [];
  const timestamp = Date.now();
  const duration = '00:00';
  const newVideo = image;
  videos.push({ id, title, channel, image, description, views, likes, duration, newVideo, timestamp, comments });
  fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
  writeVideosData(videos);
  res.status(201).json({ id, title, channel, image, description, views, likes, duration, newVideo, timestamp, comments });
})


module.exports = router;