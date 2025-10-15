# BengalInsight - Environmental Monitoring Platform

Environmental monitoring dashboard for Bengal region using satellite data and climate analytics.

## 🚀 Cloudflare Workers Deployment

This app is deployed as a **Cloudflare Worker** with Workers Sites for static assets.

### Local Development

```bash
# Install dependencies
npm install

# Run locally with Wrangler
npm run dev

# Access at http://localhost:8787
```

### Deploy to Cloudflare

```bash
# Build and deploy
npm run deploy
```

Or via GitHub integration (automatic deployment on push to main).

## 🏗️ Architecture

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Hono on Cloudflare Workers
- **Static Assets**: Workers Sites (KV Storage)
- **API**: RESTful endpoints for environmental data

## 📡 API Endpoints

- `GET /api/alerts` - Active environmental alerts
- `GET /api/climate/data?year=2024` - Climate data
- `GET /api/districts/data` - District-level data
- `GET /api/metrics/current` - Current metrics
- `GET /api/region/:district` - Region-specific data
- `GET /api/satellite/*` - Satellite imagery (placeholder)

## 🔧 Tech Stack

- React 18
- Hono (Workers framework)
- Radix UI + Tailwind CSS
- Cloudflare Workers
- Workers Sites (static assets in KV)

## 📝 Project Structure

```
BengalInsight/
├── client/           # React frontend
├── worker/           # Cloudflare Worker entry point
│   └── index.ts      # Main worker script
├── dist/             # Build output (uploaded to Workers Sites)
├── wrangler.toml     # Cloudflare configuration
└── package.json
```

## ⚙️ Configuration

See `wrangler.toml` for Cloudflare Workers configuration.

## 🌐 Live URL

After deployment, your app will be available at:
`https://bd01.<your-subdomain>.workers.dev`

Or custom domain if configured in Cloudflare Dashboard.
