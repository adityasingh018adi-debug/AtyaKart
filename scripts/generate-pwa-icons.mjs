import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const outDir = join(process.cwd(), "public", "icons");
mkdirSync(outDir, { recursive: true });

const svg = (size, padding = 0) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ef4444"/>
      <stop offset="1" stop-color="#f97316"/>
    </linearGradient>
  </defs>
  <rect x="${padding}" y="${padding}" width="${512 - padding * 2}" height="${512 - padding * 2}" rx="96" fill="url(#g)"/>
  <text x="256" y="296" font-family="Arial, sans-serif" font-size="220" font-weight="800" fill="white" text-anchor="middle">AK</text>
</svg>`;

const targets = [
  { name: "icon-192.png", size: 192, padding: 0 },
  { name: "icon-512.png", size: 512, padding: 0 },
  { name: "maskable-192.png", size: 192, padding: 64 },
  { name: "maskable-512.png", size: 512, padding: 160 },
];

for (const t of targets) {
  const buf = await sharp(Buffer.from(svg(t.size, t.padding))).png().toBuffer();
  writeFileSync(join(outDir, t.name), buf);
  console.log("wrote", t.name);
}
