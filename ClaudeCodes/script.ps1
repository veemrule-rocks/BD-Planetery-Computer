# BengalInsight - Complete Cloudflare Pages Deployment Guide

## ✅ Summary of Changes Made

Your Express.js + React application has been restructured for Cloudflare Pages deployment:

1. **package.json** - Added Cloudflare Pages scripts
2. **vite.config.ts** - Updated for static build output
3. **gitignore** - Added Cloudflare-specific entries
4. Created migration scripts and documentation

## 🚀 Complete Deployment Process

### STEP 1: Update package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "check": "tsc",
    "db:push": "drizzle-kit push",
    "pages:dev": "wrangler pages dev dist --compatibility-date=2024-10-14",
    "pages:deploy": "npm run build && wrangler pages deploy dist",
    "cf:deploy": "npm run build && wrangler pages deploy"
  },
  "devDependencies": {
    // ... existing devDependencies ...
    "wrangler": "^3.78.0",
    "@cloudflare/workers-types": "^4.20241011.0"
  }
}
```

### STEP 2: Create wrangler.toml

Create `wrangler.toml` in the root directory:

```toml
name = "bengalinsight"
compatibility_date = "2024-10-14"
pages_build_output_dir = "dist"

[vars]
ENVIRONMENT = "production"

# Uncomment when setting up database
# [[hyperdrive]]
# binding = "HYPERDRIVE"
# id = "your-hyperdrive-id"
```

### STEP 3: Update vite.config.ts

Replace your `vite.config.ts` with:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});
```

### STEP 4: Create Functions Directory Structure

Create this folder structure in your project root:

```
functions/
├── _shared/
│   ├── planetaryComputer.ts (copy from server/services/)
│   └── environmentalData.ts (copy from server/services/)
└── api/
    ├── satellite/
    │   ├── sentinel2/
    │   │   └── latest.ts
    │   ├── sentinel1/
    │   │   └── latest.ts
    │   └── search.ts
    ├── metrics/
    │   └── current.ts
    ├── climate/
    │   └── data.ts
    ├── districts/
    │   └── data.ts
    ├── region/
    │   └── [district].ts
    └── alerts.ts
```

### STEP 5: Create API Function Files

#### `functions/api/satellite/sentinel2/latest.ts`:
```typescript
import { getLatestSentinel2 } from '../../../_shared/planetaryComputer';

export async function onRequest(context: any) {
  try {
    const imagery = await getLatestSentinel2();
    return Response.json(imagery);
  } catch (error: any) {
    console.error('Error fetching Sentinel-2 imagery:', error);
    return Response.json({ 
      error: 'Failed to fetch satellite imagery',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
```

#### `functions/api/satellite/sentinel1/latest.ts`:
```typescript
import { getLatestSentinel1SAR } from '../../../_shared/planetaryComputer';

export async function onRequest(context: any) {
  try {
    const imagery = await getLatestSentinel1SAR();
    return Response.json(imagery);
  } catch (error: any) {
    console.error('Error fetching Sentinel-1 SAR imagery:', error);
    return Response.json({ 
      error: 'Failed to fetch SAR imagery',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
```

#### `functions/api/satellite/search.ts`:
```typescript
import { searchSatelliteImagery } from '../../_shared/planetaryComputer';

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const imagery = await searchSatelliteImagery(body);
    return Response.json(imagery);
  } catch (error: any) {
    console.error('Error searching satellite imagery:', error);
    return Response.json({ 
      error: 'Failed to search satellite imagery',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
```

#### `functions/api/metrics/current.ts`:
```typescript
import { getCurrentMetrics } from '../../_shared/environmentalData';

export async function onRequest(context: any) {
  try {
    const metrics = getCurrentMetrics();
    return Response.json(metrics);
  } catch (error: any) {
    console.error('Error fetching current metrics:', error);
    return Response.json({ 
      error: 'Failed to fetch metrics',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
```

#### `functions/api/alerts.ts`:
```typescript
import { getActiveAlerts } from '../_shared/environmentalData';

export async function onRequest(context: any) {
  try {
    const alerts = getActiveAlerts();
    return Response.json(alerts);
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    return Response.json({ 
      error: 'Failed to fetch alerts',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
```

