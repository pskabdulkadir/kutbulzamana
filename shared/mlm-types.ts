// MLM System Types for Kutbul Zaman - Manevi Rehberim

export interface MembershipPackage {
  id: string;
  name: string;
  price: number;
  currency: "TRY" | "USD" | "EUR";
  description: string;
  features: string[];
  bonusPercentage: number;
  commissionRate: number;
  careerRequirement?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  displayOrder: number;
}

export interface PendingPlacement {
  id: string;
  newUserId: string;
  sponsorId: string;
  newUserData: {
    fullName: string;
    email: string;
    phone: string;
    membershipType: string;
  };
  registrationDate: Date;
  status: "pending" | "placed" | "expired";
  placementOptions: {
    sponsorLeft: boolean;
    sponsorRight: boolean;
    autoPlace: boolean;
  };
}

export interface PointsSystem {
  personalSalesPoints: number;
  teamSalesPoints: number;
  registrationPoints: number;
  totalPoints: number;
  monthlyPoints: number;
  lastPointUpdate: Date;
}

export interface CareerLevel {
  id: string;
  name: string;
  displayName: string;
  requirements: {
    personalSalesPoints: number;
    teamSalesPoints: number;
    directReferrals: number;
    minimumMonthlyPoints: number;
  };
  benefits: {
    directSalesCommission: number; // percentage
    teamBonusRate: number; // percentage
    monthlyBonus: number; // fixed amount
    rankBonus: number; // fixed amount
  };
  order: number;
  isActive: boolean;
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: 'personal_sales' | 'team_sales' | 'registration' | 'bonus' | 'adjustment';
  points: number;
  source: {
    type: 'sale' | 'registration' | 'admin_adjustment' | 'bonus';
    sourceId?: string;
    description: string;
    amount?: number;
  };
  timestamp: Date;
  processedBy?: string;
}

export interface CareerProgress {
  currentLevel: CareerLevel;
  nextLevel?: CareerLevel;
  progress: {
    personalSalesPoints: {
      current: number;
      required: number;
      percentage: number;
    };
    teamSalesPoints: {
      current: number;
      required: number;
      percentage: number;
    };
    directReferrals: {
      current: number;
      required: number;
      percentage: number;
    };
    monthlyPoints: {
      current: number;
      required: number;
      percentage: number;
    };
  };
  canUpgrade: boolean;
  nextLevelRequirements?: string[];
}

export interface User {
  id: string;
  memberId: string; // Unique member ID like ak000001
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "user" | "moderator";

  // MLM Structure
  sponsorId?: string;
  referralCode: string;
  leftChild?: string;
  rightChild?: string;

  // Membership Status
  membershipType: "free" | "entry" | "monthly" | "yearly";
  membershipStartDate?: Date;
  membershipEndDate?: Date;
  isActive: boolean;

  // Career Level (Nefis Mertebeleri)
  careerLevel: CareerLevel;
  totalInvestment: number;
  directReferrals: number;
  totalTeamSize: number;

  // Points and Career System
  pointsSystem: PointsSystem;
  careerProgress?: CareerProgress;

  // Financial
  wallet: {
    balance: number;
    totalEarnings: number;
    sponsorBonus: number;
    careerBonus: number;
    passiveIncome: number;
    leadershipBonus: number;
  };

  // Banking Details
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    iban: string;
    accountHolderName: string;
  };

  // KYC Status
  kycStatus: "pending" | "approved" | "rejected";
  kycDocuments?: {
    idDocument?: string;
    addressProof?: string;
    bankStatement?: string;
  };

  // Personal Info
  dateOfBirth?: Date;
  motherName?: string; // For spiritual calculations
  address?: string;

  // Activity Tracking
  lastLoginDate?: Date;
  registrationDate: Date;
  lastPaymentDate?: Date;
  lastActivityDate?: Date;
  monthlyActivityStatus: "active" | "inactive" | "warning";
  yearlyRenewalDate: Date;
  daysSinceLastActivity: number;
  monthlyActivityStreak: number;
  nextRenewalWarning?: Date;

  // Sales Volume Tracking for Monoline MLM
  monthlySalesVolume?: number; // Track monthly sales for activity requirements ($20 minimum)
  annualSalesVolume?: number;  // Track annual sales for activity requirements ($200 minimum)
  lastSaleDate?: Date;
  totalSalesVolume?: number;
}

