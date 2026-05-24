export interface Product {
  slug: string;
  title: string;
  model: string;
  category: string;
  moq: string;
  lead_time: string;
  certifications: string[];
  image?: string;
  features: { label: string; value: string }[];
  advantages: { title: string; description: string; image?: string }[];
  specifications: { parameter: string; value: string; note?: string }[];
  applications: { name: string; description: string; image?: string }[];
  faqs: { question: string; answer: string }[];
}
