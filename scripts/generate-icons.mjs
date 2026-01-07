/**
 * Generate app icons - SIMPLE RESIZE ONLY, NO EDITING
 * Just resize the logo to fit required sizes, maintaining aspect ratio
 */

import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const LOGO_SOURCE = join(projectRoot, 'assets', 'icon.png');

const ANDROID_ICON_SIZES = [
  { name: 'mipmap-ldpi', size: 36 },
  { name: 'mipmap-mdpi', size: 48 },
  { name: 'mipmap-hdpi', size: 72 },
  { name: 'mipmap-xhdpi', size: 96 },
  { name: 'mipmap-xxhdpi', size: 144 },
  { name: 'mipmap-xxxhdpi', size: 192 },
];

const ANDROID_ADAPTIVE_SIZES = [
  { name: 'mipmap-ldpi', size: 81 },
  { name: 'mipmap-mdpi', size: 108 },
  { name: 'mipmap-hdpi', size: 162 },
  { name: 'mipmap-xhdpi', size: 216 },
  { name: 'mipmap-xxhdpi', size: 324 },
  { name: 'mipmap-xxxhdpi', size: 432 },
];

const IOS_ICON_SIZES = [
  { name: 'AppIcon-20x20@1x.png', size: 20 },
  { name: 'AppIcon-20x20@2x.png', size: 40 },
  { name: 'AppIcon-20x20@3x.png', size: 60 },
  { name: 'AppIcon-29x29@1x.png', size: 29 },
  { name: 'AppIcon-29x29@2x.png', size: 58 },
  { name: 'AppIcon-29x29@3x.png', size: 87 },
  { name: 'AppIcon-40x40@1x.png', size: 40 },
  { name: 'AppIcon-40x40@2x.png', size: 80 },
  { name: 'AppIcon-40x40@3x.png', size: 120 },
  { name: 'AppIcon-60x60@2x.png', size: 120 },
  { name: 'AppIcon-60x60@3x.png', size: 180 },
  { name: 'AppIcon-76x76@1x.png', size: 76 },
  { name: 'AppIcon-76x76@2x.png', size: 152 },
  { name: 'AppIcon-83.5x83.5@2x.png', size: 167 },
  { name: 'AppIcon-512@2x.png', size: 1024 },
];

const ANDROID_RES_PATH = join(projectRoot, 'android', 'app', 'src', 'main', 'res');
const IOS_ASSETS_PATH = join(projectRoot, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

/**
 * Simple resize - NO editing, just fit to size maintaining aspect ratio
 */
async function resizeLogo(sourceImage, targetSize) {
  return sharp(sourceImage)
    .resize(targetSize, targetSize, {
      fit: 'contain', // Maintain aspect ratio, fit within size
      background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background if needed
      kernel: sharp.kernel.lanczos3 // High quality resizing
    })
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
}

async function generateAndroidIcons() {
  console.log('📱 Generating Android icons (simple resize)...');
  
  for (const { name, size } of ANDROID_ICON_SIZES) {
    const outputDir = join(ANDROID_RES_PATH, name);
    await ensureDir(outputDir);
    
    const iconBuffer = await resizeLogo(LOGO_SOURCE, size);
    
    await sharp(iconBuffer)
      .toFile(join(outputDir, 'ic_launcher.png'));
    
    await sharp(iconBuffer)
      .toFile(join(outputDir, 'ic_launcher_round.png'));
    
    console.log(`  ✓ ${name}: ${size}x${size}`);
  }
  
  console.log('📱 Generating adaptive layers...');
  for (const { name, size } of ANDROID_ADAPTIVE_SIZES) {
    const outputDir = join(ANDROID_RES_PATH, name);
    await ensureDir(outputDir);
    
    // Foreground: logo resized to 65% (safe zone)
    const foregroundSize = Math.round(size * 0.65);
    const foregroundBuffer = await resizeLogo(LOGO_SOURCE, foregroundSize);
    
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{
        input: foregroundBuffer,
        gravity: 'center'
      }])
      .png({ quality: 100 })
      .toFile(join(outputDir, 'ic_launcher_foreground.png'));
    
    // Background: extract background color from logo (orange)
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 245, g: 158, b: 11, alpha: 1 } // Orange from logo
      }
    })
      .png()
      .toFile(join(outputDir, 'ic_launcher_background.png'));
    
    console.log(`  ✓ ${name} adaptive: ${size}x${size}`);
  }
  
  // Create adaptive icon XML
  const anydpiV26Dir = join(ANDROID_RES_PATH, 'mipmap-anydpi-v26');
  await ensureDir(anydpiV26Dir);
  
  const adaptiveIconXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;

  const fs = await import('fs/promises');
  await fs.writeFile(join(anydpiV26Dir, 'ic_launcher.xml'), adaptiveIconXml);
  await fs.writeFile(join(anydpiV26Dir, 'ic_launcher_round.xml'), adaptiveIconXml);
  
  // Create background color XML
  const valuesDir = join(ANDROID_RES_PATH, 'values');
  await ensureDir(valuesDir);
  const backgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#F59E0B</color>
