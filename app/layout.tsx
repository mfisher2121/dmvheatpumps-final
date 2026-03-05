import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DMV Heat Pumps — estimates, rebates, and next steps",
  description:
    "Fast, transparent heat pump estimates for the DMV. Try the calculators, see rebates, and embed the widget on your own site."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link className="brand" href="/">
              DMV Heat Pumps
            </Link>
            <nav className="nav">
              <Link href="/calculators">Calculators</Link>
              <Link href="/widget">Widget</Link>
              <Link href="/docs">API Docs</Link>
            </nav>
          </header>
          <main className="main">{children}</main>
          <footer className="footer">
            <div className="footerInner">
              <span>© {new Date().getFullYear()} DMV Heat Pumps</span>
              <span className="muted">
                Estimates only. Verify eligibility and contractor bids before purchasing.
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

