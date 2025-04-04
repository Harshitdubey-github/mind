# Deploying MindAid to Vercel

This guide explains how to deploy your MindAid application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (you can sign up with GitHub, GitLab, or email)
2. [Git](https://git-scm.com/downloads) installed on your computer
3. [Node.js](https://nodejs.org/) (v14 or newer) and npm installed

## Deployment Steps

### Option 1: Deploy with Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory and login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project (use default settings if unsure)

5. Once deployed, Vercel will provide you with a URL to access your app

### Option 2: Deploy with GitHub/GitLab Integration

1. Push your project to a GitHub or GitLab repository

2. Log in to your [Vercel dashboard](https://vercel.com/dashboard)

3. Click "New Project"

4. Import your repository from GitHub/GitLab

5. Configure your project:
   - Keep the default settings
   - Set the "Framework Preset" to "Other"
   - Click "Deploy"

6. Vercel will build and deploy your project, providing you with a deployment URL

## Environment Variables

If you need to set environment variables (for Supabase credentials):

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following variables:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_KEY` - Your Supabase public API key

## Custom Domain

To use a custom domain:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your domain and follow the DNS configuration instructions

## Troubleshooting

If you encounter issues:

1. Check your browser console for errors
2. Review the build logs in your Vercel dashboard
3. Ensure your project structure matches the requirements in vercel.json
4. Make sure all dependencies are correctly listed in package.json

## Local Testing

Before deploying, test your app locally:

```bash
npm install
npm run dev
```

Your app should be available at http://localhost:3000. 