#### `functions/api/region/[district].ts`:
```typescript
import { getRegionData } from '../../_shared/environmentalData';

export async function onRequest(context: any) {
  try {
    const district = context.params.district;
    const regionData = getRegionData(district);
    
    if (!regionData) {
      return Response.json({ 
        error: 'Region not found',
        message: `No data available for district: ${district}`
      }, { status: 404 });
    }
    
    return Response.json(regionData);
  } catch (error: any) {
    console.error('Error fetching region data:', error);
    return Response.json({ 
      error: 'Failed to fetch region data',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
```

#### `functions/api/climate/data.ts`:
```typescript
import { getClimateData } from '../../_shared/environmentalData';

export async function onRequest(context: any) {
  try {
    const url = new URL(context.request.url);
    const yearParam = url.searchParams.get('year');
    const year = yearParam ? parseInt(yearParam) : 2024;
    
    if (isNaN(year) || year < 1950 || year > 2100) {
      return Response.json({
        error: 'Invalid year parameter',
        message: 'Year must be between 1950 and 2100'
      }, { status: 400 });
    }

    const climateData = getClimateData(year);
    return Response.json(climateData);
  } catch (error: any) {
    console.error('Error fetching climate data:', error);
    return Response.json({ 
      error: 'Failed to fetch climate data',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
```

#### `functions/api/districts/data.ts`:
```typescript
import { getDistrictData } from '../../_shared/environmentalData';

export async function onRequest(context: any) {
  try {
    const districtData = getDistrictData();
    return Response.json(districtData);
  } catch (error: any) {
    console.error('Error fetching district data:', error);
    return Response.json({ 
      error: 'Failed to fetch district data',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
```

### STEP 6: Update .gitignore

Add to your `.gitignore`:

```
# Cloudflare
.dev.vars
.wrangler/
dist/
.cloudflare/
```

### STEP 7: Deploy Commands

```bash
# 1. Install dependencies
npm install

# 2. Build the project
npm run build

# 3. Login to Cloudflare
npx wrangler login

# 4. Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=bengalinsight
```

## 📋 API Endpoints After Deployment

Your API will be available at:
- `https://bengalinsight.pages.dev/api/satellite/sentinel2/latest`
- `https://bengalinsight.pages.dev/api/satellite/sentinel1/latest`
- `https://bengalinsight.pages.dev/api/satellite/search` (POST)
- `https://bengalinsight.pages.dev/api/metrics/current`
- `https://bengalinsight.pages.dev/api/alerts`
- `https://bengalinsight.pages.dev/api/region/:district`
- `https://bengalinsight.pages.dev/api/climate/data?year=2024`
- `https://bengalinsight.pages.dev/api/districts/data`

## ⚙️ Environment Variables

In Cloudflare Dashboard:
1. Go to Workers & Pages > bengalinsight
2. Settings > Environment variables
3. Add: `DATABASE_URL` = your Neon PostgreSQL connection string

## 🗄️ Database Setup (Optional)

### Option A: Neon PostgreSQL via Hyperdrive
```bash
wrangler hyperdrive create bengalinsight-db --connection-string="your_neon_url"
```

Add to `wrangler.toml`:
```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id = "returned-hyperdrive-id"
```

### Option B: Cloudflare D1
```bash
wrangler d1 create bengalinsight-db
```

Add to `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "bengalinsight-db"
database_id = "returned-database-id"
```

## 🔄 Continuous Deployment

### Via Git (Recommended):
1. Push to GitHub/GitLab
2. Cloudflare Dashboard > Pages > Connect to Git
3. Build command: `npm run build`
4. Build output: `dist`

### Via CLI:
```bash
npm run cf:deploy
```

## 📊 Key Differences from Express

| Express | Cloudflare Pages |
|---------|------------------|
| `app.get('/api/route')` | `functions/api/route.ts` with `onRequest` |
| `req.params` | `context.params` |
| `req.query` | `new URL(context.request.url).searchParams` |
| `req.body` | `await context.request.json()` |
| `res.json()` | `Response.json()` |
| Express sessions | JWT or Workers KV |

## 🐛 Troubleshooting

### Build fails:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Deployment fails:
```bash
wrangler logout
wrangler login
wrangler pages deploy dist --project-name=bengalinsight
```

### Functions not working:
- Check Cloudflare Dashboard > Functions logs
- Verify import paths are relative to function file
- Ensure no Node.js-specific imports

