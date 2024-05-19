const express = require('express');
const app = express();
const videosRouter = require('./routes/videos');
const cors = require('cors');

app.use(cors());
app.use(cors({ origin: process.env.FRONTEND_BASE_URL }));

app.use(express.json());
app.use(express.static('public/images'));

app.use('/videos', videosRouter);

app.listen(8080, () => {
    console.log('running on port 8080');
});