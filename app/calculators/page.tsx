"use client";

import { useMemo, useState } from "react";
import { IncentivesResponseSchema, SizingResponseSchema } from "@/lib/schemas";

type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; data: T }
  | { status: "error"; error: string };

function getErrorMessage(data: unknown): string {
  if (typeof data === "object" && data !== null) {
    const maybe = data as { error?: unknown };
    if (typeof maybe.error === "string") return maybe.error;
  }
  return "Request failed";
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = (await res.json()) as unknown;
  if (!res.ok) {
    throw new Error(getErrorMessage(data));
  }
  return data as T;
}

export default function CalculatorsPage() {
  const [sizing, setSizing] = useState({
    conditionedSqft: "1800",
    insulation: "average",
    airSealing: "average",
    stories: "2"
  });
  const [sizingState, setSizingState] = useState<ApiState<unknown>>({ status: "idle" });

  const [savings, setSavings] = useState({
    currentFuel: "gas",
    annualHeatingCostUsd: "1400",
    annualCoolingCostUsd: "350",
    electricityRateUsdPerKwh: "0.18",
    heatPumpCopSeasonal: "3.0",
    installCostUsd: "15000",
    rebateUsd: "0"
  });
  const [savingsState, setSavingsState] = useState<ApiState<unknown>>({ status: "idle" });

  const [incentives, setIncentives] = useState({
    state: "MD",
    utility: "Pepco"
  });
  const [incentivesState, setIncentivesState] = useState<ApiState<unknown>>({ status: "idle" });

  const [reportEmail, setReportEmail] = useState("");
  const [reportState, setReportState] = useState<ApiState<unknown>>({ status: "idle" });

  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    message: "",
    source: "site:calculators"
  });
  const [leadState, setLeadState] = useState<ApiState<unknown>>({ status: "idle" });

  const sizingPayload = useMemo(
    () => ({
      climateZone: "DMV",
      conditionedSqft: Number(sizing.conditionedSqft),
      insulation: sizing.insulation,
      airSealing: sizing.airSealing,
      stories: Number(sizing.stories)
    }),
    [sizing]
  );

  const savingsPayload = useMemo(
    () => ({
      climateZone: "DMV",
      currentFuel: savings.currentFuel,
      annualHeatingCostUsd: Number(savings.annualHeatingCostUsd),
      annualCoolingCostUsd: Number(savings.annualCoolingCostUsd),
      electricityRateUsdPerKwh: Number(savings.electricityRateUsdPerKwh),
      heatPumpCopSeasonal: Number(savings.heatPumpCopSeasonal),
      installCostUsd: Number(savings.installCostUsd),
      rebateUsd: Number(savings.rebateUsd)
    }),
    [savings]
  );

  const sizingParsed = sizingState.status === "ok" ? SizingResponseSchema.safeParse(sizingState.data) : null;
  const tonHighPlusOne =
    sizingParsed?.success ? Number((sizingParsed.data.recommendedCapacityTonsHigh + 1.0).toFixed(1)) : null;

  const incentivesParsed =
    incentivesState.status === "ok" ? IncentivesResponseSchema.safeParse(incentivesState.data) : null;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <section className="panel">
        <h1 style={{ margin: "0 0 6px", letterSpacing: "-0.4px" }}>Calculators</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          These UIs call the same API endpoints your widget and integrations can use.
        </p>
        <div className="ctaRow">
          <a className="btn" href="/docs">
            OpenAPI + examples
          </a>
          <a className="btn" href="/widget">
            Embed the widget
          </a>
        </div>
      </section>

      <section className="panel" id="sizing">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>1) Quick sizing (tons)</h2>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setSizingState({ status: "loading" });
            try {
              const data = await postJson("/api/calc/sizing", sizingPayload);
              setSizingState({ status: "ok", data });
            } catch (err) {
              setSizingState({ status: "error", error: err instanceof Error ? err.message : "Request failed" });
            }
          }}
        >
          <div className="field">
            <label>Conditioned sqft</label>
            <input
              inputMode="numeric"
              value={sizing.conditionedSqft}
              onChange={(e) => setSizing((s) => ({ ...s, conditionedSqft: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Stories</label>
            <input
              inputMode="numeric"
              value={sizing.stories}
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
          <div className="full actions">
            <button className="btn btnPrimary" type="submit">
              Calculate sizing
            </button>
            <span className="muted mono">POST /api/calc/sizing</span>
          </div>
          <div className="full">
            {sizingState.status === "loading" && <div className="muted">Calculating…</div>}
            {sizingState.status === "error" && <div className="err">Error: {sizingState.error}</div>}
            {sizingState.status === "ok" && (
              <div style={{ display: "grid", gap: 10 }}>
                {tonHighPlusOne !== null && (
                  <div className="warn" style={{ fontWeight: 700 }}>
                    Reject quotes above <span className="mono">{tonHighPlusOne} tons</span> unless a Manual J proves it.
                  </div>
                )}
                <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(sizingState.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </form>
      </section>

      <section className="panel" id="savings">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>2) Annual savings + payback</h2>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setSavingsState({ status: "loading" });
            try {
              const data = await postJson("/api/calc/savings", savingsPayload);
              setSavingsState({ status: "ok", data });
            } catch (err) {
              setSavingsState({ status: "error", error: err instanceof Error ? err.message : "Request failed" });
            }
          }}
        >
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
            <label>Electric rate ($/kWh)</label>
            <input
              inputMode="decimal"
              value={savings.electricityRateUsdPerKwh}
              onChange={(e) => setSavings((s) => ({ ...s, electricityRateUsdPerKwh: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Annual heating cost ($)</label>
            <input
              inputMode="numeric"
              value={savings.annualHeatingCostUsd}
              onChange={(e) => setSavings((s) => ({ ...s, annualHeatingCostUsd: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Annual cooling cost ($)</label>
            <input
              inputMode="numeric"
              value={savings.annualCoolingCostUsd}
              onChange={(e) => setSavings((s) => ({ ...s, annualCoolingCostUsd: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Seasonal COP</label>
            <input
              inputMode="decimal"
              value={savings.heatPumpCopSeasonal}
              onChange={(e) => setSavings((s) => ({ ...s, heatPumpCopSeasonal: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Install cost ($)</label>
            <input
              inputMode="numeric"
              value={savings.installCostUsd}
              onChange={(e) => setSavings((s) => ({ ...s, installCostUsd: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Rebates ($)</label>
            <input
              inputMode="numeric"
              value={savings.rebateUsd}
              onChange={(e) => setSavings((s) => ({ ...s, rebateUsd: e.target.value }))}
            />
          </div>
          <div className="full actions">
            <button className="btn btnPrimary" type="submit">
              Calculate savings
            </button>
            <span className="muted mono">POST /api/calc/savings</span>
          </div>
          <div className="full">
            {savingsState.status === "loading" && <div className="muted">Calculating…</div>}
            {savingsState.status === "error" && <div className="err">Error: {savingsState.error}</div>}
            {savingsState.status === "ok" && (
              <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(savingsState.data, null, 2)}
              </pre>
            )}
          </div>
        </form>
      </section>

      <section className="panel" id="incentives">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>3) Incentives (utility + active programs)</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          This calls <span className="mono">GET /api/incentives</span> and pulls rows from{" "}
          <span className="mono">hp_incentive_programs</span> (Supabase).
        </p>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setIncentivesState({ status: "loading" });
            try {
              const qs = new URLSearchParams({
                utility: incentives.utility,
                state: incentives.state,
                active: "true"
              });
              const res = await fetch(`/api/incentives?${qs.toString()}`);
              const data = (await res.json()) as unknown;
              if (!res.ok) throw new Error(getErrorMessage(data));
              setIncentivesState({ status: "ok", data });
            } catch (err) {
              setIncentivesState({ status: "error", error: err instanceof Error ? err.message : "Request failed" });
            }
          }}
        >
          <div className="field">
            <label>State</label>
            <select value={incentives.state} onChange={(e) => setIncentives((s) => ({ ...s, state: e.target.value }))}>
              <option value="DC">DC</option>
              <option value="MD">MD</option>
              <option value="VA">VA</option>
            </select>
          </div>
          <div className="field">
            <label>Utility</label>
            <input
              value={incentives.utility}
              onChange={(e) => setIncentives((s) => ({ ...s, utility: e.target.value }))}
            />
          </div>
          <div className="full actions">
            <button className="btn btnPrimary" type="submit">
              Find incentives
            </button>
            <span className="muted mono">GET /api/incentives</span>
          </div>
          <div className="full">
            {incentivesState.status === "loading" && <div className="muted">Searching…</div>}
            {incentivesState.status === "error" && <div className="err">Error: {incentivesState.error}</div>}
            {incentivesState.status === "ok" && (
              <div style={{ display: "grid", gap: 10 }}>
                {incentivesParsed?.success && (
                  <div className="ok" style={{ fontWeight: 800 }}>
                    Estimated total incentives: <span className="mono">${incentivesParsed.data.totalEstimatedUsd}</span>
                  </div>
                )}
                <div className="actions">
                  <button
                    className="btn"
                    type="button"
                    onClick={async () => {
                      if (!reportEmail.trim()) {
                        setReportState({ status: "error", error: "Enter your email to receive the full report." });
                        return;
                      }
                      setReportState({ status: "loading" });
                      try {
                        const context = {
                          sizingPayload,
                          savingsPayload,
                          incentives: { ...incentives },
                          sizingResult: sizingState.status === "ok" ? sizingState.data : null,
                          savingsResult: savingsState.status === "ok" ? savingsState.data : null,
                          incentivesResult: incentivesState.data
                        };
                        const data = await postJson("/api/report-requests", { email: reportEmail.trim(), context });
                        setReportState({ status: "ok", data });
                      } catch (err) {
                        setReportState({
                          status: "error",
                          error: err instanceof Error ? err.message : "Request failed"
                        });
                      }
                    }}
                  >
                    Email me the full report
                  </button>
                  <input
                    placeholder="you@example.com"
                    value={reportEmail}
                    onChange={(e) => {
                      setReportEmail(e.target.value);
                      if (reportState.status === "error") setReportState({ status: "idle" });
                    }}
                    style={{ minWidth: 260 }}
                  />
                  <span className="muted mono">POST /api/report-requests</span>
                </div>
                {reportState.status === "loading" && <div className="muted">Saving…</div>}
                {reportState.status === "error" && <div className="err">{reportState.error}</div>}
                {reportState.status === "ok" && (
                  <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(reportState.data, null, 2)}
                  </pre>
                )}
                <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(incentivesState.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </form>
      </section>

      <section className="panel" id="lead">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>4) Lead capture (optional storage)</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Validates on the server. If Supabase env vars are set, stores to Postgres; otherwise returns{" "}
          <span className="mono">stored:false</span>.
        </p>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setLeadState({ status: "loading" });
            try {
              const payload = {
                name: lead.name,
                email: lead.email,
                phone: lead.phone || undefined,
                zip: lead.zip,
                message: lead.message || undefined,
                source: lead.source || undefined
              };
              const data = await postJson("/api/leads", payload);
              setLeadState({ status: "ok", data });
            } catch (err) {
              setLeadState({ status: "error", error: err instanceof Error ? err.message : "Request failed" });
            }
          }}
        >
          <div className="field">
            <label>Name</label>
            <input value={lead.name} onChange={(e) => setLead((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={lead.email} onChange={(e) => setLead((s) => ({ ...s, email: e.target.value }))} />
          </div>
          <div className="field">
            <label>Phone (optional)</label>
            <input value={lead.phone} onChange={(e) => setLead((s) => ({ ...s, phone: e.target.value }))} />
          </div>
          <div className="field">
            <label>ZIP</label>
            <input value={lead.zip} onChange={(e) => setLead((s) => ({ ...s, zip: e.target.value }))} />
          </div>
          <div className="field full">
            <label>Message (optional)</label>
            <textarea
              rows={4}
              value={lead.message}
              onChange={(e) => setLead((s) => ({ ...s, message: e.target.value }))}
            />
          </div>
          <div className="full actions">
            <button className="btn btnPrimary" type="submit">
              Submit lead
            </button>
            <span className="muted mono">POST /api/leads</span>
          </div>
          <div className="full">
            {leadState.status === "loading" && <div className="muted">Submitting…</div>}
            {leadState.status === "error" && <div className="err">Error: {leadState.error}</div>}
            {leadState.status === "ok" && (
              <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(leadState.data, null, 2)}
              </pre>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

