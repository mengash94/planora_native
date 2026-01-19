import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceIcon = path.join(__dirname, 'assets', 'icon.png');
const outputDir = path.join(__dirname, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');

// All required iOS app icons
const icons = [
  { name: 'AppIcon-20x20@1x.png', size: 20 },
  { name: 'AppIcon-20x20@2x.png', size: 40 },
  { name: 'AppIcon-20x20@3x.png', size: 60 },
  { name: 'AppIcon-29x29@1x.png', size: 29 },
  { name: 'AppIcon-29x29@2x.png', size: 58 },
  { name: 'AppIcon-29x29@3x.png', size: 87 },
  { name: 'AppIcon-40x40@1x.png', size: 40 },
  { name: 'AppIcon-40x40@2x.png', size: 80 },
  { name: 'AppIcon-40x40@3x.png', size: 120 },
  { name: 'AppIcon-60x60@2x.png', size: 120 },  // <-- This is the critical 120x120 iPhone icon!
  { name: 'AppIcon-60x60@3x.png', size: 180 },
  { name: 'AppIcon-76x76@1x.png', size: 76 },
  { name: 'AppIcon-76x76@2x.png', size: 152 },
  { name: 'AppIcon-83.5x83.5@2x.png', size: 167 },
  { name: 'AppIcon-512@2x.png', size: 1024 },
];

async function generateIcons() {
  console.log('Generating iOS app icons...');
  console.log('Source:', sourceIcon);
  console.log('Output:', outputDir);

  for (const icon of icons) {
    const outputPath = path.join(outputDir, icon.name);
    console.log(`Creating ${icon.name} (${icon.size}x${icon.size})...`);
    
    await sharp(sourceIcon)
      .resize(icon.size, icon.size)
      .png()
      .toFile(outputPath);
  }

  console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);

