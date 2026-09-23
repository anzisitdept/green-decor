export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'plants' | 'home-decor' | 'landscaping' | 'aquariums' | 'plant-care' | 'gift-pots';
  categoryLabel: string;
  price: number;
  salePrice?: number;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  careInstructions?: {
    sunlight: string;
    water: string;
    difficulty: 'Easy' | 'Moderate' | 'Expert';
    petFriendly: boolean;
    indoor: boolean;
  };
  details?: {
    height?: string;
    potSize?: string;
    material?: string;
    origin?: string;
  };
  tags: string[];
  featured?: boolean;
  isNew?: boolean;
  inStock: boolean;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  heroImage: string;
  icon: string;
  gallery: string[];
  features: string[];
  pricingRange: string;
  benefits: { title: string; desc: string }[];
  process: { step: number; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export interface PromoSlide {
  id: string;
  title: string;
  kicker: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  badge?: string;
  bgGradient: string;
  imageUrl: string;
  active: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  quote: string;
  rating: number;
  photoUrl: string;
  image?: string; // Optional plant/product image for split cards
  serviceOrProduct: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  apartmentSuite?: string;
  city: string;
  province: string;
  postalCode?: string;
  notes?: string;
}

export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer';

export type OrderStatus = 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  shippingAddress: OrderAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  createdAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface ServiceRequest {
  id: string;
  serviceSlug: string;
  serviceTitle: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  propertyType: 'Residential' | 'Commercial' | 'Office' | 'Balcony / Terrace' | 'Other';
  budget?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'consultation_scheduled' | 'completed';
}

export type ReviewType = 'private' | 'general';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ProductReview {
  id: string;
  productId: string;
  productSlug: string;
  authorName: string;
  rating: number;
  text: string;
  type: ReviewType;
  status: ReviewStatus;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  addresses: OrderAddress[];
  savedPaymentMethods?: string[];
  createdAt: string;
}
