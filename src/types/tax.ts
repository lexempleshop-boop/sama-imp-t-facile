export type MaritalStatus = "single" | "married";
export type Language = "fr" | "en" | "wo" | "ff";

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
