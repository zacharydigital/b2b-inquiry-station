export type ProductVertical = 'machinery' | 'materials' | 'consumer-oem';

export type InquiryFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'number'
  | 'file'
  | 'url';

export interface InquiryField {
  name: string;
  label: string;
  type: InquiryFieldType;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
  };
}

export type InquiryFormType = 'sticky' | 'full';

export type PdpModuleKey =
  | 'ProductHero'
  | 'Specifications'
  | 'TechnicalData'
  | 'ComplianceDocuments'
  | 'Applications'
  | 'FABENarrative'
  | 'ManufacturingQC'
  | 'QualityConsistency'
  | 'TrustEvidence'
  | 'CommercialTerms'
  | 'Downloads'
  | 'ConversionPanel'
  | 'FAQ'
  | 'RelatedProducts'
  | 'Variants'
  | 'ChannelFit'
  | 'Customization';

export interface VerticalConfig {
  label: string;
  cta: {
    primary: string;
    secondary: string;
    mobilePrimary: string;
  };
  requestTypeOptions: string[];
  stickyFields: InquiryField[];
  fullFields: InquiryField[];
  pdpModules: PdpModuleKey[];
}

const contactFields: InquiryField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'country', label: 'Country / Region', type: 'text', required: true },
];

const machineryStickyFields: InquiryField[] = [
  ...contactFields,
  { name: 'product_slug', label: 'Product / Model', type: 'text', required: true },
  { name: 'quantity', label: 'Required Quantity', type: 'text', required: true },
  { name: 'application', label: 'Application / Equipment Type', type: 'text', required: true },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
];

const materialsStickyFields: InquiryField[] = [
  ...contactFields,
  { name: 'material_grade', label: 'Material / Grade', type: 'text', required: true },
  { name: 'application', label: 'Application', type: 'text', required: true },
  { name: 'quantity', label: 'Required Quantity', type: 'text', required: true },
  {
    name: 'request_type',
    label: 'Request Type',
    type: 'select',
    required: true,
    options: ['Sample', 'Bulk Quote', 'COA', 'SDS', 'Technical Consultation'],
  },
];

const consumerOemStickyFields: InquiryField[] = [
  ...contactFields,
  { name: 'product_interest', label: 'Product Interest', type: 'text', required: true },
  { name: 'quantity', label: 'Quantity / MOQ Target', type: 'text', required: true },
  {
    name: 'inquiry_type',
    label: 'Inquiry Type',
    type: 'select',
    required: true,
    options: ['Wholesale', 'OEM', 'ODM', 'Private Label'],
  },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
];

