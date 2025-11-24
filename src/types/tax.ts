export type MaritalStatus = "single" | "married" | "divorced" | "widowed" | "separated" | "cohabiting";
export type Language = "fr" | "en" | "wo" | "ff";

export type SimulatorType = "salaried" | "business" | "landlord" | "property" | "informal";
export type ActivityType = "commerce" | "artisanat" | "services" | "liberal" | "other";
export type PropertyType = "apartment" | "house" | "furnished" | "unfurnished" | "commercial";
export type InformalActivityType = "shop" | "hairdressing" | "tailoring" | "transport" | "street_vendor" | "mechanic" | "other";

export interface TaxCalculationInput {
  annualIncome: number;
  maritalStatus: MaritalStatus;
  numberOfChildren: number;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  amount: number;
}

export interface TaxReduction {
  parts: number;
  rate: number;
  minimum: number;
  maximum: number;
}

export interface TaxCalculationResult {
  grossIncome: number;
  parts: number;
  incomePerPart: number;
  brackets: TaxBracket[];
  taxPerPart: number;
  totalTaxBeforeReduction: number;
  reduction: number;
  trimf: number;
  finalTax: number;
  effectiveRate: number;
  marginalRate: number;
}