export interface CareerLevel {
  id: number;
  name: string;
  description: string;
  minInvestment: number;
  minDirectReferrals: number;
  commissionRate: number;
  passiveIncomeRate: number;
  bonus: number;
  requirements: string[];
}

export const CAREER_LEVELS: CareerLevel[] = [
  {
    id: 1,
    name: "Nefs-i Emmare",
    description: "Kötülüğü emreden nefis - Giriş seviyesi",
    minInvestment: 0,
    minDirectReferrals: 0,
    commissionRate: 2,
    passiveIncomeRate: 0,
    bonus: 0,
    requirements: ["Giriş seviyesi"],
  },
  {
    id: 2,
    name: "Nefs-i Levvame",
    description: "Kendini kınayan nefis",
    minInvestment: 500,
    minDirectReferrals: 2,
    commissionRate: 3,
    passiveIncomeRate: 0.5,
    bonus: 50,
    requirements: ["2 direkt üye", "$500 yatırım"],
  },
  {
    id: 3,
    name: "Nefs-i Mülhime",
    description: "İlham alan nefis",
    minInvestment: 1500,
    minDirectReferrals: 4,
    commissionRate: 4,
    passiveIncomeRate: 1,
    bonus: 150,
    requirements: ["4 aktif üye", "$1500 yatırım"],
  },
  {
    id: 4,
    name: "Nefs-i Mutmainne",
    description: "Tatmin olmuş, huzurlu nefis",
    minInvestment: 3000,
    minDirectReferrals: 10,
    commissionRate: 5,
    passiveIncomeRate: 1.5,
    bonus: 300,
    requirements: ["10 ekip üyesi", "$3000 yatırım"],
  },
  {
    id: 5,
    name: "Nefs-i Râziye",
    description: "Allah'ın takdirine razı olan nefis",
    minInvestment: 5000,
    minDirectReferrals: 2,
    commissionRate: 6,
    passiveIncomeRate: 2,
    bonus: 500,
    requirements: ["2 lider", "$5000 yatırım"],
  },
  {
    id: 6,
    name: "Nefs-i Mardiyye",
    description: "Allah'ın razı olduğu nefis",
    minInvestment: 10000,
    minDirectReferrals: 50,
    commissionRate: 8,
    passiveIncomeRate: 3,
    bonus: 1000,
    requirements: ["50 toplam üye", "$10000 yatırım"],
  },
  {
    id: 7,
    name: "Nefs-i Kâmile",
    description: "Olgunlaşmış, kemale ermiş nefis",
    minInvestment: 25000,
    minDirectReferrals: 3,
    commissionRate: 12,
    passiveIncomeRate: 4,
    bonus: 2500,
    requirements: ["3 lider", "$25000 yatırım"],
  },
];

export interface MembershipPackage {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  type: "entry" | "monthly" | "yearly";
  discount?: number;
}

export const MEMBERSHIP_PACKAGES: MembershipPackage[] = [
  {
    id: "entry",
    name: "Giriş Paketi",
    price: 100,
    duration: 0,
    type: "entry",
    features: [
      "Sistem aktivasyonu",
      "Kişisel klon sayfa",
      "Manevi panel erişimi",
      "Simülasyon sistemi",
      "Binary sistem dahil",
    ],
  },
  {
    id: "monthly",
    name: "Aylık Aktiflik",
    price: 20,
    duration: 30,
    type: "monthly",
    features: [
      "Komisyon hakları",
      "Tüm özellikler aktif",
      "MLM sistem erişimi",
      "Klon sayfa yönetimi",
      "Destek sistemi",
      "Manevi içerik erişimi",
    ],
  },
  {
    id: "yearly",
    name: "Yıllık Plan",
    price: 200,
    duration: 365,
    type: "yearly",
    discount: 15,
    features: [
      "Tüm aylık özellikler",
      "%15 indirim",
      "Ek bonuslar",
      "Safiye üyeler için +%1",
      "Öncelikli destek",
    ],
  },
];

