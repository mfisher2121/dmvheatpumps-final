import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Heat Pump Rebates in the DMV",
  description:
    "A practical guide to finding heat pump incentives in Washington DC, Maryland, and Northern Virginia — and how to stack rebates without getting upsold.",
  alternates: { canonical: "/heat-pump-rebates-dmv" }
};

export default function RebatesGuidePage() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <section className="hero">
        <div className="kicker">DMV Heat Pump Rebates</div>
        <h1 className="h1">Heat Pump Rebates in the DMV (DC, MD, VA)</h1>
        <p className="lead">
          Incentives change. The fastest way to avoid stale advice is to check by <strong>utility</strong>{" "}
          and verify active programs. Use the tool to get an up-to-date list, then confirm eligibility
          on the program source page.
        </p>
        <div className="ctaRow">
          <Link className="btn btnPrimary" href="/calculators#incentives">
            Check rebates by utility <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn" href="/heat-pump-sizing-guide">
            Read the sizing guide
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>What “stacking rebates” really means</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Most households combine a few buckets:
        </p>
        <ul className="muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Utility incentives (often the biggest local lever)</li>
          <li>State / county programs (sometimes seasonal or income-based)</li>
          <li>Federal tax credits (eligibility and caps vary)</li>
          <li>Financing offers (watch the fine print)</li>
        </ul>
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>Two common ways people miss rebates</h2>
        <div className="grid" style={{ marginTop: 0 }}>
          <div className="card" style={{ gridColumn: "span 6" }}>
            <h3>They don’t filter by utility</h3>
            <p>
              Many incentives are administered through your electric utility, not “the state”.
              Always start with utility-specific program pages.
            </p>
          </div>
          <div className="card" style={{ gridColumn: "span 6" }}>
            <h3>They oversize the system</h3>
            <p>
              Oversizing can reduce comfort and may cause eligibility issues depending on program
              requirements. Use a sizing sanity check before you sign.
            </p>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>Next step</h2>
        <div className="ctaRow" style={{ marginTop: 0 }}>
          <Link className="btn btnPrimary" href="/calculators#sizing">
            Right-size calculator <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn" href="/calculators#savings">
            Estimate savings
          </Link>
        </div>
      </section>
    </div>
  );
}

