import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Widget",
  robots: {
    index: false,
    follow: false
  }
};

async function getBaseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export default async function WidgetPage() {
  const baseUrl = await getBaseUrl();
  const scriptUrl = `${baseUrl}/widget.js`;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <section className="panel">
        <h1 style={{ margin: "0 0 6px", letterSpacing: "-0.4px" }}>Embeddable widget</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          This is a zero-dependency script that mounts an iframe pointing at{" "}
          <span className="mono">/widget/embed</span>. It supports auto-height and a couple of modes.
        </p>
        <div className="ctaRow">
          <a className="btn" href="/widget/embed" target="_blank" rel="noreferrer">
            Open embed page
          </a>
          <Link className="btn" href="/calculators">
            Calculators
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>Copy/paste snippet</h2>
        <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{`<div id="dmv-heatpumps"></div>
<script
  src="${scriptUrl}"
  data-dmvheatpumps
  data-container="#dmv-heatpumps"
  data-base-url="${baseUrl}"
  data-mode="sizing"
></script>`}
        </pre>
        <p className="muted" style={{ marginBottom: 0 }}>
          Modes: <span className="mono">sizing</span>, <span className="mono">savings</span>,{" "}
          <span className="mono">rebates</span> (incentives).
        </p>
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>Live demo (this page)</h2>
        <div id="dmv-heatpumps-demo" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var s=document.createElement('script');
                s.src='${scriptUrl}';
                s.setAttribute('data-dmvheatpumps','');
                s.setAttribute('data-container','#dmv-heatpumps-demo');
                s.setAttribute('data-base-url','${baseUrl}');
                s.setAttribute('data-mode','sizing');
                document.body.appendChild(s);
              })();
            `
          }}
        />
      </section>
    </div>
  );
}

