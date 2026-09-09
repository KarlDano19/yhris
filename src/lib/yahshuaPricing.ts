/**
 * Single source of truth for YAHSHUA HRIS pricing figures.
 * The pricing page (LpPricingContent), all vs-X and X-alternative
 * comparison pages, and the homepage JSON-LD schema all read from this file.
 * Update the numbers here and they propagate everywhere — this is what
 * the PHP 4,000 -> PHP 7,000 pricing update should have been from the start.
 */

export const YAHSHUA_PRICING = {
  basePrice: 7000,
  employeeCap: 100,
  excessRatePerEmployee: 60,
  setupFee: 35000,
  vatRate: 0.12,
  currency: "PHP",
  lastVerified: "2026-08-14",
} as const;

const fmtPHP = (n: number) => `PHP ${n.toLocaleString("en-US")}`;

export const PRICING_LABELS = {
  base: fmtPHP(YAHSHUA_PRICING.basePrice),
  excess: fmtPHP(YAHSHUA_PRICING.excessRatePerEmployee),
  setup: fmtPHP(YAHSHUA_PRICING.setupFee),
} as const;

export const calculateMonthly = (employees: number) => {
  if (employees <= YAHSHUA_PRICING.employeeCap) return YAHSHUA_PRICING.basePrice;
  return YAHSHUA_PRICING.basePrice + (employees - YAHSHUA_PRICING.employeeCap) * YAHSHUA_PRICING.excessRatePerEmployee;
};

export const calculateVAT = (price: number) => Math.round(price * YAHSHUA_PRICING.vatRate);
export const calculateWithVAT = (price: number) => price + calculateVAT(price);
