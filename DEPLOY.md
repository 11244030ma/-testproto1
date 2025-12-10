# Deploy Premium Food App to Vercel

## ✅ Ready to Deploy!

Your app is now web-ready and can be deployed to Vercel. The build was successful and all components are web-compatible.

## Quick Deploy (Recommended)

### Option 1: GitHub Integration (Easiest)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add web support for Vercel deployment"
   git push origin main
   ```

2. **Deploy with Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Import your repository
   - Vercel will automatically detect the configuration
   - Click "Deploy"
   - Your app will be live in ~2 minutes!

### Option 2: Direct Upload

1. **Build locally:**
   ```bash
   cd premium-food-app
   npm run build:web
   ```

2. **Deploy the dist folder:**
   - Go to [vercel.com](https://vercel.com)
   - Drag and drop the `dist` folder
   - Your app will be deployed instantly!

## Manual Deploy via CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project directory:**
   ```bash
   cd premium-food-app
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N** (for first deploy)
   - What's your project's name? **premium-food-app**
   - In which directory is your code located? **.**

## Local Development

To test the web version locally:

```bash
cd premium-food-app
npm install
npm run web
```

This will start the Expo web development server at `http://localhost:19006`

## Features Available on Web

✅ **Working Features:**
- All UI components with premium design system
- Navigation between screens
- Restaurant browsing and search
- Cart functionality
- Checkout flow
- Order confirmation
- Profile management
- Responsive design

⚠️ **Web Adaptations:**
- Map view shows styled restaurant list instead of interactive map
- Glassmorphism effects use CSS backdrop-filter
- Touch interactions work with mouse/touch
- All animations and transitions preserved

## Accessing on Your Phone

Once deployed to Vercel:

1. **Get the deployment URL** from Vercel dashboard
2. **Open the URL on your iPhone** in Safari or Chrome
3. **Add to Home Screen** for app-like experience:
   - Tap the Share button in Safari
   - Select "Add to Home Screen"
   - The app will behave like a native app

## Environment Variables

If you need to add API keys or configuration:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add your variables (e.g., `GOOGLE_MAPS_API_KEY`)

## Custom Domain

To use your own domain:

1. Go to Vercel project dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions