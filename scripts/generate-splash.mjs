/**
 * Generate splash screens - SIMPLE RESIZE ONLY, NO EDITING
 * Just resize the logo to fit splash screen sizes, maintaining aspect ratio
 */

import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Source logo - use the full logo as-is
const SOURCE_LOGO = join(projectRoot, 'assets', 'icon.png');

// Logo will take up 90% of screen width/height (MAXIMUM SIZE!)
// This ensures the logo is as large as possible while maintaining aspect ratio

// Android splash sizes (portrait)
const ANDROID_SPLASH_PORT = [
  { name: 'drawable-port-ldpi', width: 320, height: 480 },
  { name: 'drawable-port-mdpi', width: 480, height: 800 },
  { name: 'drawable-port-hdpi', width: 720, height: 1280 },
  { name: 'drawable-port-xhdpi', width: 960, height: 1600 },
  { name: 'drawable-port-xxhdpi', width: 1440, height: 2560 },
  { name: 'drawable-port-xxxhdpi', width: 1920, height: 3200 },
];

// Android splash sizes (landscape)
const ANDROID_SPLASH_LAND = [
  { name: 'drawable-land-ldpi', width: 480, height: 320 },
  { name: 'drawable-land-mdpi', width: 800, height: 480 },
  { name: 'drawable-land-hdpi', width: 1280, height: 720 },
  { name: 'drawable-land-xhdpi', width: 1600, height: 960 },
  { name: 'drawable-land-xxhdpi', width: 2560, height: 1440 },
  { name: 'drawable-land-xxxhdpi', width: 3200, height: 1920 },
];

// Default drawable
const DEFAULT_SPLASH = { name: 'drawable', width: 480, height: 800 };

const ANDROID_RES_PATH = join(projectRoot, 'android', 'app', 'src', 'main', 'res');

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

/**
 * Simple resize - NO editing, just fit logo to splash size
 * The logo already has its orange background, so we just resize it
 * Make logo take up MOST of the screen - use width for portrait, height for landscape
 */
async function createSplash(width, height, outputPath) {
  // Get logo metadata to maintain aspect ratio
  const logoMetadata = await sharp(SOURCE_LOGO).metadata();
  const logoAspectRatio = logoMetadata.width / logoMetadata.height;
  const screenAspectRatio = width / height;
  
  // Determine if portrait or landscape
  const isPortrait = height > width;
  
  // Calculate logo size - use 90% of width for portrait, 90% of height for landscape
  let logoWidth, logoHeight;
  
  if (isPortrait) {
    // Portrait: use width as base (90% of screen width)
    logoWidth = Math.round(width * 0.90);
    logoHeight = Math.round(logoWidth / logoAspectRatio);
    
    // If logo height exceeds screen, scale down based on height
    if (logoHeight > height * 0.90) {
      logoHeight = Math.round(height * 0.90);
      logoWidth = Math.round(logoHeight * logoAspectRatio);
    }
  } else {
    // Landscape: use height as base (90% of screen height)
    logoHeight = Math.round(height * 0.90);
    logoWidth = Math.round(logoHeight * logoAspectRatio);
    
    // If logo width exceeds screen, scale down based on width
    if (logoWidth > width * 0.90) {
      logoWidth = Math.round(width * 0.90);
      logoHeight = Math.round(logoWidth / logoAspectRatio);
    }
  }
  
  // Resize logo with high quality (NO editing, just resize)
  const logoBuffer = await sharp(SOURCE_LOGO)
    .resize(logoWidth, logoHeight, { 
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3
    })
    .png()
    .toBuffer();
  
  // Get background color from logo (extract from corner pixel)
  // For simplicity, use orange background that matches logo
  const bgColor = { r: 245, g: 158, b: 11, alpha: 1 }; // Orange
  
  // Create splash with centered logo
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: bgColor
    }
  })
    .composite([{ input: logoBuffer, gravity: 'center' }])
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);
}

async function generateAndroidSplashes() {
  console.log('📱 Generating Android splash screens (simple resize)...');
  
  // Default drawable
  const defaultDir = join(ANDROID_RES_PATH, DEFAULT_SPLASH.name);
  await ensureDir(defaultDir);
  await createSplash(DEFAULT_SPLASH.width, DEFAULT_SPLASH.height, join(defaultDir, 'splash.png'));
  console.log(`  ✓ ${DEFAULT_SPLASH.name}: ${DEFAULT_SPLASH.width}x${DEFAULT_SPLASH.height}`);
  
  // Portrait splashes
  for (const { name, width, height } of ANDROID_SPLASH_PORT) {
    const outputDir = join(ANDROID_RES_PATH, name);
    await ensureDir(outputDir);
    await createSplash(width, height, join(outputDir, 'splash.png'));
    console.log(`  ✓ ${name}: ${width}x${height}`);
  }
  
  // Landscape splashes
  for (const { name, width, height } of ANDROID_SPLASH_LAND) {
    const outputDir = join(ANDROID_RES_PATH, name);
    await ensureDir(outputDir);
    await createSplash(width, height, join(outputDir, 'splash.png'));
    console.log(`  ✓ ${name}: ${width}x${height}`);
  }
}

async function main() {
  console.log('🎨 Starting splash screen generation...');
  console.log(`   Logo source: ${SOURCE_LOGO}`);
  console.log(`   Simple resize only - NO editing`);
  console.log(`   Logo size: 90% of screen (MAXIMUM!)\n`);
  
  if (!existsSync(SOURCE_LOGO)) {
    console.error('❌ Logo not found:', SOURCE_LOGO);
    process.exit(1);
  }
  
  await generateAndroidSplashes();
  
  console.log('\n✅ All splash screens generated!');
  console.log('   Run "npx cap sync" to update native projects');
}

main().catch(console.error);