export const VERTICAL_CONFIGS: Record<ProductVertical, VerticalConfig> = {
  machinery: {
    label: 'Machinery / Industrial Equipment',
    cta: {
      primary: 'Request a Quote',
      secondary: 'Add to Quote Cart',
      mobilePrimary: 'Send RFQ',
    },
    requestTypeOptions: ['Quote', 'Technical Proposal', 'Sample', 'Replacement'],
    stickyFields: machineryStickyFields,
    fullFields: [
      ...machineryStickyFields,
      { name: 'target_specification', label: 'Target Specification', type: 'text', required: false },
      { name: 'file', label: 'Upload Drawing / Specs', type: 'file', required: false, helperText: 'PDF, JPG, PNG, DWG, STEP, IGS, X_T up to 10MB.' },
      { name: 'annual_demand', label: 'Annual Demand', type: 'text', required: false },
      { name: 'delivery_time', label: 'Required Delivery Time', type: 'text', required: false },
      { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: false },
      { name: 'company', label: 'Company Website', type: 'url', required: false },
    ],
    pdpModules: [
      'ProductHero',
      'Specifications',
      'Applications',
      'FABENarrative',
      'ManufacturingQC',
      'TrustEvidence',
      'CommercialTerms',
      'Downloads',
      'ConversionPanel',
      'FAQ',
      'RelatedProducts',
    ],
  },
  materials: {
    label: 'Materials / Chemicals / Ingredients',
    cta: {
      primary: 'Request Sample',
      secondary: 'Request COA',
      mobilePrimary: 'Get Bulk Price',
    },
    requestTypeOptions: ['Sample', 'Bulk Quote', 'COA', 'SDS', 'Technical Consultation'],
    stickyFields: materialsStickyFields,
    fullFields: [
      ...materialsStickyFields,
      { name: 'target_specification', label: 'Target Specification', type: 'text', required: false },
      { name: 'packaging_requirement', label: 'Packaging Requirement', type: 'text', required: false },
      { name: 'destination_port', label: 'Destination Port', type: 'text', required: false },
      { name: 'regulatory_requirement', label: 'Regulatory Requirement', type: 'text', required: false },
      { name: 'monthly_demand', label: 'Monthly / Annual Demand', type: 'text', required: false },
      { name: 'company_type', label: 'Company Type', type: 'select', required: false, options: ['Distributor', 'Manufacturer', 'Lab', 'Trader'] },
    ],
    pdpModules: [
      'ProductHero',
      'TechnicalData',
      'ComplianceDocuments',
      'Applications',
      'QualityConsistency',
      'CommercialTerms',
      'Downloads',
      'ConversionPanel',
      'FAQ',
      'RelatedProducts',
    ],
  },
  'consumer-oem': {
    label: 'Consumer Products / OEM ODM',
    cta: {
      primary: 'Get OEM Quote',
      secondary: 'Request Wholesale Price',
      mobilePrimary: 'OEM Quote',
    },
    requestTypeOptions: ['Wholesale', 'OEM', 'ODM', 'Private Label'],
    stickyFields: consumerOemStickyFields,
    fullFields: [
      ...consumerOemStickyFields,
      { name: 'logo_or_packaging_needed', label: 'Logo / Packaging Needed', type: 'select', required: false, options: ['No', 'Logo only', 'Packaging only', 'Logo and packaging'] },
      { name: 'target_market', label: 'Target Market', type: 'text', required: false },
      { name: 'reference_link', label: 'Reference Link', type: 'url', required: false },
      { name: 'file', label: 'Upload Reference Product', type: 'file', required: false, helperText: 'PDF, JPG, PNG up to 10MB.' },
      { name: 'expected_unit_price', label: 'Expected Unit Price', type: 'text', required: false },
      { name: 'required_certifications', label: 'Required Certifications', type: 'text', required: false },
      { name: 'sales_channel', label: 'Sales Channel', type: 'text', required: false },
    ],
    pdpModules: [
      'ProductHero',
      'Variants',
      'Specifications',
      'ChannelFit',
      'Customization',
      'TrustEvidence',
      'CommercialTerms',
      'ConversionPanel',
      'FAQ',
      'RelatedProducts',
    ],
  },
};

export function normalizeVertical(value: unknown): ProductVertical {
  return value === 'materials' || value === 'consumer-oem' || value === 'machinery'
    ? value
    : 'machinery';
}

export function getVerticalConfig(vertical: unknown): VerticalConfig {
  return VERTICAL_CONFIGS[normalizeVertical(vertical)];
}

export function getInquiryFields(vertical: unknown, formType: InquiryFormType): InquiryField[] {
  const config = getVerticalConfig(vertical);
  return formType === 'sticky' ? config.stickyFields : config.fullFields;
}

export function getAllowedExtraFieldNames(vertical: unknown): Set<string> {
  const commonFields = new Set([
    'website_url',
    'name',
    'email',
    'company',
    'country',
    'phone',
    'quantity',
    'message',
    'inquiry_type',
    'product_slug',
    'product_name',
    'industry',
    'source_page',
    'utm_source',
    'locale',
    'cart_items',
    'file',
  ]);
  return new Set(
    getInquiryFields(vertical, 'full')
      .map((field) => field.name)
      .filter((name) => !commonFields.has(name)),
  );
}
