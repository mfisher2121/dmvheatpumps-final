import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Heat Pump Sizing Guide",
  description:
    "A homeowner-friendly heat pump sizing guide for the DMV: what “tons” really means, why oversizing happens, and how to sanity-check quotes before you sign.",
  alternates: { canonical: "/heat-pump-sizing-guide" }
};

export default function SizingGuidePage() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <section className="hero">
        <div className="kicker">Right-size first</div>
        <h1 className="h1">Heat Pump Sizing Guide (DMV)</h1>
        <p className="lead">
          If you only remember one thing: <strong>“tons” should be justified by a load calculation</strong>.
          Oversizing is common — and it’s avoidable.
        </p>
        <div className="ctaRow">
          <Link className="btn btnPrimary" href="/calculators#sizing">
            Run the sizing check <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn" href="/heat-pump-rebates-dmv">
            Find rebates by utility
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>The correct order for upgrades</h2>
        <ol className="muted" style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6, lineHeight: 1.7 }}>
          <li>Measure the home (load calculation)</li>
          <li>Seal air leaks</li>
          <li>Blower door test</li>
          <li>Insulate</li>
          <li>Install the heat pump</li>
        </ol>
        <p className="muted" style={{ marginBottom: 0, marginTop: 10 }}>
          Most contractors skip steps 1–3. That’s why systems get oversized.
        </p>
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>Sanity checks for quotes</h2>
        <ul className="muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Ask for a Manual J (or equivalent) and keep a copy.</li>
          <li>Beware “bigger is safer” — it often reduces comfort and efficiency.</li>
          <li>Get the design conditions and assumptions in writing.</li>
          <li>For ducted systems, ask about duct leakage and return sizing.</li>
        </ul>
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>Use the tool</h2>
        <div className="ctaRow" style={{ marginTop: 0 }}>
          <Link className="btn btnPrimary" href="/calculators#sizing">
            Right-size calculator <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn" href="/calculators#incentives">
            Check rebates
          </Link>
          <Link className="btn" href="/calculators#savings">
            Estimate savings
          </Link>
        </div>
      </section>
    </div>
  );
}

