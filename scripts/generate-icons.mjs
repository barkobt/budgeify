/**
 * PWA Icon Generator
 * Converts icon.svg to PNG icons for PWA manifest.
 * Run: node scripts/generate-icons.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const svgBuffer = readFileSync(resolve(ROOT, 'public/icon.svg'));

const sizes = [
  { name: 'favicon-32.png', size: 32 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-icon-180.png', size: 180 },
];

async function generate() {
  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(resolve(ROOT, 'public', name));
    console.log(`Generated: public/${name} (${size}x${size})`);
  }
  console.log('All icons generated.');
}

generate().catch(console.error);
