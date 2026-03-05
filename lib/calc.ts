import type { RebateRequest, RebateResponse, SavingsRequest, SavingsResponse, SizingRequest, SizingResponse } from "@/lib/schemas";

export function estimateSizing(input: SizingRequest): SizingResponse {
  const baseBtuPerSqft =
    input.insulation === "good" ? 18 : input.insulation === "average" ? 24 : 32;

  const sealingFactor = input.airSealing === "tight" ? 0.9 : input.airSealing === "average" ? 1.0 : 1.12;
  const storyFactor = input.stories <= 1 ? 1.05 : input.stories === 2 ? 1.0 : 0.97;

  const designLoad = Math.round(input.conditionedSqft * baseBtuPerSqft * sealingFactor * storyFactor);
  const capacityTons = Math.max(1.5, Math.round(((designLoad / 12000) * 2)) / 2);

  const notes: string[] = [
    "This is a quick estimate, not a Manual J.",
    "For ducted systems, duct leakage and return sizing can materially change results."
  ];
  if (input.insulation === "poor" || input.airSealing === "leaky") {
    notes.push("Air sealing and insulation upgrades can reduce required capacity and improve comfort.");
  }

  return {
    estimatedDesignLoadBtuH: designLoad,
    recommendedCapacityTons: capacityTons,
    notes
  };
}

export function estimateSavings(input: SavingsRequest): SavingsResponse {
  // Very simple model: treat annual cost as proportional to delivered heat/cool; convert to kWh using COP.
  const deliveredEnergyIndex = input.annualHeatingCostUsd + input.annualCoolingCostUsd;
  const afterElectricCost = deliveredEnergyIndex * 0.72; // baseline improvement from modern variable-speed + better controls

  // Convert "after" into kWh-ish based on rate + COP; this is deliberately simple and transparent.
  const cop = input.heatPumpCopSeasonal;
  const rate = input.electricityRateUsdPerKwh;
  const normalizedKwh = (afterElectricCost / Math.max(0.01, rate)) / Math.max(1.0, cop);
  const estimatedAfter = Math.round(normalizedKwh * rate);

  const savings = Math.round(Math.max(0, deliveredEnergyIndex - estimatedAfter));
  const netCost = Math.max(0, input.installCostUsd - input.rebateUsd);
  const payback = savings > 0 ? Number((netCost / savings).toFixed(1)) : null;

  return {
    estimatedAnnualCostAfterUsd: estimatedAfter,
    estimatedAnnualSavingsUsd: savings,
    simplePaybackYears: payback,
    assumptions: {
      model: "simple-cost-index",
      baselineReductionFactor: 0.72,
      electricityRateUsdPerKwh: rate,
      heatPumpCopSeasonal: cop,
      installCostUsd: input.installCostUsd,
      rebateUsd: input.rebateUsd
    }
  };
}

export function estimateRebate(input: RebateRequest): RebateResponse {
  // Placeholder, transparent heuristic. Swap with real program rules later.
  const programs: RebateResponse["programs"] = [];
  let total = 0;

  const income = input.householdIncomeUsd;
  const lowIncome = income > 0 && income < 80000;
  const midIncome = income >= 80000 && income < 160000;

  if (input.state === "DC") {
    const amt = lowIncome ? 2500 : midIncome ? 1500 : 500;
    programs.push({ name: "DC efficiency incentive (estimate)", amountUsd: amt, notes: "Income-based estimate." });
    total += amt;
  }
  if (input.state === "MD") {
    const amt = input.hasExistingCentralAc ? 1000 : 1500;
    programs.push({ name: "Maryland heat pump incentive (estimate)", amountUsd: amt });
    total += amt;
  }
  if (input.state === "VA") {
    const amt = 750;
    programs.push({ name: "Virginia efficiency incentive (estimate)", amountUsd: amt });
    total += amt;
  }

  return {
    estimatedRebateUsd: total,
    programs,
    disclaimer:
      "This is an estimate only. Program names/amounts are placeholders; confirm current eligibility and caps with official program pages."
  };
}

