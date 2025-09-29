const express = require('express');
const { createCanvas, registerFont } = require('canvas');
const path = require('path');

const app = express();

// Registra il font Figtree
registerFont(path.join(__dirname, 'Figtree-Regular.ttf'), { family: 'Figtree' });

app.get('/countdown.png', (req, res) => {
  const now = new Date();

  // Prossima mezzanotte
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diff = midnight - now;
  const seconds = Math.floor(diff / 1000);

  const d = String(Math.floor(seconds / (3600 * 24))).padStart(2, '0');
  const h = String(Math.floor((seconds % (3600 * 24)) / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');

  const values = [d, h, m, s];
  const labels = ['giorni', 'ore', 'minuti', 'secondi'];

  const canvasWidth = 850;
  const canvasHeight = 250;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Sfondo blu
  ctx.fillStyle = '#07038D';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Imposta font per numeri
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 72px Figtree';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const sectionWidth = canvasWidth / values.length;
  const topPadding = 40;
  const labelPadding = 150;

  // Disegna numeri
  values.forEach((val, i) => {
    const x = sectionWidth * i + sectionWidth / 2;
    ctx.fillText(val, x, topPadding);
  });

  // Disegna i ":" tra i numeri
  ctx.font = 'bold 72px Figtree';
  for (let i = 0; i < values.length - 1; i++) {
    const x = sectionWidth * (i + 1);
    ctx.fillText(':', x, topPadding);
  }

  // Etichette
  ctx.font = '24px Figtree';
  labels.forEach((label, i) => {
    const x = sectionWidth * i + sectionWidth / 2;
    ctx.fillText(label, x, labelPadding);
  });

  // Output
  res.setHeader('Content-Type', 'image/png');
  canvas.pngStream().pipe(res);
});

// ✅ CHIUSURA SERVER (questa riga mancava nel tuo file)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Countdown server running on http://localhost:${PORT}/countdown.png`);
})