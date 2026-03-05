# DMV Heat Pumps (local scaffold)

Next.js app with:

- **Landing page**: `/`
- **Calculators UI**: `/calculators`
- **APIs**: `/api/calc/*`, `/api/leads`, `/api/health`
- **OpenAPI**: `openapi.yaml` served at `/api/openapi`
- **Widget**: `public/widget.js` + embed page at `/widget/embed`
- **Supabase schema**: `supabase/schema.sql`
- **MCP config template**: `mcp.template.json`

## Local dev

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local`.

- If you set **`SUPABASE_URL`** and **`SUPABASE_SERVICE_ROLE_KEY`**, `POST /api/leads` inserts into the `leads` table.

