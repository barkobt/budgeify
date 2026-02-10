/**
 * PWA + Favicon Icon Generator
 * Converts neon pig SVG into favicon, Apple touch icon and PWA icons.
 * Run: node scripts/generate-icons.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const svgBuffer = readFileSync(resolve(ROOT, 'assets/brand/neon-pig.svg'));

const sizes = [
  { name: 'favicon-16x16.png', size: 16, format: 'png' },
  { name: 'favicon-32x32.png', size: 32, format: 'png' },
  { name: 'favicon.ico', size: 64, format: 'ico' },
  { name: 'apple-touch-icon.png', size: 180, format: 'png' },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

async function generate() {
  for (const { name, size, format = 'png' } of sizes) {
    const target = resolve(ROOT, 'public', name);
    const pipeline = sharp(svgBuffer)
      .resize(size, size)
      .flatten({ background: '#05050d' });

    if (format === 'ico') {
      await pipeline.toFile(target);
    } else {
      await pipeline.png().toFile(target);
    }

    console.log(`Generated: public/${name} (${size}x${size})`);
  }
  console.log('All icons generated.');
}

generate().catch(console.error);
