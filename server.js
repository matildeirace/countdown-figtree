const express = require('express');
const { createCanvas, registerFont } = require('canvas');
const GIFEncoder = require('gifencoder');
const path = require('path');

const app = express();

// Registra il font Figtree (assicurati che il file sia nella stessa cartella!)
registerFont(path.join(__dirname, 'Figtree-Regular.ttf'), { family: 'Figtree' });

app.get('/countdown.gif', (req, res) => {
  const width = 800;
  const height = 300;
  const encoder = new GIFEncoder(width, height);

  res.setHeader('Content-Type', 'image/gif');
  encoder.createReadStream().pipe(res);

  encoder.start();
  encoder.setRepeat(0); // infinito
  encoder.setDelay(1000); // 1 fps
  encoder.setQuality(10);

  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  let diff = Math.floor((midnight - now) / 1000);

  for (let i = 0; i < 60; i++) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // sfondo blu
    ctx.fillStyle = '#07038D';
    ctx.fillRect(0, 0, width, height);

    // calcolo countdown
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

    // Testo numeri
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '80px Figtree';

    values.forEach((val, i) => {
      const x = sectionWidth * i + sectionWidth / 2;
      ctx.fillText(val, x, 80);
    });

    // Etichette sotto
    ctx.font = '24px Figtree';
    labels.forEach((label, i) => {
      const x = sectionWidth * i + sectionWidth / 2;
      ctx.fillText(label, x, 180);
    });

    // Due punti ":" tra i blocchi (sopra le etichette)
    ctx.font = '80px Figtree';
    for (let i = 1; i < values.length; i++) {
      const x = sectionWidth * i;
      ctx.fillText(':', x, 80);
    }

    encoder.addFrame(ctx);
    diff--;
  }

  encoder.finish();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Countdown server running on http://localhost:${PORT}/countdown.gif`);
});
