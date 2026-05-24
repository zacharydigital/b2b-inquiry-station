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

export interface RelatedProduct {
  slug: string;
  title: string;
  model: string;
}

export interface Product {
  slug: string;
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
}

const products: Product[] = [
  {
    slug: 'planetary-gearbox-hg-series',
    title: 'Planetary Gearbox HG-220 Series',
    model: 'HG-220',
    category: 'Gearboxes',
    categorySlug: 'gearboxes',
    moq: '10 pcs',
    leadTime: '15-25 days',
    payment: 'T/T, L/C, OA',
    sample: 'Available',
    certifications: ['ISO 9001:2015', 'CE'],
    image: '/static/placeholder.jpg',
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
    title: 'Helical Gearmotor HM-500 Series',
    model: 'HM-500',
    category: 'Gearboxes',
    categorySlug: 'gearboxes',
    moq: '5 pcs',
    leadTime: '20-30 days',
    payment: 'T/T, L/C',
    sample: 'Available',
    certifications: ['ISO 9001:2015', 'CE', 'RoHS'],
    image: '/static/placeholder.jpg',
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
    title: 'AC Servo Motor SM-300',
    model: 'SM-300',
    category: 'Motors',
    categorySlug: 'motors',
    moq: '10 pcs',
    leadTime: '10-20 days',
    payment: 'T/T, L/C, OA',
    sample: 'Available',
    certifications: ['ISO 9001:2015', 'CE', 'RoHS'],
    image: '/static/placeholder.jpg',
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
    title: 'Centrifugal Pump CP-150',
    model: 'CP-150',
    category: 'Pumps',
    categorySlug: 'pumps',
    moq: '5 pcs',
    leadTime: '15-25 days',
    payment: 'T/T, L/C',
    sample: 'Available',
    certifications: ['ISO 9001:2015', 'CE', 'RoHS'],
    image: '/static/placeholder.jpg',
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
    category: product.categorySlug,
    moq: product.moq,
    leadTime: product.leadTime,
  }));
}