## ✅ Success Checklist

- [ ] Updated package.json with Cloudflare scripts
- [ ] Created wrangler.toml
- [ ] Updated vite.config.ts
- [ ] Created functions directory structure
- [ ] Copied services to functions/_shared/
- [ ] Created all API endpoint files
- [ ] Updated .gitignore
- [ ] Ran `npm install`
- [ ] Ran `npm run build` successfully
- [ ] Logged in with `wrangler login`
- [ ] Deployed with `wrangler pages deploy`
- [ ] Tested API endpoints
- [ ] Configured environment variables
- [ ] Set up database (if needed)

## 🎯 Quick Setup Script (PowerShell)

Save this as `setup-cloudflare.ps1` in your project root:

```powershell
#!/usr/bin/env pwsh
Write-Host "Setting up Cloudflare Pages structure..." -ForegroundColor Cyan

# Create directories
$dirs = @(
    "functions\api\satellite\sentinel2",
    "functions\api\satellite\sentinel1",
    "functions\api\metrics",
    "functions\api\climate",
    "functions\api\districts",
    "functions\api\region",
    "functions\_shared"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "Created: $dir" -ForegroundColor Green
}

# Copy shared services
Copy-Item "server\services\planetaryComputer.ts" "functions\_shared\" -Force
Copy-Item "server\services\environmentalData.ts" "functions\_shared\" -Force

Write-Host "Setup complete! Now create the function files manually." -ForegroundColor Green
```

Run with: `.\setup-cloudflare.ps1`

## 📚 Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Pages Functions](https://developers.cloudflare.com/pages/platform/functions)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler)
- [Hyperdrive](https://developers.cloudflare.com/hyperdrive)
- [D1 Database](https://developers.cloudflare.com/d1)

## 🎉 After Deployment

Your application will be live at:
- **Production**: `https://bengalinsight.pages.dev`
- **Custom Domain**: Configure in Cloudflare Dashboard

### Test Your Deployment:
```bash
# Test API endpoints
curl https://bengalinsight.pages.dev/api/metrics/current
curl https://bengalinsight.pages.dev/api/alerts
curl https://bengalinsight.pages.dev/api/districts/data

# Test POST endpoint
curl -X POST https://bengalinsight.pages.dev/api/satellite/search \
  -H "Content-Type: application/json" \
  -d '{"collection":"sentinel-2-l2a","startDate":"2024-01-01","endDate":"2024-01-31"}'
```

## 💡 Pro Tips

1. **Local Development**: Use `wrangler pages dev dist` after building to test Functions locally
2. **Environment Variables**: Create `.dev.vars` for local development (never commit this file)
3. **Monitoring**: Enable Web Analytics in Cloudflare Dashboard for traffic insights
4. **Caching**: Add cache headers to API responses for better performance
5. **Custom Domain**: Add your domain in Cloudflare Dashboard > Custom domains

## 🔐 Security Best Practices

1. Never commit `.dev.vars` or sensitive credentials
2. Use environment variables for all secrets
3. Enable HTTPS-only in Cloudflare settings
4. Implement rate limiting for API endpoints if needed
5. Review Functions logs regularly

## 📈 Performance Optimization

1. **Caching**: Implement caching for static data
2. **Edge Functions**: Your Functions run at the edge automatically
3. **Asset Optimization**: Cloudflare optimizes images and assets
4. **Compression**: Brotli/Gzip enabled by default
5. **CDN**: Global CDN distribution included

## 🚨 Important Notes

- **No Express.js**: Cloudflare Pages uses a different runtime
- **No Sessions**: Traditional express-session won't work
- **No File System**: Cannot use `fs` module
- **ES Modules Only**: Use `import/export`, not `require`
- **Cold Starts**: First request may be slightly slower

## 📞 Support & Community

- [Cloudflare Discord](https://discord.cloudflare.com)
- [Cloudflare Community](https://community.cloudflare.com)
- [GitHub Issues](https://github.com/cloudflare/workers-sdk/issues)

---

## 🎊 You're All Set!

Your BengalInsight application is now ready for Cloudflare Pages deployment. Follow the steps above, and you'll have a globally distributed, serverless application running in minutes.

**Next Action**: Start with updating `package.json`, then create the `wrangler.toml` file, and proceed through the steps sequentially.