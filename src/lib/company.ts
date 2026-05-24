export interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
}

export interface Certification {
  name: string;
  number: string;
  issuer: string;
  valid_until: string;
}

export const companyProfile = {
  name: 'IndustryPro Machinery',
  founded: 2010,
  tagline: 'Precision Engineering, Global Delivery',
  description:
    'IndustryPro Machinery is an ISO 9001:2015 certified manufacturer specializing in industrial power transmission and motion control solutions for OEMs and industrial distributors worldwide.',
  factoryArea: '20,000 m2',
  monthlyCapacity: '50,000 units/month',
  exportCountries: '60+',
  team: [
    { name: 'David Chen', role: 'CEO', linkedin: 'https://linkedin.com/in/example' },
    { name: 'Maria Santos', role: 'Sales Director', linkedin: 'https://linkedin.com/in/example' },
    { name: 'Thomas Mueller', role: 'QC Manager', linkedin: 'https://linkedin.com/in/example' },
  ] satisfies TeamMember[],
};

export const trustProof = {
  certifications: [
    { name: 'ISO 9001:2015', number: 'CN-2021-ISO9001-XXXX', issuer: 'SGS', valid_until: '2027-06' },
    { name: 'CE', number: 'CE-2022-XXXX', issuer: 'TUV Rheinland', valid_until: '2027-12' },
    { name: 'RoHS', number: 'ROHS-2023-XXXX', issuer: 'Intertek', valid_until: '2027-03' },
  ] satisfies Certification[],
  clients: ['Siemens', 'ABB', 'Bosch', 'Rockwell Automation', 'Schneider Electric'],
  mediaBadges: ['Forbes Supply Chain 2024', 'Thomas Verified Supplier', 'Made in China Industry Award 2024'],
  samplePolicy: {
    summary: 'Sample cost is deductible from your first order of $500 or more. Ships within 5 business days.',
    freeConditions: 'Free samples for orders above 500 units.',
  },
  sla: {
    replyTime: '12 business hours',
    privacy: 'No newsletters. No reselling. No calls unless you request.',
    nda: "Check the box and we'll send an NDA template within 1 hour.",
    factoryVisit: 'Free airport pickup and hotel for verified buyers.',
  },
};

export function getCompanyStats() {
  return [
    { label: 'Years Established', value: '15+' },
    { label: 'Export Countries', value: companyProfile.exportCountries },
    { label: 'Factory Area', value: companyProfile.factoryArea },
    { label: 'Monthly Capacity', value: '50k+' },
    { label: 'Reply Window', value: '12h' },
  ];
}

export function getTrustProof() {
  return trustProof;
}
