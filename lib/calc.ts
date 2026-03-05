import type { RebateRequest, RebateResponse, SavingsRequest, SavingsResponse, SizingRequest, SizingResponse } from "@/lib/schemas";

export function estimateSizing(input: SizingRequest): SizingResponse {
  const baseBtuPerSqft =
    input.insulation === "good" ? 18 : input.insulation === "average" ? 24 : 32;

  const sealingFactor = input.airSealing === "tight" ? 0.9 : input.airSealing === "average" ? 1.0 : 1.12;
  const storyFactor = input.stories <= 1 ? 1.05 : input.stories === 2 ? 1.0 : 0.97;

  const designLoad = Math.round(input.conditionedSqft * baseBtuPerSqft * sealingFactor * storyFactor);
  const capacityTons = Math.max(1.5, Math.round(((designLoad / 12000) * 2)) / 2);
  const low = capacityTons;
  const high = Number((capacityTons + 0.5).toFixed(1));

  const notes: string[] = [
    "This is a quick estimate, not a Manual J.",
    "For ducted systems, duct leakage and return sizing can materially change results."
  ];
  if (input.insulation === "poor" || input.airSealing === "leaky") {
    notes.push("Air sealing and insulation upgrades can reduce required capacity and improve comfort.");
  }

  return {
    estimatedDesignLoadBtuH: designLoad,
    recommendedCapacityTonsLow: low,
    recommendedCapacityTonsHigh: high,
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
  // Deprecated placeholder: use /api/incentives backed by hp_incentive_programs instead.
  return {
    estimatedRebateUsd: 0,
    programs: [],
    disclaimer:
      `Deprecated for state=${input.state}. Use GET /api/incentives?utility=... for up-to-date program values.`
  };
}