export interface Transaction {
  id: string;
  userId: string;
  type:
    | "deposit"
    | "withdrawal"
    | "commission"
    | "bonus"
    | "transfer"
    | "payment";
  amount: number;
  description: string;
  status: "pending" | "completed" | "rejected";
  date: Date;
  referenceId?: string;
  adminNote?: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal";
  amount: number;
  method: "bank_transfer" | "credit_card" | "crypto";
  status: "pending" | "approved" | "rejected";
  bankDetails?: any;
  receipt?: string;
  adminNote?: string;
  requestDate: Date;
  processedDate?: Date;
}

export interface NetworkNode {
  userId: string;
  level: number;
  position: "left" | "right";
  children: NetworkNode[];
  totalTeamSize: number;
  totalVolume: number;
}

export interface CommissionDistribution {
  totalAmount: number;
  sponsorBonus: number; // 10%
  careerBonus: number; // 25%
  passiveIncome: number; // 5%
  systemFund: number; // 60%
  distributionDate: Date;
}

export interface SpiritualCalculation {
  userId: string;
  name: string;
  motherName: string;
  birthDate: Date;
  ebcedValue: number;
  spiritualNumber: number;
  destiny: string;
  recommendations: string[];
  calculationDate: Date;
}

export interface ClonePage {
  userId: string;
  slug: string;
  customDomain?: string;
  isActive: boolean;
  visitCount: number;
  conversionCount: number;
  customizations: {
    headerImage?: string;
    testimonials?: string[];
    customMessage?: string;
  };
}

// Commission calculation utilities
export const calculateCommissions = (
  investment: number,
): CommissionDistribution => {
  const total = investment;
  const distributionAmount = total * 0.4; // 40% for distribution

  return {
    totalAmount: total,
    sponsorBonus: total * 0.1, // 10%
    careerBonus: total * 0.25, // 25%
    passiveIncome: total * 0.05, // 5%
    systemFund: total * 0.6, // 60%
    distributionDate: new Date(),
  };
};

export const getCareerLevel = (
  investment: number,
  directReferrals: number,
): CareerLevel => {
  let level = CAREER_LEVELS[0];

  for (const careerLevel of CAREER_LEVELS) {
    if (
      investment >= careerLevel.minInvestment &&
      directReferrals >= careerLevel.minDirectReferrals
    ) {
      level = careerLevel;
    }
  }

  return level;
};

export const calculatePassiveIncome = (
  userLevel: CareerLevel,
  downlineInvestment: number,
): number => {
  return (downlineInvestment * userLevel.passiveIncomeRate) / 100;
};

// Product System Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductPurchase {
  id: string;
  productId: string;
  buyerId: string;
  buyerEmail: string;
  referralCode?: string;
  sponsorId?: string;
  purchaseAmount: number;
  status: "pending" | "completed" | "cancelled" | "refunded";
  paymentMethod: "credit_card" | "bank_transfer" | "crypto" | "system_wallet" | "iyzico";
  shippingAddress: {
    fullName: string;
    company?: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email?: string;
    addressType?: "home" | "work" | "other";
    instructions?: string;
  };
  purchaseDate: Date;
  commissionDistributed: boolean;
  trackingNumber?: string;
  deliveryDate?: Date;
  paymentId?: string;
  conversationId?: string;
  shippingCost?: number;
  paymentVerifiedAt?: Date;
}

export interface ProductCommission {
  id: string;
  purchaseId: string;
  productId: string;
  totalAmount: number;
  sponsorBonus: number; // 10%
  careerBonus: number; // 25%
  passiveIncome: number; // 5%
  systemFund: number; // 60%
  distributedAt: Date;
  recipients: Array<{
    userId: string;
    type: "sponsor" | "career" | "passive";
    amount: number;
    level?: number;
  }>;
}

