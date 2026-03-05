import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rebates + Right-Size Heat Pump Calculator",
  description:
    "Incentive Stack Finder by address + utility, plus a right-size calculator. Avoid oversizing and maximize rebates."
};

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <div className="kicker">Serving Washington DC • Montgomery County • Northern Virginia • Prince George’s County</div>
        <h1 className="h1">Find Your Heat Pump Rebates and the Correct System Size</h1>
        <p className="lead">
          Check incentives by utility and estimate the right size heat pump for your home. Avoid
          oversizing. Maximize rebates.
        </p>
        <div className="ctaRow">
          <Link className="btn btnPrimary" href="/calculators#incentives">
            Check rebates <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn" href="/calculators#sizing">
            Right-size calculator
          </Link>
          <Link className="btn" href="/calculators#savings">
            Estimate savings
          </Link>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 14 }}>
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>The correct order for heat pump upgrades</h2>
        <ol className="muted" style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6, lineHeight: 1.6 }}>
          <li>Measure the home (load calculation)</li>
          <li>Seal air leaks</li>
          <li>Blower door test</li>
          <li>Insulate</li>
          <li>Install the heat pump</li>
        </ol>
        <p className="muted" style={{ marginBottom: 0, marginTop: 10 }}>
          <strong>Most contractors skip steps 1–3.</strong> That’s why systems get oversized.
        </p>
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
        <h2 style={{ margin: "0 0 8px", letterSpacing: "-0.3px" }}>Two pages that will rank</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          These are evergreen guides designed for search. The homepage is the tool.
        </p>
        <div className="ctaRow" style={{ marginTop: 10 }}>
          <Link className="btn" href="/heat-pump-rebates-dmv">
            Heat pump rebates in the DMV
          </Link>
          <Link className="btn" href="/heat-pump-sizing-guide">
            Heat pump sizing guide
          </Link>
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
          <Link className="btn" href="/calculators#lead">
            Try the lead form
          </Link>
        </div>
      </section>
    </div>
  );
}

