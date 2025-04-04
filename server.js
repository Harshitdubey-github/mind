import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Public directory path
const publicDir = join(__dirname, 'public');

// Log for debugging in Vercel
console.log('Current directory:', __dirname);
console.log('Public directory:', publicDir);
if (fs.existsSync(publicDir)) {
  console.log('Files in public directory:', fs.readdirSync(publicDir));
} else {
  console.log('Public directory does not exist');
  // Try root directory
  console.log('Files in root directory:', fs.readdirSync(__dirname));
}

// Serve static files first from public directory, then from root
app.use(express.static(publicDir));
app.use(express.static(__dirname));

// Routes - explicit routing
app.get('/', (req, res) => {
  const indexPath = join(publicDir, 'index.html');
  const fallbackPath = join(__dirname, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    console.log('Serving index.html from public directory');
    res.sendFile(indexPath);
  } else if (fs.existsSync(fallbackPath)) {
    console.log('Serving index.html from root directory');
    res.sendFile(fallbackPath);
  } else {
    console.log('index.html not found');
    res.status(404).send('Index file not found');
  }
});

app.get('/actions', (req, res) => {
  const filePath = join(publicDir, 'actions.html');
  const fallbackPath = join(__dirname, 'actions.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else if (fs.existsSync(fallbackPath)) {
    res.sendFile(fallbackPath);
  } else {
    res.status(404).send('Actions page not found');
  }
});

app.get('/journal', (req, res) => {
  const filePath = join(publicDir, 'journal.html');
  const fallbackPath = join(__dirname, 'journal.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else if (fs.existsSync(fallbackPath)) {
    res.sendFile(fallbackPath);
  } else {
    res.status(404).send('Journal page not found');
  }
});

// Fallback for other routes
app.use((req, res) => {
  console.log('404 for:', req.url);
  res.status(404).send('Page not found');
});

// Start the server (not needed for Vercel, but useful for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for Vercel
export default app; 