# Deploy AURELIA to Railway

## 1. Put this project in a GitHub repository

Upload the complete project folder. Keep `package.json`, `railway.toml`, `src/` and `public/` at the repository root.

## 2. Create the Railway service

In Railway, choose **New Project** → **Deploy from GitHub repo**, then select the repository. Railway detects Node from `package.json` and runs `npm start` automatically.

## 3. Confirm the deployment settings

No custom build command is required.

| Setting | Value |
| --- | --- |
| Build | Railway / Nixpacks automatic detection |
| Start command | `npm start` |
| Health check | `/api/health` |
| Port | Railway supplies `PORT` automatically |

## 4. Add persistence (recommended)

Saved schemes are written as JSON. A Railway deployment filesystem is temporary, so create a **Volume** and mount it at `/app/data`. Then add this Railway variable:

```
DATA_DIR=/app/data
```

The designer continues to work without this step, but saved schemes will disappear whenever Railway replaces the deployment.

## 5. Verify

Open the generated Railway domain, create a scheme, save it, then open **Saved schemes**. Visit `/api/health` to check that the backend is running.
