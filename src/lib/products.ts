import type { PdpModuleKey, ProductVertical } from './verticals';

export interface ProductFeature {
  label: string;
  value: string;
}

export interface ProductAdvantage {
  title: string;
  description: string;
}

export interface ProductSpecification {
  parameter: string;
  value: string;
  note?: string;
}

export interface ProductApplication {
  name: string;
  description: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface TechnicalDataPoint {
  property: string;
  value: string;
  method?: string;
}

export interface ComplianceDocument {
  name: string;
  status: string;
  detail: string;
}

export interface ProductVariant {
  label: string;
  value: string;
  detail?: string;
}

export interface ChannelFit {
  channel: string;
  fit: string;
  note: string;
}

export interface CustomizationOption {
  area: string;
  options: string[];
  moqImpact?: string;
}

export interface RelatedProduct {
  slug: string;
  vertical?: ProductVertical;
  title: string;
  model: string;
}

export interface Product {
  slug: string;
  vertical?: ProductVertical;
  title: string;
  model: string;
  category: string;
  categorySlug: string;
  moq: string;
  leadTime: string;
  payment: string;
  sample: string;
  certifications: string[];
  image: string;
  standard: string;
  updated: string;
  fit: string;
  features: ProductFeature[];
  advantages: ProductAdvantage[];
  specifications: ProductSpecification[];
  applications: ProductApplication[];
  faqs: ProductFaq[];
  relatedProducts: RelatedProduct[];
  technicalData?: TechnicalDataPoint[];
  complianceDocuments?: ComplianceDocument[];
  variants?: ProductVariant[];
  channelFit?: ChannelFit[];
  customization?: CustomizationOption[];
  pdpModuleOverrides?: PdpModuleKey[];
}

const products: Product[] = [
  {
    slug: 'planetary-gearbox-hg-series',
    vertical: 'machinery',
    title: 'Planetary Gearbox HG-220 Series',
    model: 'HG-220',
    category: 'Gearboxes',
    categorySlug: 'gearboxes',
    moq: '10 pcs',
    leadTime: '15-25 days',
    payment: 'T/T, L/C, OA',
    sample: 'Available',
    certifications: ['ISO 9001:2015', 'CE'],
    image: '/static/product-gearbox.svg',
    standard: 'ISO 9409 mounting interface',
    updated: '2026-05-24',
    fit: 'CNC, robotics, packaging',
    features: [
      { label: 'Ratio', value: '3:1 to 100:1' },
      { label: 'Output Torque', value: '200-800 Nm' },
      { label: 'Backlash', value: '< 8 arcmin' },
    ],
    advantages: [
      { title: '40% Longer Service Life', description: 'Carburized and ground gears with surface hardness HRC 58-62, delivering 40% longer operating life compared to industry standard hardened gears.' },
      { title: 'Higher Efficiency at Full Load', description: 'Optimized tooth profile reduces friction losses to under 2%, achieving 97%+ efficiency even at rated torque.' },
      { title: 'Interchangeable with Major Brands', description: 'Mounting dimensions match industry standards (ISO 9409). Drop-in replacement for most European and Japanese gearboxes without redesign.' },
    ],
    specifications: [
      { parameter: 'Nominal Output Torque', value: '400 Nm' },
      { parameter: 'Max Acceleration Torque', value: '800 Nm' },
      { parameter: 'Nominal Input Speed', value: '3000 rpm', note: 'IEC 60034' },
      { parameter: 'Backlash', value: '< 8 arcmin' },
      { parameter: 'Ratio Range', value: '3:1 - 100:1' },
      { parameter: 'Efficiency', value: '>= 97%', note: 'at rated torque' },
      { parameter: 'Protection Class', value: 'IP65', note: 'optional IP67' },
      { parameter: 'Weight', value: '12.5 kg' },
    ],
    applications: [
      { name: 'CNC Machining', description: 'Precision positioning for 5-axis CNC machines' },
      { name: 'Robotics', description: 'Compact high-torque for robot arm joints' },
      { name: 'Packaging', description: 'Reliable continuous duty in filling lines' },
      { name: 'Solar Tracking', description: 'Weather-resistant IP65 design' },
    ],
    faqs: [
      { question: "What's the MOQ?", answer: 'Standard MOQ is 10 pcs. Trial orders of 2-3 pcs accepted.' },
      { question: 'Custom ratios available?', answer: 'Yes, OEM/ODM customization from 2:1 to 150:1.' },
      { question: 'Lead time for 100 units?', answer: 'Standard 15-25 days. Rush orders ship in 10 days.' },
      { question: 'CE certified?', answer: 'Yes, CE + RoHS. ISO 9001:2015 factory certified.' },
      { question: 'Sample available?', answer: 'Yes. Cost deductible from first bulk order of 100+ units.' },
      { question: 'Payment terms?', answer: 'T/T, L/C, OA. Standard 30% advance, 70% before shipment.' },
    ],
    relatedProducts: [
      { slug: 'helical-gearmotor-hm-series', title: 'Helical Gearmotor HM-500', model: 'HM-500' },
      { slug: 'ac-servo-motor-sm300', title: 'AC Servo Motor SM-300', model: 'SM-300' },
    ],
  },
  {
    slug: 'helical-gearmotor-hm-series',
    vertical: 'machinery',
    title: 'Helical Gearmotor HM-500 Series',
    model: 'HM-500',
    category: 'Gearboxes',
    categorySlug: 'gearboxes',
    moq: '5 pcs',
    leadTime: '20-30 days',
    payment: 'T/T, L/C',
    sample: 'Available',
    certifications: ['ISO 9001:2015', 'CE', 'RoHS'],
    image: '/static/product-gearbox.svg',
    standard: 'IEC motor integration',
    updated: '2026-05-24',
    fit: 'Conveyors, mixers, pump drives',
    features: [
      { label: 'Power Range', value: '0.12-200 kW' },
      { label: 'Output Torque', value: 'up to 18,000 Nm' },
      { label: 'Ratio', value: '1.4:1 to 280:1' },
    ],
    advantages: [
      { title: 'High Torque Density', description: 'Optimized helical gearing delivers up to 18,000 Nm output torque in a compact footprint.' },
      { title: 'Quiet Operation', description: 'Precision-ground helical gears operate at under 65 dB(A).' },
      { title: 'Modular Design', description: 'Standardized mounting interfaces for quick IEC motor integration.' },
    ],
    specifications: [
      { parameter: 'Power Range', value: '0.12-200 kW' },
      { parameter: 'Max Output Torque', value: '18,000 Nm' },
      { parameter: 'Ratio Range', value: '1.4:1 - 280:1' },
      { parameter: 'Efficiency', value: '>= 94%' },
      { parameter: 'Protection Class', value: 'IP55' },
      { parameter: 'Mounting', value: 'M1-M6' },
    ],
    applications: [
      { name: 'Conveyor Systems', description: 'Bulk material handling conveyors' },
      { name: 'Mixers & Agitators', description: 'Industrial mixing processes' },
      { name: 'Pump Drives', description: 'Centrifugal and positive displacement pumps' },
      { name: 'Crane & Hoist', description: 'Heavy-duty lifting applications' },
    ],
    faqs: [
      { question: 'Available frame sizes?', answer: 'Frame sizes 50-315, power 0.12-200 kW.' },
      { question: 'Food processing use?', answer: 'Food-grade lubricants and stainless shafts available.' },
      { question: 'Warranty?', answer: '12 months standard, 24-month extended available.' },
    ],
    relatedProducts: [
      { slug: 'planetary-gearbox-hg-series', title: 'Planetary Gearbox HG-220', model: 'HG-220' },
      { slug: 'ac-servo-motor-sm300', title: 'AC Servo Motor SM-300', model: 'SM-300' },
    ],
  },
  {
    slug: 'ac-servo-motor-sm300',
    vertical: 'machinery',
    title: 'AC Servo Motor SM-300',
    model: 'SM-300',
    category: 'Motors',
    categorySlug: 'motors',
    moq: '10 pcs',
    leadTime: '10-20 days',
    payment: 'T/T, L/C, OA',
    sample: 'Available',
    certifications: ['ISO 9001:2015', 'CE', 'RoHS'],
    image: '/static/product-motor.svg',
    standard: 'IEC 60034-7 flange mounting',
    updated: '2026-05-24',
    fit: 'CNC, pick-and-place, textile machinery',
    features: [
      { label: 'Power', value: '0.1-7.5 kW' },
      { label: 'Rated Speed', value: '3000 rpm' },
      { label: 'Feedback', value: '17/23-bit encoder' },
    ],
    advantages: [
      { title: 'High Precision', description: '17/23-bit absolute encoder for precise position and velocity control.' },
      { title: 'Low Cogging', description: 'Optimized magnet design reduces torque ripple by 30%.' },
      { title: 'Wide Compatibility', description: 'Standard IEC 60034-7 flange mounting.' },
    ],
    specifications: [
      { parameter: 'Power Range', value: '0.1-7.5 kW' },
      { parameter: 'Rated Torque', value: '0.32-24 Nm' },
      { parameter: 'Rated Speed', value: '3000 rpm' },
      { parameter: 'Max Speed', value: '5000 rpm' },
      { parameter: 'Encoder', value: '17/23-bit' },
      { parameter: 'Protection', value: 'IP65' },
    ],
    applications: [
      { name: 'CNC Machine Tools', description: 'Precise axis control' },
      { name: 'Pick & Place', description: 'High-speed positioning' },
      { name: 'Textile Machinery', description: 'Multi-axis synchronization' },
      { name: 'Printing & Packaging', description: 'Precision registration' },
    ],
    faqs: [
      { question: 'Encoder options?', answer: '17-bit absolute standard. 23-bit and resolver options available.' },
      { question: 'Third-party drive compatibility?', answer: 'Standard interfaces. Motor parameter files available for common brands.' },
      { question: 'Brake options?', answer: '24V DC holding brake, 2.5-40 Nm depending on frame size.' },
    ],
    relatedProducts: [
      { slug: 'planetary-gearbox-hg-series', title: 'Planetary Gearbox HG-220', model: 'HG-220' },
      { slug: 'helical-gearmotor-hm-series', title: 'Helical Gearmotor HM-500', model: 'HM-500' },
    ],
  },
  {
    slug: 'centrifugal-pump-cp150',
    vertical: 'machinery',
    title: 'Centrifugal Pump CP-150',
    model: 'CP-150',
    category: 'Pumps',
    categorySlug: 'pumps',
    moq: '5 pcs',
    leadTime: '15-25 days',
    payment: 'T/T, L/C',
    sample: 'Available',
    certifications: ['ISO 9001:2015', 'CE', 'RoHS'],
    image: '/static/product-pump.svg',
    standard: 'DIN 2533 / ANSI B16.5 flange options',
    updated: '2026-05-24',
    fit: 'Water supply, HVAC, industrial process',
    features: [
      { label: 'Flow Rate', value: 'up to 500 m3/h' },
      { label: 'Head', value: 'up to 150 m' },
      { label: 'Temperature', value: '-10 C to 120 C' },
    ],
    advantages: [
      { title: 'High Efficiency', description: 'CFD-optimized impeller achieves up to 88% hydraulic efficiency.' },
      { title: 'Robust Construction', description: 'Cast iron casing with replaceable wear rings. Stainless options available.' },
      { title: 'Low NPSH Design', description: 'Optimized suction reduces cavitation risk and extends service intervals.' },
    ],
    specifications: [
      { parameter: 'Flow Rate', value: 'up to 500 m3/h' },
      { parameter: 'Head', value: 'up to 150 m' },
      { parameter: 'Temperature', value: '-10 C to 120 C' },
      { parameter: 'Pressure Rating', value: 'PN16 / PN25' },
      { parameter: 'Efficiency', value: 'up to 88%' },
      { parameter: 'Flange', value: 'DIN 2533 / ANSI B16.5' },
    ],
    applications: [
      { name: 'Water Supply', description: 'Municipal distribution and booster stations' },
      { name: 'HVAC', description: 'Chilled water and cooling tower circulation' },
      { name: 'Industrial Process', description: 'Chemical transfer and boiler feed' },
      { name: 'Irrigation', description: 'Agricultural pumping stations' },
    ],
    faqs: [
      { question: 'Material options?', answer: 'Cast iron standard. SS304/SS316, duplex, and bronze available.' },
      { question: 'Seal options?', answer: 'Single mechanical standard. Double, cartridge, and gland packing available.' },
      { question: 'Delivery time?', answer: 'Standard 15-25 days. Custom configurations 30-45 days.' },
    ],
    relatedProducts: [
      { slug: 'planetary-gearbox-hg-series', title: 'Planetary Gearbox HG-220', model: 'HG-220' },
      { slug: 'helical-gearmotor-hm-series', title: 'Helical Gearmotor HM-500', model: 'HM-500' },
    ],
  },
  {
    slug: 'pa66-gf30-engineering-plastic',
    vertical: 'materials',
    title: 'PA66 GF30 Engineering Plastic Pellets',
    model: 'PA66-GF30',
    category: 'Engineering Plastics',
    categorySlug: 'engineering-plastics',
    moq: '1 ton',
    leadTime: '7-14 days',
    payment: 'T/T, L/C',
    sample: '500 g sample available',
    certifications: ['RoHS', 'REACH', 'COA'],
    image: '/static/og-default.svg',
    standard: 'ISO 1874 / ASTM D4066 reference properties',
    updated: '2026-05-24',
    fit: 'Automotive parts, electrical housings, industrial connectors',
    features: [
      { label: 'Glass Fiber', value: '30%' },
      { label: 'Tensile Strength', value: '>= 180 MPa' },
      { label: 'Packaging', value: '25 kg bags' },
    ],
    advantages: [
      { title: 'Consistent Lot Performance', description: 'Batch-controlled compounding keeps tensile, impact, and moisture parameters stable for injection molding programs.' },
      { title: 'Fast Document Handoff', description: 'COA, RoHS, REACH, and SDS documents can be provided before sample approval or bulk order confirmation.' },
      { title: 'Export Packaging Ready', description: 'Moisture-resistant bags and palletized export packing reduce handling risk during sea or air freight.' },
    ],
    specifications: [
      { parameter: 'Material', value: 'PA66 GF30' },
      { parameter: 'Glass Fiber Content', value: '30%' },
      { parameter: 'Color', value: 'Natural / black' },
      { parameter: 'Moisture', value: '<= 0.2%' },
      { parameter: 'Packaging', value: '25 kg bag / 1 ton pallet' },
      { parameter: 'Processing', value: 'Injection molding' },
    ],
    technicalData: [
      { property: 'Density', value: '1.36 g/cm3', method: 'ISO 1183' },
      { property: 'Tensile Strength', value: '>= 180 MPa', method: 'ISO 527' },
      { property: 'Flexural Modulus', value: '>= 8,000 MPa', method: 'ISO 178' },
      { property: 'Heat Deflection Temperature', value: '>= 245 C', method: 'ISO 75' },
      { property: 'Moisture Content', value: '<= 0.2%', method: 'Karl Fischer' },
    ],
    complianceDocuments: [
      { name: 'COA', status: 'Available per batch', detail: 'Lot-specific certificate with physical properties and batch number.' },
      { name: 'SDS', status: 'Available before shipment', detail: 'Safety data sheet for storage, handling, and transport review.' },
      { name: 'RoHS / REACH', status: 'Declaration available', detail: 'Compliance declaration for EU buyer documentation packages.' },
    ],
    applications: [
      { name: 'Automotive Brackets', description: 'High stiffness and thermal resistance for structural molded parts' },
      { name: 'Electrical Housings', description: 'Stable performance for connector and enclosure programs' },
      { name: 'Industrial Components', description: 'Good dimensional stability under load and heat' },
    ],
    faqs: [
      { question: 'Can you provide COA before bulk shipment?', answer: 'Yes. COA is available per production lot, and pre-shipment samples can be arranged for approval.' },
      { question: 'What packaging options are available?', answer: 'Standard packaging is 25 kg moisture-resistant bags on export pallets. Jumbo bags can be discussed for large-volume orders.' },
      { question: 'Can you match a target specification?', answer: 'Yes. Share the target TDS or reference material and our technical team will confirm feasibility.' },
    ],
    relatedProducts: [
      { slug: 'planetary-gearbox-hg-series', vertical: 'machinery', title: 'Planetary Gearbox HG-220', model: 'HG-220' },
      { slug: 'custom-stainless-water-bottle-oem', vertical: 'consumer-oem', title: 'Custom Stainless Water Bottle', model: 'WB-OEM-750' },
    ],
  },
  {
    slug: 'custom-stainless-water-bottle-oem',
    vertical: 'consumer-oem',
    title: 'Custom Stainless Steel Water Bottle OEM',
    model: 'WB-OEM-750',
    category: 'Drinkware OEM',
    categorySlug: 'drinkware-oem',
    moq: '1,000 pcs',
    leadTime: '25-35 days',
    payment: 'T/T, L/C',
    sample: 'Custom sample available',
    certifications: ['LFGB', 'FDA', 'BPA Free'],
    image: '/static/placeholder-logo.svg',
    standard: 'Food-contact stainless steel 304',
    updated: '2026-05-24',
    fit: 'Private label, promotional gifts, retail bundles',
    features: [
      { label: 'Capacity', value: '500 / 750 / 1000 ml' },
      { label: 'Material', value: 'SS304 inner' },
      { label: 'Branding', value: 'Logo + packaging' },
    ],
    advantages: [
      { title: 'Private Label Ready', description: 'Logo, color, lid, and packaging options help buyers validate retail or promotional programs quickly.' },
      { title: 'Channel-Friendly MOQ', description: 'MOQ supports importer sampling, online retail tests, and distributor launch batches.' },
      { title: 'Compliance File Support', description: 'Food-contact declarations and test reports can be prepared for target-market review.' },
    ],
    specifications: [
      { parameter: 'Capacity Options', value: '500 ml / 750 ml / 1000 ml' },
      { parameter: 'Inner Material', value: 'SS304' },
      { parameter: 'Outer Finish', value: 'Powder coated / polished / gradient' },
      { parameter: 'Insulation', value: 'Double-wall vacuum' },
      { parameter: 'Packaging', value: 'White box / color box / gift box' },
      { parameter: 'Logo', value: 'Laser / silk print / heat transfer' },
    ],
    variants: [
      { label: 'Capacity', value: '500 ml, 750 ml, 1000 ml', detail: 'Shared body tooling for faster sampling.' },
      { label: 'Color', value: 'Pantone matching available', detail: 'Matte, gloss, gradient, and metallic finishes.' },
      { label: 'Lid', value: 'Screw, straw, sport cap', detail: 'Retail channel and use-case dependent.' },
      { label: 'Packaging', value: 'White box, color box, gift box', detail: 'Barcode and insert options available.' },
    ],
    channelFit: [
      { channel: 'Amazon / Marketplace', fit: 'Strong', note: 'Barcode, carton mark, and retail packaging options available.' },
      { channel: 'Distributor', fit: 'Strong', note: 'MOQ and color assortment can be planned by region.' },
      { channel: 'Promotional Gifts', fit: 'Strong', note: 'Logo and campaign packaging can be prepared for events.' },
    ],
    customization: [
      { area: 'Logo', options: ['Laser engraving', 'Silk printing', 'Heat transfer'], moqImpact: 'Available from standard MOQ.' },
      { area: 'Packaging', options: ['Color box', 'Gift box', 'Instruction insert', 'Barcode label'], moqImpact: 'Custom printed packaging may require 2,000 pcs.' },
      { area: 'Color', options: ['Pantone match', 'Gradient finish', 'Metallic coating'], moqImpact: 'Special finishes may extend lead time by 5-7 days.' },
    ],
    applications: [
      { name: 'Private Label Retail', description: 'Branded drinkware for ecommerce and retail shelves' },
      { name: 'Promotional Campaigns', description: 'Custom logo bottles for events and corporate gifts' },
      { name: 'Distributor Programs', description: 'Assorted color and size ranges for regional wholesale' },
    ],
    faqs: [
      { question: 'Can you make custom packaging?', answer: 'Yes. Color box, gift box, insert, barcode label, and carton mark customization are available.' },
      { question: 'What files do you need for logo proofing?', answer: 'AI, PDF, EPS, or high-resolution PNG files are preferred. We can prepare a digital proof before sampling.' },
      { question: 'Can you support Amazon packaging requirements?', answer: 'Yes. Share your target marketplace and packaging checklist so we can confirm carton, barcode, and label details.' },
    ],
    relatedProducts: [
      { slug: 'pa66-gf30-engineering-plastic', vertical: 'materials', title: 'PA66 GF30 Engineering Plastic', model: 'PA66-GF30' },
      { slug: 'planetary-gearbox-hg-series', vertical: 'machinery', title: 'Planetary Gearbox HG-220', model: 'HG-220' },
    ],
    pdpModuleOverrides: [
      'ProductHero',
      'Variants',
      'ChannelFit',
      'Customization',
      'Specifications',
      'TrustEvidence',
      'CommercialTerms',
      'ConversionPanel',
      'FAQ',
      'RelatedProducts',
    ],
  },
];

export function listProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductStaticPaths() {
  return products.map((product) => ({ params: { slug: product.slug } }));
}

export function listFilterProducts() {
  return products.map((product) => ({
    slug: product.slug,
    title: product.title,
    model: product.model,
    image: product.image,
    category: product.categorySlug,
    vertical: product.vertical || 'machinery',
    certifications: product.certifications,
    moq: product.moq,
    leadTime: product.leadTime,
  }));
}
