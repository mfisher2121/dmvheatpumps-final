import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dmvheatpumps.com"),
  title: {
    default: "DMV Heat Pumps — Rebates + Right-Size Calculator",
    template: "%s — DMV Heat Pumps"
  },
  description:
    "Find heat pump rebates by address + utility and estimate the right system size. Follow the correct sequence: measure → seal → test → insulate → install.",
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  },
  openGraph: {
    type: "website",
    url: "https://dmvheatpumps.com",
    siteName: "DMV Heat Pumps",
    title: "DMV Heat Pumps — Rebates + Right-Size Calculator",
    description:
      "Check incentives and right-size your heat pump in minutes. Avoid oversizing. Maximize rebates.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DMV Heat Pumps" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "DMV Heat Pumps — Rebates + Right-Size Calculator",
    description:
      "Check incentives and right-size your heat pump in minutes. Avoid oversizing. Maximize rebates.",
    images: ["/og.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DMV Heat Pumps",
              url: "https://dmvheatpumps.com"
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DMV Heat Pumps",
              url: "https://dmvheatpumps.com"
            })
          }}
        />
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

