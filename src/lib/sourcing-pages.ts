import type { ProductVertical } from './verticals';

export type SourcingPageType = 'application' | 'material' | 'oem';

export interface SourcingPage {
  type: SourcingPageType;
  slug: string;
  url: string;
  vertical: ProductVertical;
  productSlugs: string[];
  title: string;
  description: string;
  kicker: string;
  h1: string;
  hook: string;
  proof: { label: string; value: string }[];
  fit: { title: string; detail: string }[];
  trust: string[];
  terms: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
  cta: {
    heading: string;
    detail: string;
  };
}

export const SOURCING_PAGES: SourcingPage[] = [
  {
    type: 'application',
    slug: 'gearbox-for-cnc-machines',
    url: '/applications/gearbox-for-cnc-machines/',
    vertical: 'machinery',
    productSlugs: ['planetary-gearbox-hg-series', 'helical-gearmotor-hm-series'],
    title: 'Gearbox for CNC Machines - Industrial RFQ Guide',
    description: 'Source CNC machine gearboxes with torque, backlash, mounting, lead time, and RFQ-ready procurement details.',
    kicker: 'Application sourcing guide',
    h1: 'Gearbox for CNC machines',
    hook: 'Shortlist precision gearboxes for CNC axes, tool changers, conveyors, and auxiliary drives with the proof buyers need before sending drawings.',
    proof: [
      { label: 'Backlash range', value: '< 8 arcmin options' },
      { label: 'Torque coverage', value: '60-3,000 Nm' },
      { label: 'Mounting', value: 'Inline / right angle' },
      { label: 'Documents', value: 'ISO / CE / QC records' },
    ],
    fit: [
      { title: 'Axis drive fit', detail: 'Use planetary gearboxes where positioning accuracy and servo response matter.' },
      { title: 'Auxiliary drive fit', detail: 'Use helical gearmotors for conveyors, coolant pumps, and material handling modules.' },
      { title: 'Drawing review', detail: 'Upload shaft, flange, ratio, and motor drawings for fit confirmation before quotation.' },
    ],
    trust: ['ISO 9001 factory workflow', '100% pre-shipment inspection', 'Export packaging for machinery', 'NDA available for OEM projects'],
    terms: [
      { label: 'MOQ', value: '1-10 units depending on model' },
      { label: 'Lead time', value: '7-25 days for standard models' },
      { label: 'Payment', value: 'T/T, sample order available' },
      { label: 'Shipping', value: 'Air, sea, or courier' },
    ],
    faqs: [
      {
        question: 'What information is needed to quote a CNC gearbox?',
        answer: 'Ratio, output torque, motor flange, shaft type, backlash target, mounting space, quantity, and destination country are enough for an initial RFQ.',
      },
      {
        question: 'Can the gearbox be matched to an existing servo motor?',
        answer: 'Yes. Send the motor drawing or model number and the sales engineer can confirm adapter, flange, shaft, and ratio options.',
      },
    ],
    cta: {
      heading: 'Send CNC gearbox RFQ',
      detail: 'Attach drawings or target specs and receive a technical quote response within 12 business hours.',
    },
  },
  {
    type: 'material',
    slug: 'pa66-gf30-supplier',
    url: '/materials/pa66-gf30-supplier/',
    vertical: 'materials',
    productSlugs: ['pa66-gf30-engineering-plastic'],
    title: 'PA66 GF30 Supplier - COA, SDS, Bulk Quote',
    description: 'Source PA66 GF30 engineering plastic with technical data, compliance documents, packaging, and bulk pricing context.',
    kicker: 'Material sourcing guide',
    h1: 'PA66 GF30 supplier for engineering parts',
    hook: 'Evaluate PA66 GF30 for automotive, electrical, and industrial molded components with the technical and compliance evidence procurement teams ask for.',
    proof: [
      { label: 'Glass fiber', value: '30%' },
      { label: 'Tensile strength', value: '190 MPa typical' },
      { label: 'Documents', value: 'COA / SDS / REACH' },
      { label: 'Packaging', value: '25 kg bags / pallet' },
    ],
    fit: [
      { title: 'Molding fit', detail: 'Designed for injection molded brackets, housings, gears, and structural components.' },
      { title: 'Compliance fit', detail: 'Request COA, SDS, RoHS, REACH, and food-contact statements where applicable.' },
      { title: 'Supply fit', detail: 'Share annual demand, destination port, and packaging preference for landed cost quotation.' },
    ],
    trust: ['Batch traceability', 'COA with each shipment', 'Moisture-controlled packaging', 'Export documentation support'],
    terms: [
      { label: 'MOQ', value: '500-1,000 kg by grade' },
      { label: 'Lead time', value: '7-15 days after order confirmation' },
      { label: 'Sample', value: 'Available for qualification' },
      { label: 'Documents', value: 'COA, SDS, invoice, packing list' },
    ],
    faqs: [
      {
        question: 'Can I request COA and SDS before placing a bulk order?',
        answer: 'Yes. Select COA or SDS in the inquiry form and include target application, region, and required standard.',
      },
      {
        question: 'What packaging is available for PA66 GF30?',
        answer: 'Standard packaging is 25 kg moisture-resistant bags with palletizing. Custom packaging can be quoted for bulk orders.',
      },
    ],
    cta: {
      heading: 'Request PA66 GF30 sample or bulk quote',
      detail: 'Send grade, application, monthly demand, and documentation needs so sales can quote the right batch and packaging.',
    },
  },
  {
    type: 'oem',
    slug: 'private-label-water-bottle-manufacturer',
    url: '/oem/private-label-water-bottle-manufacturer/',
    vertical: 'consumer-oem',
    productSlugs: ['custom-stainless-water-bottle-oem'],
    title: 'Private Label Water Bottle Manufacturer - OEM Quote',
    description: 'Source private label stainless steel water bottles with MOQ, logo, packaging, channel fit, and OEM RFQ requirements.',
    kicker: 'OEM sourcing guide',
    h1: 'Private label water bottle manufacturer',
    hook: 'Build a retail-ready stainless steel bottle program with clear MOQ, customization options, packaging choices, and certification context.',
    proof: [
      { label: 'MOQ', value: '1,000 pcs typical' },
      { label: 'Sizes', value: '500 / 750 / 1000 ml' },
      { label: 'Branding', value: 'Laser / print / sleeve' },
      { label: 'Channels', value: 'Amazon / retail / corporate' },
    ],
    fit: [
      { title: 'Private label fit', detail: 'Logo, color, lid, sleeve, box, and barcode requirements can be collected in one RFQ.' },
      { title: 'Channel fit', detail: 'Match packaging and certification evidence to Amazon, retail, corporate gift, or distributor needs.' },
      { title: 'Launch fit', detail: 'Share target market, launch date, and reference links so the quote includes realistic tooling and sampling timing.' },
    ],
    trust: ['Factory sample support', 'Pre-production sample confirmation', 'Packaging proof before mass production', 'Export carton and barcode support'],
    terms: [
      { label: 'MOQ', value: '1,000 pcs per color/model' },
      { label: 'Sampling', value: '5-10 days for logo sample' },
      { label: 'Production', value: '25-35 days after sample approval' },
      { label: 'Packing', value: 'White box, color box, or retail sleeve' },
    ],
    faqs: [
      {
        question: 'What details are needed for a private label bottle quote?',
        answer: 'Bottle size, material, logo method, packaging type, quantity, target market, sales channel, certification needs, and reference images.',
      },
      {
        question: 'Can packaging and barcode requirements be included?',
        answer: 'Yes. Select OEM, ODM, or Private Label in the form and provide packaging, target market, and reference link details.',
      },
    ],
    cta: {
      heading: 'Send private label bottle RFQ',
      detail: 'Include target MOQ, packaging, logo, market, and reference links for an OEM quote response.',
    },
  },
];

export function getSourcingPagesByType(type: SourcingPageType): SourcingPage[] {
  return SOURCING_PAGES.filter((page) => page.type === type);
}

export function getSourcingPage(type: SourcingPageType, slug: string): SourcingPage | undefined {
  return SOURCING_PAGES.find((page) => page.type === type && page.slug === slug);
}
