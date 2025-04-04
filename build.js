import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// List of files to copy to public directory
const filesToCopy = [
  'index.html',
  'actions.html',
  'journal.html',
  'scripts.js',
  'config.js'
];

// Copy each file to the public directory
filesToCopy.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to public directory`);
  } else {
    console.warn(`Warning: ${file} not found`);
  }
});

console.log('Build process completed!'); 