# MindAid Deployment Guide

This guide covers how to deploy your MindAid application to Vercel.

## Deploying to Vercel

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```
   npm install -g vercel
   ```

2. **Log in to your Vercel account**:
   ```
   vercel login
   ```

3. **Remove any previous failed deployments (if applicable)**:
   ```
   vercel remove mindaid
   ```

4. **Deploy your application**:
   ```
   vercel --prod
   ```

5. When prompted, choose the following options:
   - Set up and deploy: **Y**
   - Which scope: **(your scope)**
   - Link to existing project: **N**
   - Project name: **mindaid** (or your preferred name)
   - Directory: **./** (default)
   - Build settings: **(use default)**

### Method 2: Deploy via Vercel Dashboard

1. **Create a Git repository** (GitHub, GitLab, or Bitbucket)
2. **Push your code** to the repository
3. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
4. **Click "New Project"**
5. **Import your repository**
6. **Configure project** with the following settings:
   - Framework Preset: **Other**
   - Root Directory: **.//** (default)
   - Build Command: **npm run build**
   - Output Directory: **public** (important!)
   - Install Command: **npm install**

## Troubleshooting Common Issues

### 404 Error on Deployment

If you see a 404 error after deployment, try one of these solutions:

1. **Redeploy with the correct build settings**:
   ```
   vercel --prod
   ```

2. **Check your server.js file** to ensure it's properly serving the index.html file

3. **Verify project structure**:
   - Make sure all your HTML files are in the root directory
   - Ensure all paths in your HTML files are relative

4. **Check Vercel logs**:
   - Go to your Vercel dashboard
   - Select your project
   - Click on the latest deployment
   - Check the "Functions" and "Build" logs for errors

5. **Try a clean deployment**:
   ```
   vercel --prod --force
   ```

### Missing Files

If files are missing in your deployment:

1. **Run the build script locally** to verify it works:
   ```
   npm run build
   ```

2. **Check the public directory** after building to ensure files are copied correctly

3. **Deploy with build debug enabled**:
   ```
   vercel --prod --debug
   ```

## Manual Deployment Fallback

If automated deployment is still failing, try this manual approach:

1. **Build your project locally**:
   ```
   npm run build
   ```

2. **Create a new directory** for deployment:
   ```
   mkdir deploy
   ```

3. **Copy all required files** to the deploy directory:
   ```
   cp -r public/* deploy/
   cp server.js deploy/
   cp package.json deploy/
   cp vercel.json deploy/
   ```

4. **Deploy the directory**:
   ```
   cd deploy
   vercel --prod
   ```

## Getting Help

If you're still experiencing issues:

1. **Check Vercel documentation**: https://vercel.com/docs
2. **Consult the Vercel community**: https://github.com/vercel/community
3. **Open an issue** on the MindAid repository
4. **Contact Vercel support** through your dashboard 