</resources>`;
  await fs.writeFile(join(valuesDir, 'ic_launcher_background.xml'), backgroundXml);
}

async function generateIOSIcons() {
  console.log('🍎 Generating iOS icons (simple resize)...');
  await ensureDir(IOS_ASSETS_PATH);
  
  for (const { name, size } of IOS_ICON_SIZES) {
    const iconBuffer = await resizeLogo(LOGO_SOURCE, size);
    
    await sharp(iconBuffer)
      .toFile(join(IOS_ASSETS_PATH, name));
    
    console.log(`  ✓ ${name}: ${size}x${size}`);
  }
  
  const contentsJson = {
    "images": [
      { "filename": "AppIcon-20x20@1x.png", "idiom": "iphone", "scale": "1x", "size": "20x20" },
      { "filename": "AppIcon-20x20@2x.png", "idiom": "iphone", "scale": "2x", "size": "20x20" },
      { "filename": "AppIcon-20x20@3x.png", "idiom": "iphone", "scale": "3x", "size": "20x20" },
      { "filename": "AppIcon-29x29@1x.png", "idiom": "iphone", "scale": "1x", "size": "29x29" },
      { "filename": "AppIcon-29x29@2x.png", "idiom": "iphone", "scale": "2x", "size": "29x29" },
      { "filename": "AppIcon-29x29@3x.png", "idiom": "iphone", "scale": "3x", "size": "29x29" },
      { "filename": "AppIcon-40x40@1x.png", "idiom": "iphone", "scale": "1x", "size": "40x40" },
      { "filename": "AppIcon-40x40@2x.png", "idiom": "iphone", "scale": "2x", "size": "40x40" },
      { "filename": "AppIcon-40x40@3x.png", "idiom": "iphone", "scale": "3x", "size": "40x40" },
      { "filename": "AppIcon-60x60@2x.png", "idiom": "iphone", "scale": "2x", "size": "60x60" },
      { "filename": "AppIcon-60x60@3x.png", "idiom": "iphone", "scale": "3x", "size": "60x60" },
      { "filename": "AppIcon-20x20@1x.png", "idiom": "ipad", "scale": "1x", "size": "20x20" },
      { "filename": "AppIcon-20x20@2x.png", "idiom": "ipad", "scale": "2x", "size": "20x20" },
      { "filename": "AppIcon-29x29@1x.png", "idiom": "ipad", "scale": "1x", "size": "29x29" },
      { "filename": "AppIcon-29x29@2x.png", "idiom": "ipad", "scale": "2x", "size": "29x29" },
      { "filename": "AppIcon-40x40@1x.png", "idiom": "ipad", "scale": "1x", "size": "40x40" },
      { "filename": "AppIcon-40x40@2x.png", "idiom": "ipad", "scale": "2x", "size": "40x40" },
      { "filename": "AppIcon-76x76@1x.png", "idiom": "ipad", "scale": "1x", "size": "76x76" },
      { "filename": "AppIcon-76x76@2x.png", "idiom": "ipad", "scale": "2x", "size": "76x76" },
      { "filename": "AppIcon-83.5x83.5@2x.png", "idiom": "ipad", "scale": "2x", "size": "83.5x83.5" },
      { "filename": "AppIcon-512@2x.png", "idiom": "ios-marketing", "scale": "1x", "size": "1024x1024" }
    ],
    "info": { "author": "xcode", "version": 1 }
  };
  
  const fs = await import('fs/promises');
  await fs.writeFile(
    join(IOS_ASSETS_PATH, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2)
  );
}

async function main() {
  console.log('🎨 Creating app icons...');
  console.log('   📱 Simple resize only - NO editing');
  console.log('   ✅ Maintaining aspect ratio\n');
  
  if (!existsSync(LOGO_SOURCE)) {
    console.error('❌ Logo not found:', LOGO_SOURCE);
    process.exit(1);
  }
  
  await generateAndroidIcons();
  await generateIOSIcons();
  
  console.log('\n✅ Icons created!');
  console.log('   Run "npx cap sync"');
}

main().catch(console.error);
