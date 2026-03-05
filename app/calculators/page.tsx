"use client";

import { useMemo, useState } from "react";

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

  const [rebate, setRebate] = useState({
    state: "MD",
    householdIncomeUsd: "125000",
    hasExistingCentralAc: true
  });
  const [rebateState, setRebateState] = useState<ApiState<unknown>>({ status: "idle" });

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

  const rebatePayload = useMemo(
    () => ({
      state: rebate.state,
      householdIncomeUsd: Number(rebate.householdIncomeUsd),
      hasExistingCentralAc: Boolean(rebate.hasExistingCentralAc)
    }),
    [rebate]
  );

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

      <section className="panel">
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
              <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(sizingState.data, null, 2)}
              </pre>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
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

      <section className="panel">
        <h2 style={{ margin: "0 0 10px", letterSpacing: "-0.3px" }}>3) Rebate estimate (placeholder rules)</h2>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setRebateState({ status: "loading" });
            try {
              const data = await postJson("/api/calc/rebates", rebatePayload);
              setRebateState({ status: "ok", data });
            } catch (err) {
              setRebateState({ status: "error", error: err instanceof Error ? err.message : "Request failed" });
            }
          }}
        >
          <div className="field">
            <label>State</label>
            <select value={rebate.state} onChange={(e) => setRebate((s) => ({ ...s, state: e.target.value }))}>
              <option value="DC">DC</option>
              <option value="MD">MD</option>
              <option value="VA">VA</option>
            </select>
          </div>
          <div className="field">
            <label>Household income ($/yr)</label>
            <input
              inputMode="numeric"
              value={rebate.householdIncomeUsd}
              onChange={(e) => setRebate((s) => ({ ...s, householdIncomeUsd: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Existing central A/C?</label>
            <select
              value={rebate.hasExistingCentralAc ? "yes" : "no"}
              onChange={(e) => setRebate((s) => ({ ...s, hasExistingCentralAc: e.target.value === "yes" }))}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="full actions">
            <button className="btn btnPrimary" type="submit">
              Estimate rebates
            </button>
            <span className="muted mono">POST /api/calc/rebates</span>
          </div>
          <div className="full">
            {rebateState.status === "loading" && <div className="muted">Calculating…</div>}
            {rebateState.status === "error" && <div className="err">Error: {rebateState.error}</div>}
            {rebateState.status === "ok" && (
              <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(rebateState.data, null, 2)}
              </pre>
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

