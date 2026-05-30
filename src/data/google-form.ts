/**
 * Google Form ("Therapy Intake Form") used to complete INR bookings.
 *
 * PayPal cannot accept INR, so customers paying in INR are redirected to this
 * Google Form after filling the intermediate checkout page. The details they
 * entered are passed as prefill query params so the form opens pre-populated.
 *
 * The entry IDs were read from the live form's FB_PUBLIC_LOAD_DATA_ payload and
 * map our checkout fields to the corresponding Google Form questions:
 *   2005620554 -> Full Name
 *   499668642  -> Age
 *   892341945  -> Gender
 *   1065046570 -> Email Address
 *   1166974658 -> Phone number
 *   1214841598 -> Where are you currently based? (City & Country)
 */
export const GOOGLE_FORM_VIEW_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSewzcIxSPRn9o_WBgr13jWQuu-WYOmBLDC_8viWqmxkFV8gUg/viewform";

export const GOOGLE_FORM_ENTRY_IDS = {
  fullName: "2005620554",
  age: "499668642",
  gender: "892341945",
  email: "1065046570",
  phone: "1166974658",
  cityCountry: "1214841598",
} as const;

/**
 * Gender options must match the Google Form's choice labels exactly so the
 * prefill selects the right radio option.
 */
export const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Other/Prefer to self describe",
  "Prefer not to say",
] as const;

export type GoogleFormPrefill = {
  fullName?: string;
  age?: string;
  gender?: string;
  email?: string;
  phone?: string;
  cityCountry?: string;
};

/** Build a Google Form URL with the supported answers pre-filled. */
export function buildGoogleFormPrefillUrl(data: GoogleFormPrefill): string {
  const params = new URLSearchParams({ usp: "pp_url" });
  const entries: [keyof GoogleFormPrefill, string][] = [
    ["fullName", GOOGLE_FORM_ENTRY_IDS.fullName],
    ["age", GOOGLE_FORM_ENTRY_IDS.age],
    ["gender", GOOGLE_FORM_ENTRY_IDS.gender],
    ["email", GOOGLE_FORM_ENTRY_IDS.email],
    ["phone", GOOGLE_FORM_ENTRY_IDS.phone],
    ["cityCountry", GOOGLE_FORM_ENTRY_IDS.cityCountry],
  ];
  for (const [key, id] of entries) {
    const value = data[key]?.trim();
    if (value) params.set(`entry.${id}`, value);
  }
  return `${GOOGLE_FORM_VIEW_URL}?${params.toString()}`;
}
