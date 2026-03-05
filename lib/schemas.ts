import { z } from "zod";

export const ClimateZoneSchema = z.enum(["DMV"]).default("DMV");

export const SizingRequestSchema = z.object({
  climateZone: ClimateZoneSchema,
  conditionedSqft: z.number().min(200).max(20000),
  insulation: z.enum(["poor", "average", "good"]).default("average"),
  airSealing: z.enum(["leaky", "average", "tight"]).default("average"),
  stories: z.number().int().min(1).max(4).default(2)
});

export const SizingResponseSchema = z.object({
  estimatedDesignLoadBtuH: z.number(),
  recommendedCapacityTonsLow: z.number(),
  recommendedCapacityTonsHigh: z.number(),
  notes: z.array(z.string())
});

export const SavingsRequestSchema = z.object({
  climateZone: ClimateZoneSchema,
  currentFuel: z.enum(["gas", "oil", "propane", "electric_resistance"]),
  annualHeatingCostUsd: z.number().min(0).max(25000),
  annualCoolingCostUsd: z.number().min(0).max(25000).default(0),
  electricityRateUsdPerKwh: z.number().min(0.05).max(0.8).default(0.18),
  heatPumpCopSeasonal: z.number().min(1.5).max(4.5).default(3.0),
  installCostUsd: z.number().min(0).max(80000).default(15000),
  rebateUsd: z.number().min(0).max(30000).default(0)
});

export const SavingsResponseSchema = z.object({
  estimatedAnnualCostAfterUsd: z.number(),
  estimatedAnnualSavingsUsd: z.number(),
  simplePaybackYears: z.number().nullable(),
  assumptions: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
});

export const RebateRequestSchema = z.object({
  state: z.enum(["DC", "MD", "VA"]),
  utility: z.string().min(1).max(120).optional(),
  householdIncomeUsd: z.number().min(0).max(1000000),
  hasExistingCentralAc: z.boolean().default(false)
});

export const RebateResponseSchema = z.object({
  estimatedRebateUsd: z.number(),
  programs: z.array(
    z.object({
      name: z.string(),
      amountUsd: z.number(),
      notes: z.string().optional()
    })
  ),
  disclaimer: z.string()
});

export const IncentivesQuerySchema = z.object({
  state: z.enum(["DC", "MD", "VA"]).optional(),
  utility: z.string().min(1).max(120),
  active: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? true : v !== "false"))
});

export const IncentiveProgramSchema = z.object({
  id: z.string(),
  utility: z.string(),
  state: z.enum(["DC", "MD", "VA"]).nullable().optional(),
  programName: z.string(),
  amountUsd: z.number(),
  notes: z.string().nullable().optional(),
  sourceUrl: z.string().url().nullable().optional(),
  updatedAt: z.string().optional()
});

export const IncentivesResponseSchema = z.object({
  utility: z.string(),
  activeOnly: z.boolean(),
  totalEstimatedUsd: z.number(),
  programs: z.array(IncentiveProgramSchema),
  disclaimer: z.string()
});

export const ReportRequestSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().min(1).max(120).optional(),
  zip: z.string().min(5).max(10).optional(),
  context: z.record(z.string(), z.unknown()).optional()
});

export const LeadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  phone: z.string().min(7).max(40).optional(),
  zip: z.string().min(5).max(10),
  message: z.string().max(2000).optional(),
  source: z.string().max(200).optional()
});

export const ApiErrorSchema = z.object({
  error: z.string(),
  details: z.unknown().optional()
});

export type SizingRequest = z.infer<typeof SizingRequestSchema>;
export type SizingResponse = z.infer<typeof SizingResponseSchema>;
export type SavingsRequest = z.infer<typeof SavingsRequestSchema>;
export type SavingsResponse = z.infer<typeof SavingsResponseSchema>;
export type RebateRequest = z.infer<typeof RebateRequestSchema>;
export type RebateResponse = z.infer<typeof RebateResponseSchema>;
export type IncentivesQuery = z.infer<typeof IncentivesQuerySchema>;
export type IncentivesResponse = z.infer<typeof IncentivesResponseSchema>;
export type ReportRequest = z.infer<typeof ReportRequestSchema>;
export type Lead = z.infer<typeof LeadSchema>;