// Shipping and Address Management
export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
  provider: string;
}

export interface ShippingAddress {
  id?: string;
  userId?: string;
  fullName: string;
  company?: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email?: string;
  isDefault?: boolean;
  addressType: "home" | "work" | "other";
  instructions?: string;
}

export interface ShippingCalculation {
  basePrice: number;
  distance: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingOptions: ShippingOption[];
}

// Payment Integration
export interface IyzicoPayment {
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: "TRY" | "USD" | "EUR";
  basketId: string;
  paymentChannel: "WEB" | "MOBILE";
  paymentGroup: "PRODUCT" | "LISTING" | "SUBSCRIPTION";
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    gsmNumber: string;
    registrationDate: string;
    lastLoginDate: string;
    registrationAddress: string;
    city: string;
    country: string;
    zipCode: string;
    ip: string;
  };
  shippingAddress: {
    address: string;
    zipCode: string;
    contactName: string;
    city: string;
    country: string;
  };
  billingAddress: {
    address: string;
    zipCode: string;
    contactName: string;
    city: string;
    country: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    category2?: string;
    itemType: "PHYSICAL" | "VIRTUAL";
    price: string;
  }>;
}

// E-Wallet System Types
export type CurrencyType = 'TRY' | 'USD' | 'EUR' | 'BTC';
export type WalletTransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'commission' | 'bonus' | 'fee' | 'refund';
export type WalletTransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'approved' | 'rejected';
export type PaymentMethodType = 'bank_transfer' | 'crypto' | 'cash' | 'card' | 'system_wallet';

export interface WalletBalance {
  userId: string;
  currency: CurrencyType;
  balance: number;
  frozen: number;
  available: number;
  lastUpdated: Date;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  memberId: string;
  type: WalletTransactionType;
  currency: CurrencyType;
  amount: number;
  fee?: number;
  netAmount: number;
  status: WalletTransactionStatus;
  description: string;
  reference?: string;
  transactionHash?: string;

  // Deposit specific fields
  paymentMethod?: PaymentMethodType;
  depositProof?: string;

  // Withdrawal specific fields
  bankAccount?: {
    iban: string;
    accountHolder: string;
    bankName: string;
    branch?: string;
    swift?: string;
  };
  cryptoAddress?: string;

