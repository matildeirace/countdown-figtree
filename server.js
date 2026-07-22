const express = require('express');
const { createCanvas, registerFont } = require('canvas');
const GIFEncoder = require('gifencoder');
const path = require('path');

const app = express();

registerFont(path.join(__dirname, 'Figtree-Regular.ttf'), { family: 'Figtree' });

app.get('/countdown.gif', (req, res) => {
  const width = 600;
  const height = 150;
  const encoder = new GIFEncoder(width, height);

  res.setHeader('Content-Type', 'image/gif');
  encoder.createReadStream().pipe(res);

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000);
  encoder.setQuality(10);

  const now = new Date();
  const target = new Date('2026-07-23T23:59:00');
  let diff = Math.max(0, Math.floor((target - now) / 1000));

  for (let i = 0; i < 10; i++) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#006FFF';
    ctx.fillRect(0, 0, width, height);

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    const values = [
      String(days).padStart(2, '0'),
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0'),
    ];

    const labels = ['Giorni', 'Ore', 'Minuti', 'Secondi'];
    const sectionWidth = width / values.length;

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '64px Figtree';

    values.forEach((val, i) => {
      const x = sectionWidth * i + sectionWidth / 2;
      ctx.fillText(val, x, 24);
    });

    ctx.font = '18px Figtree';
    labels.forEach((label, i) => {
      const x = sectionWidth * i + sectionWidth / 2;
      ctx.fillText(label, x, 104);
    });

    ctx.font = '64px Figtree';
    for (let j = 1; j < values.length; j++) {
      const x = sectionWidth * j;
      ctx.fillText(':', x, 24);
    }

    encoder.addFrame(ctx);
    diff--;
  }

  encoder.finish();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Countdown server running on http://localhost:${PORT}/countdown.gif`);
});
