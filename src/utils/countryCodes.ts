export interface Country {
  iso: string;
  name: string;
  dial: string;
  min: number; // national number length
  max: number;
}

export const COUNTRIES: Country[] = [
  { iso: 'IN', name: 'India', dial: '+91', min: 10, max: 10 },
  { iso: 'US', name: 'United States', dial: '+1', min: 10, max: 10 },
  { iso: 'GB', name: 'United Kingdom', dial: '+44', min: 9, max: 10 },
  { iso: 'AE', name: 'UAE', dial: '+971', min: 9, max: 9 },
  { iso: 'SA', name: 'Saudi Arabia', dial: '+966', min: 9, max: 9 },
  { iso: 'QA', name: 'Qatar', dial: '+974', min: 8, max: 8 },
  { iso: 'KW', name: 'Kuwait', dial: '+965', min: 8, max: 8 },
  { iso: 'OM', name: 'Oman', dial: '+968', min: 8, max: 8 },
  { iso: 'SG', name: 'Singapore', dial: '+65', min: 8, max: 8 },
  { iso: 'MY', name: 'Malaysia', dial: '+60', min: 9, max: 10 },
  { iso: 'AU', name: 'Australia', dial: '+61', min: 9, max: 9 },
  { iso: 'NP', name: 'Nepal', dial: '+977', min: 10, max: 10 },
  { iso: 'BD', name: 'Bangladesh', dial: '+880', min: 10, max: 10 },
  { iso: 'LK', name: 'Sri Lanka', dial: '+94', min: 9, max: 9 },
  { iso: 'PK', name: 'Pakistan', dial: '+92', min: 10, max: 10 },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export const getCountry = (iso: string) =>
  COUNTRIES.find((c) => c.iso === iso) ?? DEFAULT_COUNTRY;

export const isValidNational = (c: Country, digits: string) =>
  digits.length >= c.min && digits.length <= c.max;

/** ('+91' country, '9553737309') -> '+919553737309' */
export const toE164 = (c: Country, digits: string) => `${c.dial}${digits}`;

const BY_DIAL_LENGTH = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);

/** '+919553737309' (or legacy 10-digit) -> { country, national } */
export const splitE164 = (phone: string): { country: Country; national: string } => {
  const clean = (phone || '').replace(/[^\d+]/g, '');
  if (clean.startsWith('+')) {
    const c = BY_DIAL_LENGTH.find((x) => clean.startsWith(x.dial));
    if (c) return { country: c, national: clean.slice(c.dial.length) };
  }
  const digits = clean.replace(/\D/g, '');
  return {
    country: DEFAULT_COUNTRY,
    national: digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.slice(0, 10),
  };
};

/** For display: '+91 9553737309' */
export const formatPhone = (phone: string) => {
  const { country, national } = splitE164(phone);
  return national ? `${country.dial} ${national}` : '';
};