  // Admin fields
  adminId?: string;
  adminNote?: string;
  processedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface DepositRequest {
  currency: CurrencyType;
  amount: number;
  paymentMethod: PaymentMethodType;
  reference?: string;
  transactionHash?: string;
  notes?: string;
  proofUrl?: string;
}

export interface WithdrawRequest {
  currency: CurrencyType;
  amount: number;
  bankAccount?: {
    iban: string;
    accountHolder: string;
    bankName: string;
    branch?: string;
    swift?: string;
  };
  cryptoAddress?: string;
  notes?: string;
}

export interface CryptoRates {
  btc_try: number;
  btc_usd: number;
  btc_eur: number;
  usd_try: number;
  eur_try: number;
  eth_try?: number;
  eth_usd?: number;
  lastUpdated: Date;
  source: string;
}

export interface AdminBankDetails {
  currency: CurrencyType;
  bankName?: string;
  accountHolder?: string;
  iban?: string;
  swift?: string;
  walletAddress?: string;
  network?: string;
  qrCode?: string;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletSystem {
  userId: string;
  balances: WalletBalance[];
  totalValueTRY: number;
  kycVerified: boolean;
  dailyWithdrawLimit: number;
  monthlyWithdrawLimit: number;
  isBlocked: boolean;
  blockReason?: string;
  lastActivity: Date;
}

// Admin Financial Transaction Management
export interface AdminFinancialTransaction {
  id: string;
  userId: string;
  memberId: string;
  userFullName: string;
  type: WalletTransactionType;
  currency: CurrencyType;
  amount: number;
  status: WalletTransactionStatus;
  paymentMethod?: PaymentMethodType;
  bankDetails?: any;
  cryptoDetails?: any;
  adminActions: Array<{
    adminId: string;
    action: 'approve' | 'reject' | 'process' | 'note';
    note?: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Monoline MLM System Types
export interface MonolineCommissionStructure {
  productPrice: number; // Base product price in USD
  directSponsorBonus: {
    percentage: number; // 15%
    amount: number; // $3
  };
  depthCommissions: {
    level1: { percentage: number; amount: number }; // 12.5% - $2.50
    level2: { percentage: number; amount: number }; // 7.5% - $1.50
    level3: { percentage: number; amount: number }; // 5.0% - $1.00
    level4: { percentage: number; amount: number }; // 3.5% - $0.70
    level5: { percentage: number; amount: number }; // 2.5% - $0.50
    level6: { percentage: number; amount: number }; // 2.0% - $0.40
    level7: { percentage: number; amount: number }; // 1.5% - $0.30
    totalPercentage: number; // 39.5%
    totalAmount: number; // $7.90
  };
  passiveIncomePool: {
    percentage: number; // 2%
    amount: number; // $0.40
    distribution: 'equal_among_active'; // Distributed equally among all active members
  };
  companyFund: {
    percentage: number; // 45%
    amount: number; // $9
  };
}

export interface MonolineNetwork {
  userId: string;
  sponsorId: string | null;
  position: number; // Position in sponsor's line
  directReferrals: string[]; // Array of direct referral user IDs
  totalDownlineCount: number;
  activeDownlineCount: number;
  joinDate: Date;
  lastActivity: Date;
  isActive: boolean;
}

export interface MonolineCommissionTransaction {
  id: string;
  saleId: string;
  buyerId: string;
  productPrice: number;
  commissionType: 'direct_sponsor' | 'depth_level_1' | 'depth_level_2' | 'depth_level_3' |
                  'depth_level_4' | 'depth_level_5' | 'depth_level_6' | 'depth_level_7' |
                  'passive_income' | 'company_fund';
  recipientId: string;
  level?: number; // For career bonuses
  percentage: number;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  processedAt?: Date;
  createdAt: Date;
}

export interface PassiveIncomeDistribution {
  id: string;
  totalPool: number;
  activeMembers: number;
  amountPerMember: number;
  distributionDate: Date;
  recipients: Array<{
    userId: string;
    memberId: string;
    amount: number;
    status: 'pending' | 'distributed' | 'failed';
  }>;
}

export interface MonolineMembershipRequirements {
  initialPurchase: {
    minimumAmount: number; // $100
    minimumUnits: number;  // 5 units
  };
  monthlyActivity: {
    minimumAmount: number; // $20
    minimumUnits: number;  // 1 unit
  };
  annualActivity: {
    minimumAmount: number; // $200
    minimumUnits: number;  // 10 units
  };
}

export interface MonolineMLMSettings {
  isEnabled: boolean;
  productPrice: number;
  commissionStructure: MonolineCommissionStructure;
  membershipRequirements: MonolineMembershipRequirements;
  passiveIncomeSettings: {
    minimumActiveMembers: number;
    distributionFrequency: 'daily' | 'weekly' | 'monthly';
    lastDistribution: Date;
    totalPoolAmount: number;
  };
  activityRequirements: {
    monthly: { amount: number; units: number };
    annual: { amount: number; units: number };
    initial: { amount: number; units: number };
  };
  levelRequirements: Array<{
    level: number;
    minDirectReferrals: number;
    minMonthlyVolume: number;
    isActive: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Live Broadcast System Types
export interface LiveBroadcast {
  id: string;
  status: 'active' | 'inactive';
  streamUrl: string | null;
  title?: string;
  description?: string;
  startTime: Date | null;
  endTime?: Date | null;
  platform?: 'youtube' | 'vimeo' | 'twitch' | 'custom';
  adminId: string;
  viewerCount?: number;
  createdAt: Date;
  lastUpdated: Date;
}
