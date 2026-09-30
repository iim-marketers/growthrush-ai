/**
 * GST on the plan fee, charged on top of the listed price. Shared by the
 * browser and the server so the breakup shown is the one charged.
 */

/* West Bengal, from the first two digits of our GSTIN. */
export const SELLER_STATE_CODE = "19";
export const GST_RATE_PERCENT = 18;

export const indianStates = [
  { code: "01", name: "Jammu and Kashmir" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "03", name: "Punjab" },
  { code: "04", name: "Chandigarh" },
  { code: "05", name: "Uttarakhand" },
  { code: "06", name: "Haryana" },
  { code: "07", name: "Delhi" },
  { code: "08", name: "Rajasthan" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "10", name: "Bihar" },
  { code: "11", name: "Sikkim" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "13", name: "Nagaland" },
  { code: "14", name: "Manipur" },
  { code: "15", name: "Mizoram" },
  { code: "16", name: "Tripura" },
  { code: "17", name: "Meghalaya" },
  { code: "18", name: "Assam" },
  { code: "19", name: "West Bengal" },
  { code: "20", name: "Jharkhand" },
  { code: "21", name: "Odisha" },
  { code: "22", name: "Chhattisgarh" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "24", name: "Gujarat" },
  { code: "26", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "27", name: "Maharashtra" },
  { code: "29", name: "Karnataka" },
  { code: "30", name: "Goa" },
  { code: "31", name: "Lakshadweep" },
  { code: "32", name: "Kerala" },
  { code: "33", name: "Tamil Nadu" },
  { code: "34", name: "Puducherry" },
  { code: "35", name: "Andaman and Nicobar Islands" },
  { code: "36", name: "Telangana" },
  { code: "37", name: "Andhra Pradesh" },
  { code: "38", name: "Ladakh" },
] as const;

export function stateName(code: string) {
  return indianStates.find((s) => s.code === code)?.name ?? null;
}

export type TaxLine = { label: string; paise: number };

/** CGST + SGST within West Bengal, IGST for every other state. */
export function gstFor(basePaise: number, stateCode: string) {
  const tax = Math.round((basePaise * GST_RATE_PERCENT) / 100);
  const half = GST_RATE_PERCENT / 2;
  const lines: TaxLine[] =
    stateCode === SELLER_STATE_CODE
      ? [
          { label: `CGST @ ${half}%`, paise: Math.floor(tax / 2) },
          { label: `SGST @ ${half}%`, paise: tax - Math.floor(tax / 2) },
        ]
      : [{ label: `IGST @ ${GST_RATE_PERCENT}%`, paise: tax }];
  return { lines, tax, total: basePaise + tax };
}

const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PINCODE = /^[1-9]\d{5}$/;

export function normalizeGstin(input: string) {
  const gstin = input.replace(/\s/g, "").toUpperCase();
  return GSTIN.test(gstin) ? gstin : null;
}

export function isPincode(input: string) {
  return PINCODE.test(input);
}
