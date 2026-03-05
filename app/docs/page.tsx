import { headers } from "next/headers";

async function getBaseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export default async function DocsPage() {
  const baseUrl = await getBaseUrl();
  const openApiUrl = `${baseUrl}/api/openapi`;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <section className="panel">
        <h1 style={{ margin: "0 0 6px", letterSpacing: "-0.4px" }}>API docs</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          This app ships an OpenAPI YAML you can import into Postman/Insomnia, or use to generate an
          MCP server via your preferred OpenAPI-to-tools bridge.
        </p>
        <div className="ctaRow">
          <a className="btn btnPrimary" href="/api/openapi" target="_blank" rel="noreferrer">
            Download OpenAPI YAML
          </a>
          <a className="btn" href="/calculators">
            Back to calculators
          </a>
        </div>
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>Endpoints</h2>
        <div className="grid" style={{ marginTop: 0 }}>
          <div className="card" style={{ gridColumn: "span 6" }}>
            <h3 className="mono">POST /api/calc/sizing</h3>
            <p>Quick sizing (design load + recommended tons).</p>
          </div>
          <div className="card" style={{ gridColumn: "span 6" }}>
            <h3 className="mono">POST /api/calc/savings</h3>
            <p>Annual cost after + savings + simple payback.</p>
          </div>
          <div className="card" style={{ gridColumn: "span 6" }}>
            <h3 className="mono">POST /api/calc/rebates</h3>
            <p>Rebate estimate (placeholder rules).</p>
          </div>
          <div className="card" style={{ gridColumn: "span 6" }}>
            <h3 className="mono">POST /api/leads</h3>
            <p>Validated lead capture (optionally stored in Supabase).</p>
          </div>
          <div className="card" style={{ gridColumn: "span 6" }}>
            <h3 className="mono">GET /api/incentives</h3>
            <p>Up-to-date incentives by utility (from Supabase table).</p>
          </div>
          <div className="card" style={{ gridColumn: "span 6" }}>
            <h3 className="mono">POST /api/report-requests</h3>
            <p>Email capture for “send me the full report”.</p>
          </div>
          <div className="card" style={{ gridColumn: "span 6" }}>
            <h3 className="mono">GET /api/health</h3>
            <p>Health check.</p>
          </div>
          <div className="card" style={{ gridColumn: "span 6" }}>
            <h3 className="mono">GET /api/openapi</h3>
            <p>OpenAPI 3.1 YAML for the service.</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>Quick curl examples</h2>
        <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{`curl -s ${baseUrl}/api/calc/sizing \\
  -H 'content-type: application/json' \\
  -d '{"climateZone":"DMV","conditionedSqft":1800,"insulation":"average","airSealing":"average","stories":2}' | jq

curl -s ${baseUrl}/api/calc/savings \\
  -H 'content-type: application/json' \\
  -d '{"climateZone":"DMV","currentFuel":"gas","annualHeatingCostUsd":1400,"annualCoolingCostUsd":350,"electricityRateUsdPerKwh":0.18,"heatPumpCopSeasonal":3,"installCostUsd":15000,"rebateUsd":0}' | jq

curl -s ${baseUrl}/api/calc/rebates \\
  -H 'content-type: application/json' \\
  -d '{"state":"MD","householdIncomeUsd":125000,"hasExistingCentralAc":true}' | jq

curl -s "${baseUrl}/api/incentives?utility=Pepco&state=MD&active=true" | jq

curl -s ${baseUrl}/api/openapi`}
        </pre>
        <div className="muted" style={{ marginTop: 10 }}>
          Base OpenAPI URL: <span className="mono">{openApiUrl}</span>
        </div>
      </section>
    </div>
  );
}

