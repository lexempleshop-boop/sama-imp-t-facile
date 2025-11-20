import { TaxCalculationInput, TaxCalculationResult, TaxBracket, TaxReduction } from "@/types/tax";

// Tax brackets (barème progressif)
const TAX_BRACKETS = [
  { min: 0, max: 630000, rate: 0 },
  { min: 630001, max: 1500000, rate: 0.20 },
  { min: 1500001, max: 4000000, rate: 0.30 },
  { min: 4000001, max: 8000000, rate: 0.35 },
  { min: 8000001, max: 13500000, rate: 0.37 },
  { min: 13500001, max: null, rate: 0.40 },
];

// Tax reductions by parts
const TAX_REDUCTIONS: Record<number, TaxReduction> = {
  1: { parts: 1, rate: 0, minimum: 0, maximum: 0 },
  1.5: { parts: 1.5, rate: 0.10, minimum: 100000, maximum: 300000 },
  2: { parts: 2, rate: 0.15, minimum: 200000, maximum: 650000 },
  2.5: { parts: 2.5, rate: 0.20, minimum: 300000, maximum: 1100000 },
  3: { parts: 3, rate: 0.25, minimum: 400000, maximum: 1650000 },
  3.5: { parts: 3.5, rate: 0.30, minimum: 500000, maximum: 2030000 },
  4: { parts: 4, rate: 0.35, minimum: 600000, maximum: 2490000 },
  4.5: { parts: 4.5, rate: 0.40, minimum: 700000, maximum: 2755000 },
  5: { parts: 5, rate: 0.45, minimum: 800000, maximum: 3180000 },
};

// TRIMF (Taxe Représentative de l'Impôt Minimum Forfaitaire)
const TRIMF_BRACKETS = [
  { min: 0, max: 599999, amount: 900 },
  { min: 600000, max: 999999, amount: 3600 },
  { min: 1000000, max: 1999999, amount: 4800 },
  { min: 2000000, max: 6999999, amount: 12000 },
  { min: 7000000, max: 11999999, amount: 18000 },
  { min: 12000000, max: null, amount: 36000 },
];

function calculateParts(maritalStatus: string, numberOfChildren: number): number {
  let parts = maritalStatus === "married" ? 2 : 1;
  parts += numberOfChildren * 0.5;
  return Math.min(parts, 5); // Maximum 5 parts
}

function calculateTaxByBrackets(incomePerPart: number): { brackets: TaxBracket[]; total: number } {
  let remainingIncome = incomePerPart;
  let totalTax = 0;
  const brackets: TaxBracket[] = [];

  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const bracketMin = bracket.min;
    const bracketMax = bracket.max || Infinity;
    
    if (incomePerPart > bracketMin) {
      const taxableInBracket = Math.min(
        remainingIncome,
        bracketMax - bracketMin + (bracket.max ? 0 : 1)
      );
      
      const taxAmount = taxableInBracket * bracket.rate;
      totalTax += taxAmount;
      
      brackets.push({
        min: bracketMin,
        max: bracket.max,
        rate: bracket.rate,
        amount: taxAmount,
      });
      
      remainingIncome -= taxableInBracket;
    }
  }

  return { brackets, total: totalTax };
}

function getTRIMF(annualIncome: number): number {
  for (const bracket of TRIMF_BRACKETS) {
    if (annualIncome >= bracket.min && (bracket.max === null || annualIncome <= bracket.max)) {
      return bracket.amount;
    }
  }
  return 0;
}

function calculateReduction(totalTax: number, parts: number): number {
  const reductionData = TAX_REDUCTIONS[parts] || TAX_REDUCTIONS[5];
  const calculatedReduction = totalTax * reductionData.rate;
  
  return Math.max(
    reductionData.minimum,
    Math.min(calculatedReduction, reductionData.maximum)
  );
}

export function calculateTax(input: TaxCalculationInput): TaxCalculationResult {
  const { annualIncome, maritalStatus, numberOfChildren } = input;
  
  // Step 1: Calculate parts
  const parts = calculateParts(maritalStatus, numberOfChildren);
  
  // Step 2: Calculate income per part
  const incomePerPart = annualIncome / parts;
  
  // Step 3: Apply progressive tax brackets
  const { brackets, total: taxPerPart } = calculateTaxByBrackets(incomePerPart);
  
  // Step 4: Calculate total tax before reduction
  const totalTaxBeforeReduction = taxPerPart * parts;
  
  // Step 5: Calculate reduction
  const reduction = calculateReduction(totalTaxBeforeReduction, parts);
  
  // Step 6: Get TRIMF
  const trimf = getTRIMF(annualIncome);
  
  // Step 7: Calculate final tax (must be at least TRIMF and max 40% of income)
  let finalTax = totalTaxBeforeReduction - reduction;
  finalTax = Math.max(finalTax, trimf);
  finalTax = Math.min(finalTax, annualIncome * 0.40);
  
  // Step 8: Calculate rates
  const effectiveRate = (finalTax / annualIncome) * 100;
  const marginalRate = brackets[brackets.length - 1]?.rate * 100 || 0;
  
  return {
    grossIncome: annualIncome,
    parts,
    incomePerPart,
    brackets,
    taxPerPart,
    totalTaxBeforeReduction,
    reduction,
    trimf,
    finalTax,
    effectiveRate,
    marginalRate,
  };
}
