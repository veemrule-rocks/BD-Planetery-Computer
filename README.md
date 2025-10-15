# BengalInsight - Environmental Monitoring Platform

A modern web application for monitoring environmental data, climate patterns, and satellite imagery for Bengal region using NASA's Planetary Computer data.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Radix UI + Tailwind CSS
- **Backend**: Cloudflare Pages Functions (serverless)
- **Data Sources**: NASA Planetary Computer, Sentinel-1/2 Satellite Data
- **Deployment**: Cloudflare Pages

## 📁 Project Structure

```
BengalInsight/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities and helpers
│   └── index.html
├── functions/           # Cloudflare Pages Functions (API endpoints)
│   ├── api/
│   │   ├── alerts.ts
│   │   ├── climate/
│   │   ├── districts/
│   │   ├── metrics/
│   │   ├── region/
│   │   └── satellite/
│   └── _shared/         # Shared utilities for functions
├── server/              # Local development Express server (not deployed)
├── shared/              # Shared TypeScript types
└── dist/                # Build output (auto-generated)
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/veemrule-rocks/BD-Planetery-Computer.git
cd BengalInsight
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🌐 Deployment to Cloudflare Pages

### Option 1: Via Wrangler CLI (Recommended)

1. Install Wrangler globally (if not already installed):
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Build and deploy:
```bash
npm run build
wrangler pages deploy
```

### Option 2: Via Cloudflare Dashboard (Git Integration)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Ready for Cloudflare deployment"
git push origin main
```

2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Navigate to **Pages** → **Create a project**
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)
6. Click **Save and Deploy**

### Option 3: Using npm scripts

```bash
# Deploy using wrangler
npm run pages:deploy

# OR using shorthand
npm run cf:deploy
```

## 📡 API Endpoints (Cloudflare Functions)

All API endpoints are automatically deployed as serverless functions:

- `GET /api/alerts` - Get active environmental alerts
- `GET /api/climate/data?year=2024` - Get climate data for specific year
- `GET /api/districts/data` - Get district-level data
- `GET /api/metrics/current` - Get current environmental metrics
- `GET /api/region/[district]` - Get specific region data
- `GET /api/satellite/search` - Search satellite imagery
- `GET /api/satellite/sentinel1/latest` - Get latest Sentinel-1 data
- `GET /api/satellite/sentinel2/latest` - Get latest Sentinel-2 data

## 🔧 Environment Variables

Create a `.env` file (for local development only - not needed for Cloudflare):

```env
# Add any required environment variables here
ENVIRONMENT=development
```

For production, configure environment variables in Cloudflare Dashboard:
1. Go to your Pages project
2. Settings → Environment variables
3. Add required variables

## 🎯 Key Features

- 📊 Real-time environmental metrics dashboard
- 🗺️ Interactive map visualization
- 🛰️ Satellite imagery from Sentinel-1 and Sentinel-2
- 📈 Climate data analysis and trends
- ⚠️ Environmental alerts and warnings
- 🌡️ Temperature, humidity, and rainfall monitoring
- 🌊 Flood monitoring and predictions

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run check        # Type-check TypeScript
npm run pages:dev    # Test with Cloudflare Pages locally
npm run pages:deploy # Deploy to Cloudflare Pages
npm run cf:deploy    # Alias for pages:deploy
```

## 🧪 Testing Cloudflare Pages Locally

```bash
# Build first
npm run build

# Run with Cloudflare Pages dev server
npm run pages:dev
```

This simulates the Cloudflare Pages environment locally.

## 📦 Dependencies

### Key Frontend Libraries
- React 18 + React DOM
- Wouter (routing)
- TanStack Query (data fetching)
- Radix UI (accessible components)
- Tailwind CSS (styling)
- Recharts (data visualization)
- Framer Motion (animations)

### Backend/Functions
- Cloudflare Workers/Pages Functions API
- No Express in production (Express only used for local dev)

## 🚨 Important Notes

1. **No Node.js APIs in Functions**: Cloudflare Functions run on Workers runtime, not Node.js. Avoid using Node.js-specific APIs like `fs`, `path`, etc.

2. **Express is Dev-Only**: The `server/` directory and Express are ONLY for local development. They are NOT deployed to Cloudflare.

3. **Functions Format**: All functions in `/functions` must export an `onRequest` handler:
```typescript
export async function onRequest(context: any) {
  return Response.json({ data: "..." });
}
```

4. **Build Output**: Only the `dist/` folder is deployed. Functions are automatically picked up from `/functions`.

## 🔗 Useful Links

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [NASA Planetary Computer](https://planetarycomputer.microsoft.com/)

## 📄 License

MIT

## 👤 Author

Developed for environmental monitoring and climate analysis in the Bengal region.
