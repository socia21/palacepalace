# Palace Designer delivery

The full Railway-ready application is in the parent project folder.

Organized project structure:

- `package.json` — install and start commands
- `src/server.js` — Express API and durable project storage adapter
- `public/index.html` — application shell
- `public/styles.css` — illustrated responsive interface
- `public/app.js` — interactive designer and API integration
- `railway.toml` — Railway deploy settings
- `docs/RAILWAY.md` — short Railway deployment checklist
- `.env.example` — persistence variable template

Run `npm install` followed by `npm start`. For persistent saved projects on Railway, create a Volume mounted at `/app/data` and set `DATA_DIR=/app/data`.
