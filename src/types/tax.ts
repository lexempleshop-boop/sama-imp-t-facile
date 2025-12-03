export type MaritalStatus = "single" | "married" | "divorced" | "widowed" | "separated" | "cohabiting";
export type Language = "fr" | "en" | "wo" | "ff";

export type SimulatorType = "salaried" | "business" | "landlord" | "property";
export type ActivityType = "commerce" | "artisanat" | "services" | "liberal" | "other";
export type PropertyType = "apartment" | "house" | "furnished" | "unfurnished" | "commercial";
export type InformalActivityType = "shop" | "hairdressing" | "tailoring" | "transport" | "street_vendor" | "mechanic" | "other";
export type TenantType = "individual" | "company";
export type PropertyOwnershipType = "built" | "unbuilt";

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

// Business Calculator Inputs
export interface BusinessTaxInput {
  activityType: ActivityType;
  annualRevenue: number;
  expenses: number;
  useRealExpenses: boolean;
  location: string;
  rentalValue: number;
  numberOfEmployees: number;
  isFormal: boolean;
}

export interface BusinessTaxResult {
  netIncome: number;
  ir: number;
  celVA: number;
  celLocaux: number;
  totalTax: number;
  effectiveRate: number;
}

// Landlord Calculator Inputs
export interface LandlordTaxInput {
  propertyType: PropertyType;
  numberOfProperties: number;
  annualRent: number;
  expenses: number;
  tenantType: TenantType;
  location: string;
  rentalValue: number;
}

export interface LandlordTaxResult {
  grossRent: number;
  netRent: number;
  withholdingTax: number;
  irFoncier: number;
  cfpb: number;
  totalTax: number;
  effectiveRate: number;
}

// Property Owner Calculator Inputs
export interface PropertyOwnerTaxInput {
  propertyType: PropertyOwnershipType;
  estimatedValue: number;
  location: string;
  surfaceArea?: number;
}

export interface PropertyOwnerTaxResult {
  propertyType: PropertyOwnershipType;
  estimatedValue: number;
  taxableValue: number;
  cfpb: number;
  cfpnb: number;
  totalTax: number;
  effectiveRate: number;
  exemption: boolean;
  exemptionReason?: string;
}

// Informal Sector Calculator Inputs
export interface InformalTaxInput {
  activityType: InformalActivityType;
  monthlyRevenue: number;
  location: string;
  hasLocal: boolean;
  rentalValue: number;
  numberOfEmployees: number;
}

export interface InformalTaxResult {
  annualRevenue: number;
  netIncome: number;
  ir: number;
  celVA: number;
  celLocaux: number;
  totalTax: number;
  effectiveRate: number;
}
