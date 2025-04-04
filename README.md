# MindAid - Your AI Life Coach

MindAid is a mobile-friendly web application that serves as a personal AI life coach, providing guidance, motivation, and support on your personal development journey.

## Features

- **AI Voice Coach**: Talk with your personal AI coach through voice interaction
- **Action Items**: Keep track of personalized tasks and suggestions from your coach
- **Journal**: Record your thoughts, progress, and reflections

## Deployment on Supabase

This application can be easily deployed on Supabase using the built-in deployment tool.

### Prerequisites

1. A Supabase account and project
2. The Supabase project URL and anon key (already configured in config.js)

### Deployment Steps

#### Method 1: Using the Web Deployment Tool

1. Ensure your `config.js` file contains the correct Supabase credentials:
   ```javascript
   const SUPABASE_URL = 'your-supabase-url';
   const SUPABASE_KEY = 'your-supabase-anon-key';
   ```

2. Open `deploy.html` in a web browser
3. Click the "Deploy to Supabase" button
4. Wait for the deployment to complete
5. Access your application at the URL shown in the deployment log

#### Method 2: Manual Deployment

1. Sign in to your Supabase account
2. Navigate to Storage > Buckets
3. Create a new public bucket named "mindaid-app"
4. Upload all the application files to this bucket:
   - index.html
   - actions.html
   - journal.html
   - scripts.js
   - config.js
5. Set the permissions for each file to be publicly accessible
6. Access your application at: `https://[your-project-url].supabase.co/storage/v1/object/public/mindaid-app/index.html`

## Local Development

To run the application locally:

1. Clone this repository
2. Ensure your `config.js` file is properly configured
3. Open `index.html` in a web browser

## Configuration

Edit the `config.js` file to change the Supabase and Vapi credentials:

```javascript
// Supabase configuration
const SUPABASE_URL = 'https://hrkvhigbrnsqltxbhvez.supabase.co';
const SUPABASE_KEY = 'your-supabase-anon-key';

// Vapi configuration
const VAPI_ASSISTANT_ID = 'your-vapi-assistant-id';
const VAPI_SHARE_KEY = 'your-vapi-share-key';
```

## Technologies Used

- HTML5/CSS3 for the UI
- JavaScript for interactivity
- Vapi Web SDK for voice interaction
- Supabase for backend and hosting
- Font Awesome for icons 