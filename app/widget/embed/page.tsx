"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "sizing" | "savings" | "rebates";

function getMode(): Mode {
  if (typeof window === "undefined") return "sizing";
  const m = new URL(window.location.href).searchParams.get("mode");
  if (m === "incentives") return "rebates";
  if (m === "savings" || m === "rebates" || m === "sizing") return m;
  return "sizing";
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = (await res.json()) as unknown;
  if (!res.ok) {
    if (typeof data === "object" && data !== null && "error" in data) {
      const err = (data as { error?: unknown }).error;
      if (typeof err === "string") throw new Error(err);
    }
    throw new Error("Request failed");
  }
  return data as T;
}

export default function WidgetEmbedPage() {
  const [mode, setMode] = useState<Mode>("sizing");
  useEffect(() => setMode(getMode()), []);

  const [busy, setBusy] = useState(false);
  const [resultJson, setResultJson] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sizing, setSizing] = useState({
    conditionedSqft: "1800",
    insulation: "average",
    airSealing: "average",
    stories: "2"
  });
  const [savings, setSavings] = useState({
    currentFuel: "gas",
    annualHeatingCostUsd: "1400",
    annualCoolingCostUsd: "350",
    electricityRateUsdPerKwh: "0.18",
    heatPumpCopSeasonal: "3.0",
    installCostUsd: "15000",
    rebateUsd: "0"
  });
  const [rebates, setRebates] = useState({
    state: "MD",
    utility: "Pepco"
  });

  const payload = useMemo(() => {
    if (mode === "sizing") {
      return {
        url: "/api/calc/sizing",
        body: {
          climateZone: "DMV",
          conditionedSqft: Number(sizing.conditionedSqft),
          insulation: sizing.insulation,
          airSealing: sizing.airSealing,
          stories: Number(sizing.stories)
        }
      };
    }
    if (mode === "savings") {
      return {
        url: "/api/calc/savings",
        body: {
          climateZone: "DMV",
          currentFuel: savings.currentFuel,
          annualHeatingCostUsd: Number(savings.annualHeatingCostUsd),
          annualCoolingCostUsd: Number(savings.annualCoolingCostUsd),
          electricityRateUsdPerKwh: Number(savings.electricityRateUsdPerKwh),
          heatPumpCopSeasonal: Number(savings.heatPumpCopSeasonal),
          installCostUsd: Number(savings.installCostUsd),
          rebateUsd: Number(savings.rebateUsd)
        }
      };
    }
    return {
      url: "/api/incentives",
      body: null
    };
  }, [mode, sizing, savings]);

  useEffect(() => {
    const sendHeight = () => {
      const h = document.documentElement.scrollHeight;
      window.parent?.postMessage({ type: "dmvheatpumps:resize", height: h }, "*");
    };
    sendHeight();
    const ro = new ResizeObserver(sendHeight);
    ro.observe(document.documentElement);
    window.addEventListener("load", sendHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", sendHeight);
    };
  }, []);

  return (
    <div>
      <div className="row" style={{ alignItems: "baseline", justifyContent: "space-between" }}>
        <div>
          <div className="title">DMV Heat Pump Calculator</div>
          <div className="muted">Mode: {mode}. Uses live API endpoints.</div>
        </div>
        <div className="row">
          <select
            value={mode}
            onChange={(e) => {
              const m = e.target.value as Mode;
              setMode(m);
              const url = new URL(window.location.href);
              url.searchParams.set("mode", m);
              window.history.replaceState({}, "", url.toString());
              setResultJson(null);
              setError(null);
            }}
          >
            <option value="sizing">Sizing</option>
            <option value="savings">Savings</option>
            <option value="rebates">Incentives</option>
          </select>
        </div>
      </div>

      <div style={{ height: 10 }} />

      {mode === "sizing" && (
        <div className="row">
          <div className="field">
            <label>Conditioned sqft</label>
            <input
              value={sizing.conditionedSqft}
              inputMode="numeric"
              onChange={(e) => setSizing((s) => ({ ...s, conditionedSqft: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Stories</label>
            <input
              value={sizing.stories}
              inputMode="numeric"
              onChange={(e) => setSizing((s) => ({ ...s, stories: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Insulation</label>
            <select value={sizing.insulation} onChange={(e) => setSizing((s) => ({ ...s, insulation: e.target.value }))}>
              <option value="poor">Poor</option>
              <option value="average">Average</option>
              <option value="good">Good</option>
            </select>
          </div>
          <div className="field">
            <label>Air sealing</label>
            <select value={sizing.airSealing} onChange={(e) => setSizing((s) => ({ ...s, airSealing: e.target.value }))}>
              <option value="leaky">Leaky</option>
              <option value="average">Average</option>
              <option value="tight">Tight</option>
            </select>
          </div>
        </div>
      )}

      {mode === "savings" && (
        <div className="row">
          <div className="field">
            <label>Current fuel</label>
            <select value={savings.currentFuel} onChange={(e) => setSavings((s) => ({ ...s, currentFuel: e.target.value }))}>
              <option value="gas">Gas</option>
              <option value="oil">Oil</option>
              <option value="propane">Propane</option>
              <option value="electric_resistance">Electric resistance</option>
            </select>
          </div>
          <div className="field">
            <label>Annual heating ($)</label>
            <input
              value={savings.annualHeatingCostUsd}
              inputMode="numeric"
              onChange={(e) => setSavings((s) => ({ ...s, annualHeatingCostUsd: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Annual cooling ($)</label>
            <input
              value={savings.annualCoolingCostUsd}
              inputMode="numeric"
              onChange={(e) => setSavings((s) => ({ ...s, annualCoolingCostUsd: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Rate ($/kWh)</label>
            <input
              value={savings.electricityRateUsdPerKwh}
              inputMode="decimal"
              onChange={(e) => setSavings((s) => ({ ...s, electricityRateUsdPerKwh: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Seasonal COP</label>
            <input
              value={savings.heatPumpCopSeasonal}
              inputMode="decimal"
              onChange={(e) => setSavings((s) => ({ ...s, heatPumpCopSeasonal: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Install cost ($)</label>
            <input
              value={savings.installCostUsd}
              inputMode="numeric"
              onChange={(e) => setSavings((s) => ({ ...s, installCostUsd: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Rebates ($)</label>
            <input
              value={savings.rebateUsd}
              inputMode="numeric"
              onChange={(e) => setSavings((s) => ({ ...s, rebateUsd: e.target.value }))}
            />
          </div>
        </div>
      )}

      {mode === "rebates" && (
        <div className="row">
          <div className="field">
            <label>State</label>
            <select value={rebates.state} onChange={(e) => setRebates((s) => ({ ...s, state: e.target.value }))}>
              <option value="DC">DC</option>
              <option value="MD">MD</option>
              <option value="VA">VA</option>
            </select>
          </div>
          <div className="field">
            <label>Utility</label>
            <input value={rebates.utility} onChange={(e) => setRebates((s) => ({ ...s, utility: e.target.value }))} />
          </div>
        </div>
      )}

      <div style={{ height: 10 }} />
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <button
          className="btn"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              if (mode === "rebates") {
                const qs = new URLSearchParams({
                  utility: rebates.utility,
                  state: rebates.state,
                  active: "true"
                });
                const res = await fetch(`/api/incentives?${qs.toString()}`);
                const data = (await res.json()) as unknown;
                if (!res.ok) throw new Error("Request failed");
                setResultJson(JSON.stringify(data, null, 2));
              } else {
                const data = await postJson(payload.url, payload.body);
                setResultJson(JSON.stringify(data, null, 2));
              }
            } catch (err) {
              setError(err instanceof Error ? err.message : "Request failed");
              setResultJson(null);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Calculating…" : "Calculate"}
        </button>
        <div className="muted">
          <span style={{ opacity: 0.9 }}>API:</span> <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>{payload.url}</span>
        </div>
      </div>

      {error && <pre style={{ color: "#ff8aa0" }}>{error}</pre>}
      {resultJson && <pre>{resultJson}</pre>}
    </div>
  );
}

