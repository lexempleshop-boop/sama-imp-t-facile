import { PropertyOwnerTaxInput, PropertyOwnerTaxResult } from "@/types/tax";

// CFPB - Contribution Foncière des Propriétés Bâties
const CFPB_RATES = {
  dakar: 0.05, // 5%
  other: 0.035, // 3.5%
};

// CFPNB - Contribution Foncière des Propriétés Non Bâties
const CFPNB_RATE = 0.05; // 5% de la valeur vénale

// Abattements possibles
const EXEMPTION_THRESHOLD = 150000; // FCFA

export function calculatePropertyTax(input: PropertyOwnerTaxInput): PropertyOwnerTaxResult {
  const { propertyType, estimatedValue, location } = input;

  const isDakar = location.toLowerCase().includes("dakar");
  const isBuilt = propertyType === "built";

  let cfpb = 0;
  let cfpnb = 0;
  let taxableValue = estimatedValue;

  // Appliquer l'abattement si applicable
  if (taxableValue <= EXEMPTION_THRESHOLD) {
    return {
      propertyType,
      estimatedValue,
      taxableValue: 0,
      cfpb: 0,
      cfpnb: 0,
      totalTax: 0,
      effectiveRate: 0,
      exemption: true,
      exemptionReason: "Valeur inférieure au seuil d'exonération (150 000 FCFA)",
    };
  }

  if (isBuilt) {
    // Calcul CFPB pour propriété bâtie
    const rate = isDakar ? CFPB_RATES.dakar : CFPB_RATES.other;
    cfpb = taxableValue * rate;
  } else {
    // Calcul CFPNB pour terrain nu
    cfpnb = taxableValue * CFPNB_RATE;
  }

  const totalTax = cfpb + cfpnb;
  const effectiveRate = (totalTax / estimatedValue) * 100;

  return {
    propertyType,
    estimatedValue,
    taxableValue,
    cfpb,
    cfpnb,
    totalTax,
    effectiveRate,
    exemption: false,
  };
}
