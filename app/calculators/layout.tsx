import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculators",
  robots: {
    index: false,
    follow: true
  }
};

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

