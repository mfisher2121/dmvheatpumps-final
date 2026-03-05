import "./embed.css";

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="embedRoot">{children}</div>
      </body>
    </html>
  );
}

