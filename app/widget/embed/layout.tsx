import "./embed.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Widget Embed",
  robots: {
    index: false,
    follow: false
  }
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="embedRoot">{children}</div>
      </body>
    </html>
  );
}

