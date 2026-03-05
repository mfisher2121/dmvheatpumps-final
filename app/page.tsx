export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <div className="kicker">DMV homeowners • installers • community sites</div>
        <h1 className="h1">Heat pump estimates that feel honest.</h1>
        <p className="lead">
          Run quick calculators for sizing, monthly cost, and payback — then share results with a
          contractor or embed the widget on your own site. Everything here is transparent and backed
          by the same API.
        </p>
        <div className="ctaRow">
          <a className="btn btnPrimary" href="/calculators">
            Open calculators <span aria-hidden="true">→</span>
          </a>
          <a className="btn" href="/widget">
            Embed the widget
          </a>
          <a className="btn" href="/docs">
            API docs
          </a>
          <span className="pill">
            <span className="mono">/api/calc/*</span> + OpenAPI
          </span>
        </div>
      </section>

      <section className="grid" aria-label="Features">
        <div className="card">
          <h3>DMV-aware defaults</h3>
          <p>
            Outdoor design temps, typical electricity/gas prices, and simple assumptions you can
            override.
          </p>
        </div>
        <div className="card">
          <h3>Shareable results</h3>
          <p>
            Use the API directly or copy a JSON payload into a bid request. No mystery “AI number”.
          </p>
        </div>
        <div className="card">
          <h3>Embeddable</h3>
          <p>
            Drop one script tag on any site to get the same calculator UI. Host it yourself or point
            it at this deployment.
          </p>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 14 }}>
        <h2 style={{ margin: "0 0 8px", letterSpacing: "-0.3px" }}>Lead capture (optional)</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          If you set Supabase env vars, <span className="mono">POST /api/leads</span> stores leads in
          Postgres using the included schema. Without Supabase, the endpoint still validates and
          returns a success response so you can integrate later.
        </p>
        <div className="ctaRow">
          <a className="btn" href="/calculators#lead">
            Try the lead form
          </a>
        </div>
      </section>
    </div>
  );
}

