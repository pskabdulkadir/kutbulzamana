import { JSONFilePreset } from "lowdb/node";
import mongoose from "mongoose";
import {
  User,
  Transaction,
  PaymentRequest,
  SpiritualCalculation,
  ClonePage,
  CAREER_LEVELS,
  Product,
  ProductPurchase,
  ProductCommission,
  WalletBalance,
  WalletTransaction,
  CurrencyType,
  WalletTransactionType,
  WalletTransactionStatus,
  PaymentMethodType,
  CryptoRates,
  AdminBankDetails,
  LiveBroadcast,
  MonolineMLMSettings,
  MonolineCommissionTransaction,
  PassiveIncomeDistribution,
} from "../../shared/mlm-types.js";

interface Investment {
  id: string;
  userId: string;
  memberId: string;
  type: "entry" | "monthly" | "yearly";
  amount: number;
  status: "pending" | "approved" | "rejected";
  receiptUrl?: string;
  iban: string;
  accountHolder: string;
  requestDate: string;
  processedDate?: string;
  adminNote?: string;
  paymentMethod: "bank_transfer" | "crypto" | "cash";
}

interface WithdrawalRequest {
  id: string;
  userId: string;
  memberId: string;
  amount: number;
  iban: string;
  accountHolder: string;
  status: "pending" | "processing" | "completed" | "rejected";
  requestDate: string;
  processedDate?: string;
  adminNote?: string;
  fee: number;
  netAmount: number;
}
import {
  generateId,
  hashPassword,
  hashPasswordBcrypt,
  verifyPasswordBcrypt,
  generateSecureId,
  sanitizeUserData,
} from "./utils";

interface DatabaseSchema {
  users: User[];
  transactions: Transaction[];
  paymentRequests: PaymentRequest[];
  spiritualCalculations: SpiritualCalculation[];
  clonePages: ClonePage[];
  investments: Investment[];
  withdrawals: WithdrawalRequest[];
  products: Product[];
  productPurchases: ProductPurchase[];
  productCommissions: ProductCommission[];

  // E-Wallet System
  walletBalances: WalletBalance[];
  walletTransactions: WalletTransaction[];
  cryptoRates: CryptoRates[];
  adminBankDetails: AdminBankDetails[];
  settings: {
    systemSettings: {
      maxCapacity: number;
      autoPlacement: boolean;
      registrationEnabled: boolean;
      maintenanceMode: boolean;
      lastMemberNumber: number; // Track last assigned member number
      performanceMode: boolean; // Enable performance optimizations
      cacheEnabled: boolean; // Enable caching
      batchSize: number; // Batch processing size
    };
    commissionSettings: {
      sponsorBonusRate: number;
      careerBonusRate: number;
      passiveIncomeRate: number;
      systemFundRate: number;
    };
  };
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    type: "info" | "warning" | "success" | "error";
    priority: "low" | "medium" | "high" | "urgent";
    targetAudience: "all" | "members" | "admins";
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
  }>;
  // Performance tracking
  performanceMetrics: {
    totalUsers: number;
    activeUsers: number;
    lastOptimized: Date;
    cacheHitRate: number;
    averageResponseTime: number;
  };
  // Admin audit logs
  adminLogs?: Array<{
    id: string;
    action: string;
    targetUserId?: string;
    details: string;
    adminId: string;
    timestamp: Date;
    ipAddress?: string;
    metadata?: any;
  }>;
  // Enhanced member tracking logs
  memberLogs?: Array<{
    id: string;
    memberId: string;
    userId: string;
    action: string;
    details: string;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    location?: {
      country?: string;
      region?: string;
      city?: string;
    };
    sessionId?: string;
    metadata?: any;
  }>;
  // Member activity tracking
  memberActivities?: Array<{
    id: string;
    memberId: string;
    userId: string;
    activityType: string;
    description: string;
    data?: any;
    timestamp: Date;
    duration?: number; // in seconds
    device?: {
      type: string;
      os: string;
      browser: string;
    };
  }>;
  // Real-time transaction system
  realTimeTransactions?: Array<{
    id: string;
    transactionId: string;
    userId: string;
    memberId: string;
    type:
      | "deposit"
      | "withdrawal"
      | "commission"
      | "bonus"
      | "transfer"
      | "purchase"
      | "refund"
      | "penalty";
    subType?: string;
    amount: number;
    currency: string;
    status:
      | "pending"
      | "processing"
      | "completed"
      | "failed"
      | "cancelled"
      | "expired";
    description: string;
    metadata?: {
      sourceUserId?: string;
      targetUserId?: string;
      referenceId?: string;
      commissionLevel?: number;
      bonusType?: string;
      paymentMethod?: string;
      exchangeRate?: number;
      fees?: {
        platformFee: number;
        processingFee: number;
        networkFee: number;
      };
      originalAmount?: number;
      originalCurrency?: string;
    };
    timestamps: {
      created: Date;
      processed?: Date;
      completed?: Date;
      failed?: Date;
    };
    balancesBefore: {
      user: number;
      system?: number;
    };
    balancesAfter: {
      user: number;
      system?: number;
    };
    ipAddress?: string;
    userAgent?: string;
    location?: {
      country?: string;
      region?: string;
      city?: string;
    };
    riskScore?: number;
    approvalRequired?: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    notes?: string;
    relatedTransactions?: string[];
  }>;
  // Transaction batch processing
  transactionBatches?: Array<{
    id: string;
    batchType:
      | "commission_distribution"
      | "bonus_calculation"
      | "system_maintenance"
      | "bulk_transfer";
    status: "pending" | "processing" | "completed" | "failed";
    transactionIds: string[];
    totalAmount: number;
    affectedUsers: number;
    createdBy: string;
    createdAt: Date;
    processedAt?: Date;
    completedAt?: Date;
    errorDetails?: string;
    progress?: {
      completed: number;
      total: number;
      currentStep: string;
    };
  }>;
  // Real-time balance tracking
  balanceSnapshots?: Array<{
    id: string;
    userId: string;
    memberId: string;
    balanceType: "wallet" | "commission" | "bonus" | "locked" | "pending";
    amount: number;
    currency: string;
    timestamp: Date;
    triggeredBy: string; // transaction ID or system event
    reason: string;
  }>;
  // Member login sessions
  memberSessions?: Array<{
    id: string;
    memberId: string;
    userId: string;
    sessionToken: string;
    loginTime: Date;
    logoutTime?: Date;
    ipAddress: string;
    userAgent: string;
    isActive: boolean;
    lastActivity: Date;
  }>;
}

// Initialize database with clean data - only Abdulkadir Kan as root sponsor
const defaultData: DatabaseSchema = {
  users: [
    {
      id: "admin-001",
      memberId: "ak0000001", // First member ID
      fullName: "Abdulkadir Kan",
      email: "psikologabdulkadirkan@gmail.com",
      phone: "+90 555 123 4567",
      password: hashPassword("Abdulkadir1983"), // Properly hashed password
      role: "admin",
      referralCode: "AK0001",
      membershipType: "entry",
      membershipStartDate: new Date("2024-01-01"),
      isActive: true,
      careerLevel: CAREER_LEVELS[6], // Nefs-i Kâmile (highest level)
      totalInvestment: 100000,
      directReferrals: 0,
      totalTeamSize: 0,
      wallet: {
        balance: 50000,
        totalEarnings: 0,
        sponsorBonus: 0,
        careerBonus: 0,
        passiveIncome: 0,
        leadershipBonus: 0,
      },
      kycStatus: "approved",
      registrationDate: new Date("2024-01-01"),
      lastLoginDate: new Date(),
      lastActivityDate: new Date(),
      monthlyActivityStatus: "active",
      yearlyRenewalDate: new Date("2025-01-01"),
      daysSinceLastActivity: 0,
      monthlyActivityStreak: 12,
      nextRenewalWarning: new Date("2024-12-01"),
    },
  ],
  transactions: [],
  paymentRequests: [],
  spiritualCalculations: [],
  investments: [],
  withdrawals: [],
  clonePages: [
    {
      userId: "admin-001",
      slug: "abdulkadir-kan",
      isActive: true,
      visitCount: 0,
      conversionCount: 0,
      customizations: {
        customMessage:
          "Manevi yolculuğunuzda rehberiniz olacağım. - Abdulkadir Kan",
      },
    },
  ],
  products: [
    {
      id: "sg001",
      name: "Ray-Ban Aviator Classic",
      description: "Klasik pilot güneş gözlüğü - İkonik tasarım",
      price: 150,
      originalPrice: 180,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Klasik",
      features: ["UV400 Koruma", "Polarize Cam", "Metal Çerçeve", "Ayarlanabilir Burun Pedi"],
      inStock: true,
      rating: 4.8,
      reviews: 245,
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "sg002",
      name: "Oakley Holbrook",
      description: "Modern spor tasarım - Aktif yaşam için ideal",
      price: 120,
      originalPrice: 145,
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Spor",
      features: ["Prizm Teknolojisi", "Çarpışma Direnci", "Hafif Malzeme", "Ergonomik Tasarım"],
      inStock: true,
      rating: 4.9,
      reviews: 189,
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "sg003",
      name: "Persol Steve McQueen",
      description: "Vintage lüks tasarım - El yapımı kalite",
      price: 280,
      originalPrice: 320,
      image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Lüks",
      features: ["El Yapımı", "Asetate Çerçeve", "Kristal Camlar", "İtalyan Tasarımı"],
      inStock: true,
      rating: 4.9,
      reviews: 156,
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "sg004",
      name: "Polaroid Cat Eye",
      description: "Retro kadın modeli - Şık ve zarif",
      price: 65,
      originalPrice: 85,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Kadın",
      features: ["Cat Eye Tasarım", "Gradient Renkler", "Asetat Çerçeve", "Vintage Stil"],
      inStock: true,
      rating: 4.6,
      reviews: 203,
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "sg005",
      name: "Maui Jim Cliff House",
      description: "Tropikal aktiviteler için profesyonel koruma",
      price: 195,
      originalPrice: 230,
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Outdoor",
      features: ["SuperThin Glass", "Anti-Reflektif", "Titanium Çerçeve", "Su Aktiviteleri"],
      inStock: true,
      rating: 4.7,
      reviews: 167,
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "sg006",
      name: "Gucci Square Frame",
      description: "High fashion lüks gözlük - Designer koleksiyonu",
      price: 420,
      originalPrice: 495,
      image: "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Designer",
      features: ["İtalyan Tasarım", "Premium Malzeme", "Marka Garantisi", "Lüks Kutulu"],
      inStock: true,
      rating: 4.8,
      reviews: 98,
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ],
  productPurchases: [],
  productCommissions: [],
  settings: {
    systemSettings: {
      maxCapacity: 100000,
      autoPlacement: true,
      registrationEnabled: true,
      maintenanceMode: false,
      lastMemberNumber: 1, // Start from 1 (ak000001 is taken by admin)
      performanceMode: true,
      cacheEnabled: true,
      batchSize: 100,
    },
    commissionSettings: {
      sponsorBonusRate: 10,
      careerBonusRate: 25,
      passiveIncomeRate: 5,
      systemFundRate: 60,
    },
  },
  performanceMetrics: {
    totalUsers: 1,
    activeUsers: 1,
    lastOptimized: new Date(),
    cacheHitRate: 0,
    averageResponseTime: 0,
  },
  announcements: [
    {
      id: "announce-001",
      title: "Sisteme Hoş Geldiniz",
      content:
        "Kutbul Zaman - Manevi Rehberim sistemine hoş geldiniz. Ruhsal ve finansal gelişim yolculuğunuz başlıyor.",
      type: "info",
      priority: "high",
      targetAudience: "all",
      startDate: new Date(),
      isActive: true,
      createdBy: "admin-001",
      createdAt: new Date(),
    },
  ],
  adminLogs: [], // Initialize empty admin logs
  memberLogs: [], // Initialize empty member logs
  memberActivities: [], // Initialize empty member activities
  memberSessions: [], // Initialize empty member sessions
  realTimeTransactions: [], // Initialize empty real-time transactions
  transactionBatches: [], // Initialize empty transaction batches
  balanceSnapshots: [], // Initialize empty balance snapshots
};

export class MLMDatabase {
  private static mongooseConnection: typeof mongoose | null = null;

  static async getInstance(): Promise<typeof mongoose> {
    try {
      if (!this.mongooseConnection) {
        const uri = process.env.MONGO_URI || process.env.DATABASE_URL || "mongodb://localhost:27017/kutbul_zaman_mlm";
        await mongoose.connect(uri, {
          autoIndex: true,
          serverSelectionTimeoutMS: 5000,
        });
        this.mongooseConnection = mongoose;
        console.log("✅ Mongoose connected");
      }
      return this.mongooseConnection;
    } catch (error) {
      console.error("❌ Mongoose connection error:", error);
      throw error;
    }
  }
  private db: any;

  async init() {
    try {
      // Ensure the data directory exists
      const fs = await import("fs");
      const path = await import("path");

      const dataDir = "data";
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = await JSONFilePreset("data/mlm-db.json", defaultData);
      console.log("MLM Database initialized successfully");
    } catch (error) {
      console.error("Error initializing MLM database:", error);
      // Create a fallback in-memory database
      this.db = {
        data: defaultData,
        read: async () => {},
        write: async () => {},
      };
    }
  }

  // User Management
  async getAllUsers(): Promise<User[]> {
    try {
      if (this.db && this.db.read) {
        await this.db.read();
        return this.db.data.users || [];
      }
      return [];
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    await this.db.read();
    return this.db.data.users.find((user: User) => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.db.read();
    return this.db.data.users.find((user: User) => user.email === email);
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    await this.db.read();
    return this.db.data.users.find((user: User) => user.referralCode === code);
  }

  async getUserByMemberId(memberId: string): Promise<User | undefined> {
    await this.db.read();
    return this.db.data.users.find((user: User) => user.memberId === memberId);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    await this.db.read();
    const norm = (p: string) => (p || '').replace(/\D/g, '');
    return this.db.data.users.find((user: User) => norm(user.phone) === norm(phone));
  }

  // Generate next member ID in sequence (ak000001, ak000002, etc.)
  async generateMemberId(): Promise<string> {
    await this.db.read();
    const lastNumber = this.db.data.settings.systemSettings.lastMemberNumber;
    const nextNumber = lastNumber + 1;

    // Update the last member number
    this.db.data.settings.systemSettings.lastMemberNumber = nextNumber;
    await this.db.write();

    // Format as ak0000001, ak0000002, etc.
    return `ak${nextNumber.toString().padStart(7, "0")}`;
  }

  async createUser(
    userData: Omit<User, "id" | "registrationDate" | "memberId">,
  ): Promise<User> {
    await this.db.read();

    const memberId = await this.generateMemberId();
    const now = new Date();
    const newUser: User = {
      ...userData,
      id: generateId(),
      memberId,
      registrationDate: now,
      lastActivityDate: now,
      monthlyActivityStatus: "active",
      yearlyRenewalDate: new Date(
        now.getFullYear() + 1,
        now.getMonth(),
        now.getDate(),
      ),
      daysSinceLastActivity: 0,
      monthlyActivityStreak: 1,
      nextRenewalWarning: new Date(
        now.getFullYear() + 1,
        now.getMonth() - 1,
        now.getDate(),
      ),
    };

    this.db.data.users.push(newUser);
    await this.db.write();

    // Create clone page for new user
    await this.createClonePage(newUser.id, userData.fullName, memberId);

    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    await this.db.read();
    const userIndex = this.db.data.users.findIndex(
      (user: User) => user.id === id,
    );

    if (userIndex === -1) return null;

    this.db.data.users[userIndex] = {
      ...this.db.data.users[userIndex],
      ...updates,
    };
    await this.db.write();

    return this.db.data.users[userIndex];
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.db.read();
    const userIndex = this.db.data.users.findIndex(
      (user: User) => user.id === id,
    );

    if (userIndex === -1) return false;

    this.db.data.users.splice(userIndex, 1);
    await this.db.write();

    return true;
  }

  // ===== Password Reset via SMS =====
  async createPasswordReset(userId: string, phone: string, code: string, expiresAt: Date): Promise<void> {
    await this.db.read();
    if (!this.db.data.passwordResets) this.db.data.passwordResets = [];
    this.db.data.passwordResets.push({ userId, phone, code, expiresAt: expiresAt.toISOString(), used: false });
    await this.db.write();
  }

  async verifyPasswordReset(phone: string, code: string): Promise<{ valid: boolean; userId?: string; reason?: string }> {
    await this.db.read();
    const list = this.db.data.passwordResets || [];
    const norm = (p: string) => (p || '').replace(/\D/g, '');
    const rec = [...list].reverse().find((r: any) => !r.used && r.code === code && norm(r.phone) === norm(phone));
    if (!rec) return { valid: false, reason: 'Kod bulunamadı veya kullanılmış.' };
    if (new Date(rec.expiresAt) < new Date()) return { valid: false, reason: 'Kodun süresi doldu.' };
    return { valid: true, userId: rec.userId };
  }

  async consumePasswordReset(phone: string, code: string): Promise<void> {
    await this.db.read();
    if (!this.db.data.passwordResets) return;
    const norm = (p: string) => (p || '').replace(/\D/g, '');
    const idx = this.db.data.passwordResets.findIndex((r: any) => !r.used && r.code === code && norm(r.phone) === norm(phone));
    if (idx !== -1) {
      this.db.data.passwordResets[idx].used = true;
      await this.db.write();
    }
  }

  // Network Management
  async getDirectReferrals(sponsorId: string): Promise<User[]> {
    await this.db.read();
    return this.db.data.users.filter(
      (user: User) => user.sponsorId === sponsorId,
    );
  }

  // Optimized network tree with pagination and lazy loading
  async getNetworkTree(
    userId: string,
    depth: number = 7,
    limit: number = 50,
  ): Promise<any> {
    await this.db.read();
    const user = await this.getUserById(userId);
    if (!user) return null;

    const buildTree = async (
      currentUserId: string,
      currentDepth: number,
    ): Promise<any> => {
      if (currentDepth > depth) return null;

      const currentUser = await this.getUserById(currentUserId);
      if (!currentUser) return null;

      const directReferrals = await this.getDirectReferrals(currentUserId);

      // Limit children to prevent performance issues
      const limitedReferrals = directReferrals.slice(0, limit);

      const children = await Promise.all(
        limitedReferrals.map((child) => buildTree(child.id, currentDepth + 1)),
      );

      return {
        user: currentUser,
        level: currentDepth,
        children: children.filter((child) => child !== null),
        totalTeamSize: await this.getTotalTeamSize(currentUserId),
        hasMoreChildren: directReferrals.length > limit,
        totalChildren: directReferrals.length,
      };
    };

    return buildTree(userId, 1);
  }

  // Get network tree with pagination
  async getNetworkTreePaginated(
    userId: string,
    depth: number = 7,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    await this.db.read();
    const user = await this.getUserById(userId);
    if (!user) return null;

    const offset = (page - 1) * limit;
    const directReferrals = await this.getDirectReferrals(userId);
    const paginatedReferrals = directReferrals.slice(offset, offset + limit);

    const children = await Promise.all(
      paginatedReferrals.map(async (child) => ({
        user: child,
        level: 2,
        children: depth > 1 ? await this.getDirectReferrals(child.id) : [],
        totalTeamSize: await this.getTotalTeamSize(child.id),
      })),
    );

    return {
      user,
      level: 1,
      children,
      totalChildren: directReferrals.length,
      currentPage: page,
      totalPages: Math.ceil(directReferrals.length / limit),
      hasNext: page * limit < directReferrals.length,
      hasPrevious: page > 1,
    };
  }

  // Optimized team size calculation with caching
  private teamSizeCache = new Map<
    string,
    { size: number; timestamp: number }
  >();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getTotalTeamSize(userId: string): Promise<number> {
    // Check cache first
    const cached = this.teamSizeCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.size;
    }

    const directReferrals = await this.getDirectReferrals(userId);
    let totalSize = directReferrals.length;

    // Use parallel processing for better performance
    if (directReferrals.length > 0) {
      const promises = directReferrals.map((referral) =>
        this.getTotalTeamSize(referral.id),
      );
      const sizes = await Promise.all(promises);
      totalSize += sizes.reduce((sum, size) => sum + size, 0);
    }

    // Cache the result
    this.teamSizeCache.set(userId, { size: totalSize, timestamp: Date.now() });
    return totalSize;
  }

  // Clear cache when needed
  clearTeamSizeCache(): void {
    this.teamSizeCache.clear();
  }

  // ===== ADVANCED BINARY ALGORITHM WITH ENHANCED AUTO-PLACEMENT =====

  // Advanced binary tree placement algorithms
  async findWeakestLeg(
    userId: string,
    algorithm:
      | "size_based"
      | "volume_based"
      | "balanced"
      | "depth_first" = "balanced",
  ): Promise<{
    parentId: string;
    position: "left" | "right";
    depth: number;
    score: number;
  } | null> {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const leftChild = user.leftChild
      ? await this.getUserById(user.leftChild)
      : null;
    const rightChild = user.rightChild
      ? await this.getUserById(user.rightChild)
      : null;

    // If no children, place on left first (binary system convention)
    if (!leftChild && !rightChild) {
      return { parentId: userId, position: "left", depth: 1, score: 0 };
    }

    // If only one side is empty, place there
    if (!leftChild)
      return { parentId: userId, position: "left", depth: 1, score: 0 };
    if (!rightChild)
      return { parentId: userId, position: "right", depth: 1, score: 0 };

    // Both sides have children, apply placement algorithm
    const leftStats = await this.getDetailedLegStats(leftChild.id);
    const rightStats = await this.getDetailedLegStats(rightChild.id);

    let leftScore = 0;
    let rightScore = 0;

    switch (algorithm) {
      case "size_based":
        leftScore = leftStats.teamSize;
        rightScore = rightStats.teamSize;
        break;
      case "volume_based":
        leftScore = leftStats.volume;
        rightScore = rightStats.volume;
        break;
      case "depth_first":
        leftScore = leftStats.maxDepth;
        rightScore = rightStats.maxDepth;
        break;
      case "balanced":
      default:
        // Balanced algorithm considers multiple factors
        leftScore = this.calculateLegScore(leftStats);
        rightScore = this.calculateLegScore(rightStats);
        break;
    }

    // Choose the leg with lower score (weaker leg)
    if (leftScore <= rightScore) {
      const result = await this.findWeakestLeg(leftChild.id, algorithm);
      return result ? { ...result, depth: result.depth + 1 } : null;
    } else {
      const result = await this.findWeakestLeg(rightChild.id, algorithm);
      return result ? { ...result, depth: result.depth + 1 } : null;
    }
  }

  // Calculate comprehensive leg score for balanced placement
  private calculateLegScore(stats: {
    teamSize: number;
    volume: number;
    activeMembers: number;
    maxDepth: number;
    avgInvestment: number;
  }): number {
    // Weighted scoring system
    const sizeWeight = 0.4;
    const volumeWeight = 0.3;
    const activeWeight = 0.2;
    const depthWeight = 0.1;

    const normalizedSize = stats.teamSize / 100; // Normalize to reasonable scale
    const normalizedVolume = stats.volume / 10000;
    const normalizedActive = stats.activeMembers / 100;
    const normalizedDepth = stats.maxDepth / 10;

    return (
      normalizedSize * sizeWeight +
      normalizedVolume * volumeWeight +
      normalizedActive * activeWeight +
      normalizedDepth * depthWeight
    );
  }

  // Get detailed leg statistics
  async getDetailedLegStats(userId: string): Promise<{
    teamSize: number;
    volume: number;
    activeMembers: number;
    maxDepth: number;
    avgInvestment: number;
    careerDistribution: Record<string, number>;
    recentGrowth: number;
  }> {
    try {
      const teamSize = await this.getTotalTeamSize(userId);
      const volume = await this.getTeamVolume(userId);
      const {
        activeMembers,
        maxDepth,
        avgInvestment,
        careerDistribution,
        recentGrowth,
      } = await this.calculateAdvancedLegStats(userId);

      return {
        teamSize,
        volume,
        activeMembers,
        maxDepth,
        avgInvestment,
        careerDistribution,
        recentGrowth,
      };
    } catch (error) {
      console.error("Error getting detailed leg stats:", error);
      return {
        teamSize: 0,
        volume: 0,
        activeMembers: 0,
        maxDepth: 0,
        avgInvestment: 0,
        careerDistribution: {},
        recentGrowth: 0,
      };
    }
  }

  // Calculate advanced statistics for a leg
  async calculateAdvancedLegStats(userId: string): Promise<{
    activeMembers: number;
    maxDepth: number;
    avgInvestment: number;
    careerDistribution: Record<string, number>;
    recentGrowth: number;
  }> {
    try {
      await this.db.read();

      const teamMembers = await this.getAllTeamMembers(userId);
      const activeMembers = teamMembers.filter(
        (member) => member.isActive,
      ).length;

      // Calculate max depth
      const maxDepth = await this.calculateMaxDepth(userId);

      // Calculate average investment
      const totalInvestment = teamMembers.reduce(
        (sum, member) => sum + member.totalInvestment,
        0,
      );
      const avgInvestment =
        teamMembers.length > 0 ? totalInvestment / teamMembers.length : 0;

      // Calculate career level distribution
      const careerDistribution = teamMembers.reduce(
        (dist, member) => {
          const careerName = member.careerLevel.name;
          dist[careerName] = (dist[careerName] || 0) + 1;
          return dist;
        },
        {} as Record<string, number>,
      );

      // Calculate recent growth (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentGrowth = teamMembers.filter(
        (member) => new Date(member.registrationDate) >= thirtyDaysAgo,
      ).length;

      return {
        activeMembers,
        maxDepth,
        avgInvestment,
        careerDistribution,
        recentGrowth,
      };
    } catch (error) {
      console.error("Error calculating advanced leg stats:", error);
      return {
        activeMembers: 0,
        maxDepth: 0,
        avgInvestment: 0,
        careerDistribution: {},
        recentGrowth: 0,
      };
    }
  }

  // Get all team members recursively
  async getAllTeamMembers(userId: string): Promise<User[]> {
    try {
      const directReferrals = await this.getDirectReferrals(userId);
      let allMembers = [...directReferrals];

      for (const referral of directReferrals) {
        const subTeam = await this.getAllTeamMembers(referral.id);
        allMembers = allMembers.concat(subTeam);
      }

      return allMembers;
    } catch (error) {
      console.error("Error getting all team members:", error);
      return [];
    }
  }

  // Calculate maximum depth of a leg
  async calculateMaxDepth(
    userId: string,
    currentDepth: number = 0,
  ): Promise<number> {
    try {
      const directReferrals = await this.getDirectReferrals(userId);

      if (directReferrals.length === 0) {
        return currentDepth;
      }

      const depths = await Promise.all(
        directReferrals.map((referral) =>
          this.calculateMaxDepth(referral.id, currentDepth + 1),
        ),
      );

      return Math.max(...depths);
    } catch (error) {
      console.error("Error calculating max depth:", error);
      return currentDepth;
    }
  }

  // Enhanced auto-placement with multiple algorithms
  async enhancedAutoPlacement(
    newUserId: string,
    sponsorId: string,
    preferences: {
      algorithm?: "size_based" | "volume_based" | "balanced" | "depth_first";
      maxDepth?: number;
      preferredSide?: "left" | "right" | "auto";
      considerCareerLevel?: boolean;
      avoidOverloading?: boolean;
    } = {},
  ): Promise<{
    success: boolean;
    placement?: { parentId: string; position: "left" | "right"; depth: number };
    message: string;
    algorithm: string;
    stats?: any;
  }> {
    try {
      const sponsor = await this.getUserById(sponsorId);
      if (!sponsor) {
        return {
          success: false,
          message: "Sponsor bulunamadı.",
          algorithm: "none",
        };
      }

      const algorithm = preferences.algorithm || "balanced";
      const maxDepth = preferences.maxDepth || 7;

      // Check if preferred side is available
      if (preferences.preferredSide && preferences.preferredSide !== "auto") {
        const targetField =
          preferences.preferredSide === "left" ? "leftChild" : "rightChild";
        if (!sponsor[targetField]) {
          await this.placeBinaryUser(newUserId, sponsorId);
          return {
            success: true,
            placement: {
              parentId: sponsorId,
              position: preferences.preferredSide,
              depth: 1,
            },
            message: `Kullanıcı ${preferences.preferredSide} tarafa yerleştirildi.`,
            algorithm: "preferred_side",
          };
        }
      }

      // Find optimal placement using specified algorithm
      const placement = await this.findOptimalPlacement(
        sponsorId,
        algorithm,
        maxDepth,
        preferences,
      );

      if (!placement) {
        return {
          success: false,
          message: "Uygun yerleştirme pozisyonu bulunamadı.",
          algorithm,
        };
      }

      // Execute placement
      await this.executeBinaryPlacement(
        newUserId,
        placement.parentId,
        placement.position,
      );

      // Get placement statistics
      const stats = await this.getPlacementStats(placement.parentId);

      return {
        success: true,
        placement,
        message: `Kullanıcı başarıyla ${placement.position} tarafa yerleştirildi (Derinlik: ${placement.depth}).`,
        algorithm,
        stats,
      };
    } catch (error) {
      console.error("Error in enhanced auto-placement:", error);
      return {
        success: false,
        message: "Yerleştirme sırasında hata oluştu.",
        algorithm: preferences.algorithm || "balanced",
      };
    }
  }

  // Find optimal placement position
  async findOptimalPlacement(
    sponsorId: string,
    algorithm: string,
    maxDepth: number,
    preferences: any,
  ): Promise<{
    parentId: string;
    position: "left" | "right";
    depth: number;
    score: number;
  } | null> {
    try {
      // Use depth-first search to find available positions
      const candidates = await this.findAvailablePositions(sponsorId, maxDepth);

      if (candidates.length === 0) {
        return null;
      }

      // Score each candidate position
      const scoredCandidates = await Promise.all(
        candidates.map(async (candidate) => {
          const score = await this.scorePlacementPosition(
            candidate,
            algorithm,
            preferences,
          );
          return { ...candidate, score };
        }),
      );

      // Sort by score (lowest score = best position)
      scoredCandidates.sort((a, b) => a.score - b.score);

      return scoredCandidates[0];
    } catch (error) {
      console.error("Error finding optimal placement:", error);
      return null;
    }
  }

  // Find all available positions within max depth
  async findAvailablePositions(
    startUserId: string,
    maxDepth: number,
    currentDepth: number = 1,
  ): Promise<
    Array<{ parentId: string; position: "left" | "right"; depth: number }>
  > {
    if (currentDepth > maxDepth) {
      return [];
    }

    const user = await this.getUserById(startUserId);
    if (!user) {
      return [];
    }

    const positions: Array<{
      parentId: string;
      position: "left" | "right";
      depth: number;
    }> = [];

    // Check if left position is available
    if (!user.leftChild) {
      positions.push({
        parentId: startUserId,
        position: "left",
        depth: currentDepth,
      });
    } else {
      // Recursively check left subtree
      const leftPositions = await this.findAvailablePositions(
        user.leftChild,
        maxDepth,
        currentDepth + 1,
      );
      positions.push(...leftPositions);
    }

    // Check if right position is available
    if (!user.rightChild) {
      positions.push({
        parentId: startUserId,
        position: "right",
        depth: currentDepth,
      });
    } else {
      // Recursively check right subtree
      const rightPositions = await this.findAvailablePositions(
        user.rightChild,
        maxDepth,
        currentDepth + 1,
      );
      positions.push(...rightPositions);
    }

    return positions;
  }

  // Score a placement position based on algorithm
  async scorePlacementPosition(
    position: { parentId: string; position: "left" | "right"; depth: number },
    algorithm: string,
    preferences: any,
  ): Promise<number> {
    try {
      const parent = await this.getUserById(position.parentId);
      if (!parent) {
        return Infinity; // Invalid position
      }

      let score = 0;

      // Base score from depth (prefer shallower depths)
      score += position.depth * 10;

      // Algorithm-specific scoring
      switch (algorithm) {
        case "size_based":
          score += await this.scoreByTeamSize(
            position.parentId,
            position.position,
          );
          break;
        case "volume_based":
          score += await this.scoreByVolume(
            position.parentId,
            position.position,
          );
          break;
        case "depth_first":
          score += await this.scoreByDepth(
            position.parentId,
            position.position,
          );
          break;
        case "balanced":
        default:
          score += await this.scoreByBalance(
            position.parentId,
            position.position,
          );
          break;
      }

      // Apply preference modifiers
      if (preferences.avoidOverloading) {
        const overloadPenalty = await this.calculateOverloadPenalty(
          position.parentId,
        );
        score += overloadPenalty;
      }

      if (preferences.considerCareerLevel) {
        const careerBonus = await this.calculateCareerBonus(position.parentId);
        score -= careerBonus; // Lower score = better
      }

      return score;
    } catch (error) {
      console.error("Error scoring placement position:", error);
      return Infinity;
    }
  }

  // Scoring methods for different algorithms
  async scoreByTeamSize(
    parentId: string,
    position: "left" | "right",
  ): Promise<number> {
    const parent = await this.getUserById(parentId);
    if (!parent) return 0;

    const otherSide =
      position === "left" ? parent.rightChild : parent.leftChild;
    if (!otherSide) return 0;

    const otherSideSize = await this.getTotalTeamSize(otherSide);
    return otherSideSize; // Prefer to balance by placing on smaller side
  }

  async scoreByVolume(
    parentId: string,
    position: "left" | "right",
  ): Promise<number> {
    const parent = await this.getUserById(parentId);
    if (!parent) return 0;

    const otherSide =
      position === "left" ? parent.rightChild : parent.leftChild;
    if (!otherSide) return 0;

    const otherSideVolume = await this.getTeamVolume(otherSide);
    return otherSideVolume / 1000; // Scale down for scoring
  }

  async scoreByDepth(
    parentId: string,
    position: "left" | "right",
  ): Promise<number> {
    const parent = await this.getUserById(parentId);
    if (!parent) return 0;

    const otherSide =
      position === "left" ? parent.rightChild : parent.leftChild;
    if (!otherSide) return 0;

    const otherSideDepth = await this.calculateMaxDepth(otherSide);
    return otherSideDepth * 5; // Prefer to place on less deep side
  }

  async scoreByBalance(
    parentId: string,
    position: "left" | "right",
  ): Promise<number> {
    const sizeScore = await this.scoreByTeamSize(parentId, position);
    const volumeScore = await this.scoreByVolume(parentId, position);
    const depthScore = await this.scoreByDepth(parentId, position);

    return sizeScore * 0.5 + volumeScore * 0.3 + depthScore * 0.2;
  }

  async calculateOverloadPenalty(parentId: string): Promise<number> {
    const parent = await this.getUserById(parentId);
    if (!parent) return 0;

    const leftSize = parent.leftChild
      ? await this.getTotalTeamSize(parent.leftChild)
      : 0;
    const rightSize = parent.rightChild
      ? await this.getTotalTeamSize(parent.rightChild)
      : 0;
    const imbalance = Math.abs(leftSize - rightSize);

    return imbalance > 10 ? imbalance * 2 : 0; // Penalty for significant imbalance
  }

  async calculateCareerBonus(parentId: string): Promise<number> {
    const parent = await this.getUserById(parentId);
    if (!parent) return 0;

    // Higher career level parents get bonus for placement preference
    return parent.careerLevel.level * 2;
  }

  // Execute binary placement
  async executeBinaryPlacement(
    userId: string,
    parentId: string,
    position: "left" | "right",
  ): Promise<void> {
    const parent = await this.getUserById(parentId);
    if (!parent) {
      throw new Error("Parent user not found");
    }

    const updates: Partial<User> = {};
    if (position === "left") {
      updates.leftChild = userId;
    } else {
      updates.rightChild = userId;
    }

    await this.updateUser(parentId, updates);
    await this.updateUser(userId, { sponsorId: parentId });

    // Clear caches as tree structure changed
    this.clearTeamSizeCache();
    this.teamVolumeCache.clear();
  }

  // Get placement statistics
  async getPlacementStats(parentId: string): Promise<any> {
    const parent = await this.getUserById(parentId);
    if (!parent) return null;

    const leftSize = parent.leftChild
      ? await this.getTotalTeamSize(parent.leftChild)
      : 0;
    const rightSize = parent.rightChild
      ? await this.getTotalTeamSize(parent.rightChild)
      : 0;
    const leftVolume = parent.leftChild
      ? await this.getTeamVolume(parent.leftChild)
      : 0;
    const rightVolume = parent.rightChild
      ? await this.getTeamVolume(parent.rightChild)
      : 0;

    return {
      parentInfo: {
        id: parent.id,
        name: parent.fullName,
        memberId: parent.memberId,
        careerLevel: parent.careerLevel.name,
      },
      leftLeg: {
        size: leftSize,
        volume: leftVolume,
        hasChild: !!parent.leftChild,
      },
      rightLeg: {
        size: rightSize,
        volume: rightVolume,
        hasChild: !!parent.rightChild,
      },
      balance: {
        sizeRatio:
          rightSize > 0 ? leftSize / rightSize : leftSize > 0 ? Infinity : 1,
        volumeRatio:
          rightVolume > 0
            ? leftVolume / rightVolume
            : leftVolume > 0
              ? Infinity
              : 1,
        isBalanced: Math.abs(leftSize - rightSize) <= 2,
      },
    };
  }

  // Optimized team volume calculation with caching
  private teamVolumeCache = new Map<
    string,
    { volume: number; timestamp: number }
  >();

  async getTeamVolume(userId: string): Promise<number> {
    // Check cache first
    const cached = this.teamVolumeCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.volume;
    }

    const user = await this.getUserById(userId);
    if (!user) return 0;

    const directReferrals = await this.getDirectReferrals(userId);
    let totalVolume = user.totalInvestment;

    // Use parallel processing for better performance
    if (directReferrals.length > 0) {
      const promises = directReferrals.map((referral) =>
        this.getTeamVolume(referral.id),
      );
      const volumes = await Promise.all(promises);
      totalVolume += volumes.reduce((sum, volume) => sum + volume, 0);
    }

    // Cache the result
    this.teamVolumeCache.set(userId, {
      volume: totalVolume,
      timestamp: Date.now(),
    });
    return totalVolume;
  }

  // Place user in binary tree with enhanced auto-placement
  async placeBinaryUser(
    newUserId: string,
    sponsorId?: string,
    preferences: {
      algorithm?: "size_based" | "volume_based" | "balanced" | "depth_first";
      maxDepth?: number;
      preferredSide?: "left" | "right" | "auto";
      considerCareerLevel?: boolean;
      avoidOverloading?: boolean;
    } = {},
  ): Promise<{
    success: boolean;
    placement?: any;
    message: string;
  }> {
    try {
      if (!sponsorId) {
        // No sponsor, place under admin (root)
        const admin = await this.getUserByEmail(
          "psikologabdulkadirkan@gmail.com",
        );
        if (admin) {
          sponsorId = admin.id;
        }
      }

      if (!sponsorId) {
        return {
          success: false,
          message: "Sponsor bulunamadı.",
        };
      }

      // Use enhanced auto-placement algorithm
      const result = await this.enhancedAutoPlacement(
        newUserId,
        sponsorId,
        preferences,
      );

      if (result.success) {
        // Log the placement
        const user = await this.getUserById(newUserId);
        if (user) {
          await this.createAdminLog({
            action: "BINARY_PLACEMENT",
            targetUserId: newUserId,
            details: `User ${user.fullName} placed using ${result.algorithm} algorithm at depth ${result.placement?.depth}`,
            adminId: "system",
            metadata: {
              algorithm: result.algorithm,
              placement: result.placement,
              stats: result.stats,
            },
          });
        }
      }

      return result;
    } catch (error) {
      console.error("Error in placeBinaryUser:", error);
      return {
        success: false,
        message: "Yerleştirme sırasında hata oluştu.",
      };
    }
  }

  // Legacy function for backward compatibility
  async legacyPlaceBinaryUser(
    newUserId: string,
    sponsorId?: string,
  ): Promise<void> {
    const result = await this.placeBinaryUser(newUserId, sponsorId, {
      algorithm: "balanced",
    });
    if (!result.success) {
      console.error("Legacy placement failed:", result.message);
    }
  }

  // Transaction Management
  async createTransaction(
    transaction: Omit<Transaction, "id" | "date">,
  ): Promise<Transaction> {
    await this.db.read();

    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      date: new Date(),
    };

    this.db.data.transactions.push(newTransaction);

    // Update user wallet if transaction is completed
    if (newTransaction.status === "completed") {
      await this.updateUserWallet(
        newTransaction.userId,
        newTransaction.amount,
        newTransaction.type,
      );
    }

    await this.db.write();
    return newTransaction;
  }

  async updateUserWallet(
    userId: string,
    amount: number,
    type: string,
  ): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    switch (type) {
      case "deposit":
      case "commission":
      case "bonus":
        user.wallet.balance += amount;
        user.wallet.totalEarnings += amount;
        break;
      case "withdrawal":
        user.wallet.balance -= amount;
        break;
    }

    await this.updateUser(userId, user);
  }

  // Payment Request Management
  async createPaymentRequest(
    request: Omit<PaymentRequest, "id" | "requestDate">,
  ): Promise<PaymentRequest> {
    await this.db.read();

    const newRequest: PaymentRequest = {
      ...request,
      id: generateId(),
      requestDate: new Date(),
    };

    this.db.data.paymentRequests.push(newRequest);
    await this.db.write();

    return newRequest;
  }

  async updatePaymentRequest(
    id: string,
    updates: Partial<PaymentRequest>,
  ): Promise<PaymentRequest | null> {
    await this.db.read();
    const requestIndex = this.db.data.paymentRequests.findIndex(
      (req: PaymentRequest) => req.id === id,
    );

    if (requestIndex === -1) return null;

    this.db.data.paymentRequests[requestIndex] = {
      ...this.db.data.paymentRequests[requestIndex],
      ...updates,
      processedDate: new Date(),
    };

    await this.db.write();
    return this.db.data.paymentRequests[requestIndex];
  }

  // Clone Page Management
  async createClonePage(
    userId: string,
    userName: string,
    memberId?: string,
  ): Promise<ClonePage> {
    await this.db.read();

    // Create slug from member ID if available, otherwise use name
    const slug = memberId
      ? memberId
      : userName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

    const clonePage: ClonePage = {
      userId,
      slug,
      isActive: true,
      visitCount: 0,
      conversionCount: 0,
      customizations: {
        customMessage: `${userName} üzerinden sisteme katılın ve manevi yolculuğunuza başlayın!`,
      },
    };

    this.db.data.clonePages.push(clonePage);
    await this.db.write();

    return clonePage;
  }

  async getClonePageBySlug(slug: string): Promise<ClonePage | undefined> {
    await this.db.read();
    return this.db.data.clonePages.find(
      (page: ClonePage) => page.slug === slug,
    );
  }

  // Enhanced 7-Level Commission Calculation and Distribution
  async calculateAndDistributeCommissions(
    investment: number,
    userId: string,
  ): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user || !user.sponsorId) return;

    console.log(
      `Distributing commissions for ${user.fullName}: $${investment}`,
    );

    // 1. Direct Sponsor Bonus (10%)
    const sponsorBonus = investment * 0.1;
    const sponsor = await this.getUserById(user.sponsorId);
    if (sponsor && sponsor.isActive) {
      await this.createTransaction({
        userId: sponsor.id,
        type: "commission",
        amount: sponsorBonus,
        description: `Direkt sponsor bonusu: ${user.fullName}`,
        status: "completed",
      });

      // Update sponsor's wallet
      sponsor.wallet.sponsorBonus += sponsorBonus;
      sponsor.wallet.balance += sponsorBonus;
      await this.updateUser(sponsor.id, { wallet: sponsor.wallet });
    }

    // 2. Binary Network Commissions (25%) - 7 levels deep
    await this.distributeBinaryCommissions(investment * 0.25, userId);

    // 3. Career Level Passive Income (5%) - up to 7 levels
    await this.distributePassiveIncome(investment * 0.05, userId, 7);

    // 4. System Fund (60%) - goes to admin
    const systemFund = investment * 0.6;
    const admin = await this.getUserByEmail("psikologabdulkadirkan@gmail.com");
    if (admin) {
      await this.createTransaction({
        userId: admin.id,
        type: "bonus",
        amount: systemFund,
        description: `Sistem fonu: ${user.fullName} yatırımı`,
        status: "completed",
      });

      admin.wallet.balance += systemFund;
      await this.updateUser(admin.id, { wallet: admin.wallet });
    }
  }

  // Binary Network Commission Distribution (7 levels)
  async distributeBinaryCommissions(
    amount: number,
    userId: string,
  ): Promise<void> {
    const commissionRates = [0.08, 0.06, 0.05, 0.03, 0.02, 0.015, 0.005]; // Decreasing rates for 7 levels

    await this.traverseUpline(userId, (uplineUser, level) => {
      if (level > 7 || !uplineUser.isActive) return false;

      const commissionRate = commissionRates[level - 1] || 0;
      const commission = amount * commissionRate;

      if (commission > 0) {
        this.createTransaction({
          userId: uplineUser.id,
          type: "commission",
          amount: commission,
          description: `Binary network bonus - Seviye ${level}`,
          status: "completed",
        });

        // Update user wallet
        uplineUser.wallet.careerBonus += commission;
        uplineUser.wallet.balance += commission;
        this.updateUser(uplineUser.id, { wallet: uplineUser.wallet });

        console.log(
          `Level ${level} commission: $${commission} to ${uplineUser.fullName}`,
        );
      }

      return true; // Continue traversing
    });
  }

  // Traverse upline for commission distribution
  async traverseUpline(
    userId: string,
    callback: (user: User, level: number) => boolean,
  ): Promise<void> {
    let currentUserId = userId;
    let level = 1;

    while (level <= 7) {
      const currentUser = await this.getUserById(currentUserId);
      if (!currentUser || !currentUser.sponsorId) break;

      const uplineUser = await this.getUserById(currentUser.sponsorId);
      if (!uplineUser) break;

      const shouldContinue = callback(uplineUser, level);
      if (!shouldContinue) break;

      currentUserId = uplineUser.id;
      level++;
    }
  }

  async distributeCareerBonus(amount: number, userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    const careerBonus = (amount * user.careerLevel.commissionRate) / 100;

    await this.createTransaction({
      userId: user.id,
      type: "bonus",
      amount: careerBonus,
      description: `Kariyer bonusu - ${user.careerLevel.name}`,
      status: "completed",
    });
  }

  // Enhanced Passive Income Distribution with Career Level Multipliers
  async distributePassiveIncome(
    amount: number,
    userId: string,
    levels: number,
  ): Promise<void> {
    if (levels <= 0) return;

    const user = await this.getUserById(userId);
    if (!user || !user.sponsorId) return;

    const sponsor = await this.getUserById(user.sponsorId);
    if (
      sponsor &&
      sponsor.isActive &&
      sponsor.careerLevel.passiveIncomeRate > 0
    ) {
      // Calculate passive income based on career level and remaining levels
      const baseRate = sponsor.careerLevel.passiveIncomeRate;
      const levelMultiplier = levels / 7; // Decreasing multiplier for deeper levels
      const passiveAmount = (amount * baseRate * levelMultiplier) / 100;

      if (passiveAmount > 0) {
        await this.createTransaction({
          userId: sponsor.id,
          type: "commission",
          amount: passiveAmount,
          description: `Pasif gelir - Seviye ${8 - levels}: ${user.fullName} (${sponsor.careerLevel.name})`,
          status: "completed",
        });

        // Update sponsor's wallet
        sponsor.wallet.passiveIncome += passiveAmount;
        sponsor.wallet.balance += passiveAmount;
        await this.updateUser(sponsor.id, { wallet: sponsor.wallet });

        console.log(
          `Passive income: $${passiveAmount} to ${sponsor.fullName} (Level ${8 - levels})`,
        );
      }

      // Continue up the chain
      await this.distributePassiveIncome(amount, sponsor.id, levels - 1);
    }
  }

  // Get binary network statistics
  async getBinaryNetworkStats(userId: string): Promise<{
    leftVolume: number;
    rightVolume: number;
    leftCount: number;
    rightCount: number;
    binaryBonus: number;
    nextBinaryBonus: number;
  }> {
    const user = await this.getUserById(userId);
    if (!user) {
      return {
        leftVolume: 0,
        rightVolume: 0,
        leftCount: 0,
        rightCount: 0,
        binaryBonus: 0,
        nextBinaryBonus: 0,
      };
    }

    const leftChild = user.leftChild
      ? await this.getUserById(user.leftChild)
      : null;
    const rightChild = user.rightChild
      ? await this.getUserById(user.rightChild)
      : null;

    const leftVolume = leftChild ? await this.getTeamVolume(leftChild.id) : 0;
    const rightVolume = rightChild
      ? await this.getTeamVolume(rightChild.id)
      : 0;
    const leftCount = leftChild ? await this.getTotalTeamSize(leftChild.id) : 0;
    const rightCount = rightChild
      ? await this.getTotalTeamSize(rightChild.id)
      : 0;

    // Calculate binary bonus (based on weaker leg)
    const weakerVolume = Math.min(leftVolume, rightVolume);
    const binaryBonus = weakerVolume * 0.1; // 10% of weaker leg volume

    // Calculate next binary bonus needed
    const strongerVolume = Math.max(leftVolume, rightVolume);
    const nextBinaryBonus = (strongerVolume - weakerVolume) * 0.1;

    return {
      leftVolume,
      rightVolume,
      leftCount,
      rightCount,
      binaryBonus,
      nextBinaryBonus,
    };
  }

  // Settings Management
  async getSettings(): Promise<DatabaseSchema["settings"]> {
    try {
      if (this.db && this.db.read) {
        await this.db.read();
        return this.db.data.settings || defaultData.settings;
      }
      return defaultData.settings;
    } catch (error) {
      console.error("Error getting settings:", error);
      return defaultData.settings;
    }
  }

  async updateSettings(
    settings: Partial<DatabaseSchema["settings"]>,
  ): Promise<void> {
    await this.db.read();
    this.db.data.settings = { ...this.db.data.settings, ...settings };
    await this.db.write();
  }

  // Announcements
  async getAnnouncements(): Promise<DatabaseSchema["announcements"]> {
    await this.db.read();
    return this.db.data.announcements.filter((ann) => ann.isActive);
  }

  async createAnnouncement(
    announcement: Omit<DatabaseSchema["announcements"][0], "id" | "createdAt">,
  ): Promise<void> {
    await this.db.read();

    const newAnnouncement = {
      ...announcement,
      id: generateId(),
      createdAt: new Date(),
    };

    this.db.data.announcements.push(newAnnouncement);
    await this.db.write();
  }

  // Performance monitoring methods
  async updatePerformanceMetrics(): Promise<void> {
    const users = await this.getAllUsers();
    const activeUsers = users.filter((user) => user.isActive);

    await this.db.read();
    this.db.data.performanceMetrics = {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      lastOptimized: new Date(),
      cacheHitRate: this.calculateCacheHitRate(),
      averageResponseTime: this.calculateAverageResponseTime(),
    };
    await this.db.write();
  }

  private calculateCacheHitRate(): number {
    const totalCacheAttempts =
      this.teamSizeCache.size + this.teamVolumeCache.size;
    if (totalCacheAttempts === 0) return 0;

    // Simplified cache hit rate calculation
    const validCacheEntries =
      Array.from(this.teamSizeCache.values()).filter(
        (entry) => Date.now() - entry.timestamp < this.CACHE_DURATION,
      ).length +
      Array.from(this.teamVolumeCache.values()).filter(
        (entry) => Date.now() - entry.timestamp < this.CACHE_DURATION,
      ).length;

    return (validCacheEntries / totalCacheAttempts) * 100;
  }

  private calculateAverageResponseTime(): number {
    // This would be implemented with actual timing in production
    return Math.random() * 100 + 50; // Placeholder
  }

  // Batch processing for large operations
  async batchUpdateUsers(
    updates: Array<{ userId: string; data: Partial<User> }>,
  ): Promise<boolean[]> {
    const results: boolean[] = [];
    const batchSize = 50; // Process in batches of 50

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      const batchPromises = batch.map(async ({ userId, data }) => {
        try {
          const result = await this.updateUser(userId, data);
          return result !== null;
        } catch (error) {
          console.error(`Error updating user ${userId}:`, error);
          return false;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  // Batch commission distribution for large networks
  async batchDistributeCommissions(
    distributions: Array<{ investment: number; userId: string }>,
  ): Promise<void> {
    const batchSize = 25; // Smaller batches for commission calculations

    for (let i = 0; i < distributions.length; i += batchSize) {
      const batch = distributions.slice(i, i + batchSize);
      const batchPromises = batch.map(({ investment, userId }) =>
        this.calculateAndDistributeCommissions(investment, userId),
      );

      await Promise.all(batchPromises);

      // Small delay to prevent overwhelming the system
      if (i + batchSize < distributions.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  // Optimize database for large scale operations
  async optimizeForScale(): Promise<void> {
    console.log("Starting database optimization for large scale...");

    // Clear old cache entries
    this.clearOldCacheEntries();

    // Update performance metrics
    await this.updatePerformanceMetrics();

    // Enable performance mode if not already enabled
    const settings = await this.getSettings();
    if (!settings.systemSettings.performanceMode) {
      await this.updateSettings({
        ...settings,
        systemSettings: {
          ...settings.systemSettings,
          performanceMode: true,
          cacheEnabled: true,
        },
      });
    }

    console.log("Database optimization completed");
  }

  private clearOldCacheEntries(): void {
    const now = Date.now();

    // Clear expired team size cache entries
    for (const [key, value] of this.teamSizeCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.teamSizeCache.delete(key);
      }
    }

    // Clear expired team volume cache entries
    for (const [key, value] of this.teamVolumeCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.teamVolumeCache.delete(key);
      }
    }
  }

  // Get system performance status
  async getPerformanceStatus(): Promise<{
    isOptimized: boolean;
    metrics: any;
    recommendations: string[];
  }> {
    await this.db.read();
    const metrics = this.db.data.performanceMetrics;
    const settings = this.db.data.settings.systemSettings;

    const recommendations: string[] = [];

    if (metrics.totalUsers > 50000 && !settings.performanceMode) {
      recommendations.push("Enable performance mode for better scalability");
    }

    if (metrics.cacheHitRate < 70) {
      recommendations.push("Consider increasing cache duration");
    }

    if (metrics.averageResponseTime > 200) {
      recommendations.push("Database optimization needed");
    }

    return {
      isOptimized: settings.performanceMode && settings.cacheEnabled,
      metrics,
      recommendations,
    };
  }

  // Gracefully handle system at capacity
  async checkSystemCapacity(): Promise<{
    canAddUser: boolean;
    message?: string;
  }> {
    const settings = await this.getSettings();
    const users = await this.getAllUsers();

    if (users.length >= settings.systemSettings.maxCapacity) {
      return {
        canAddUser: false,
        message: `System has reached maximum capacity of ${settings.systemSettings.maxCapacity} users`,
      };
    }

    const utilizationRate =
      (users.length / settings.systemSettings.maxCapacity) * 100;

    if (utilizationRate > 90) {
      return {
        canAddUser: true,
        message: `System is ${utilizationRate.toFixed(1)}% full. Consider optimization.`,
      };
    }

    return { canAddUser: true };
  }

  // ===== ACTIVITY TRACKING FUNCTIONS =====

  // Update user activity status
  async updateUserActivity(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    const now = new Date();
    const daysSinceLastActivity = user.lastActivityDate
      ? Math.floor(
          (now.getTime() - new Date(user.lastActivityDate).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 999;

    // Calculate monthly activity status
    let monthlyActivityStatus: "active" | "inactive" | "warning" = "active";
    if (daysSinceLastActivity > 30) {
      monthlyActivityStatus = "inactive";
    } else if (daysSinceLastActivity > 20) {
      monthlyActivityStatus = "warning";
    }

    // Update monthly activity streak
    let monthlyActivityStreak = user.monthlyActivityStreak || 0;
    if (daysSinceLastActivity <= 30) {
      monthlyActivityStreak++;
    } else {
      monthlyActivityStreak = 0;
    }

    // Calculate yearly renewal date
    const yearlyRenewalDate = new Date(
      user.membershipStartDate || user.registrationDate,
    );
    yearlyRenewalDate.setFullYear(yearlyRenewalDate.getFullYear() + 1);

    // Calculate next renewal warning (30 days before renewal)
    const nextRenewalWarning = new Date(yearlyRenewalDate);
    nextRenewalWarning.setDate(nextRenewalWarning.getDate() - 30);

    await this.updateUser(userId, {
      lastActivityDate: now,
      daysSinceLastActivity,
      monthlyActivityStatus,
      monthlyActivityStreak,
      yearlyRenewalDate,
      nextRenewalWarning,
    });
  }

  // Get activity statistics for a user
  async getUserActivityStats(userId: string): Promise<{
    daysSinceLastActivity: number;
    monthlyActivityStatus: "active" | "inactive" | "warning";
    monthlyActivityStreak: number;
    daysUntilYearlyRenewal: number;
    daysUntilRenewalWarning: number;
    renewalStatus: "active" | "warning" | "expired";
  } | null> {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const now = new Date();
    const daysSinceLastActivity = user.lastActivityDate
      ? Math.floor(
          (now.getTime() - new Date(user.lastActivityDate).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 999;

    const daysUntilYearlyRenewal = user.yearlyRenewalDate
      ? Math.ceil(
          (new Date(user.yearlyRenewalDate).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

    const daysUntilRenewalWarning = user.nextRenewalWarning
      ? Math.ceil(
          (new Date(user.nextRenewalWarning).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

    let renewalStatus: "active" | "warning" | "expired" = "active";
    if (daysUntilYearlyRenewal <= 0) {
      renewalStatus = "expired";
    } else if (daysUntilRenewalWarning <= 0) {
      renewalStatus = "warning";
    }

    return {
      daysSinceLastActivity,
      monthlyActivityStatus: user.monthlyActivityStatus,
      monthlyActivityStreak: user.monthlyActivityStreak,
      daysUntilYearlyRenewal,
      daysUntilRenewalWarning,
      renewalStatus,
    };
  }

  // Get all users with their activity status
  async getAllUsersWithActivity(): Promise<
    Array<User & { activityStats: any }>
  > {
    const users = await this.getAllUsers();
    const usersWithActivity = await Promise.all(
      users.map(async (user) => {
        const activityStats = await this.getUserActivityStats(user.id);
        return { ...user, activityStats };
      }),
    );
    return usersWithActivity;
  }

  // Update multiple users' activity status
  async batchUpdateActivity(userIds: string[]): Promise<void> {
    const batchSize = 50;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      await Promise.all(batch.map((userId) => this.updateUserActivity(userId)));
    }
  }

  // ===== PRODUCT MANAGEMENT FUNCTIONS =====

  // Get all active products
  async getAllProducts(): Promise<Product[]> {
    try {
      await this.db.read();
      return (this.db.data.products || []).filter((product: Product) => product.isActive);
    } catch (error) {
      console.error("Error reading products from database:", error);
      return [];
    }
  }

  // Get product by ID
  async getProductById(productId: string): Promise<Product | undefined> {
    await this.db.read();
    return this.db.data.products.find((product: Product) => product.id === productId);
  }

  // Create product purchase
  async createProductPurchase(purchaseData: {
    productId: string;
    buyerId?: string;
    buyerEmail: string;
    referralCode?: string;
    shippingAddress: ProductPurchase['shippingAddress'];
    paymentMethod: ProductPurchase['paymentMethod'];
    totalAmount?: number;
    shippingCost?: number;
    paymentId?: string;
    conversationId?: string;
    status?: ProductPurchase['status'];
  }): Promise<{ success: boolean; purchase?: ProductPurchase; message: string }> {
    try {
      await this.db.read();

      const product = await this.getProductById(purchaseData.productId);
      if (!product) {
        return { success: false, message: "Ürün bulunamadı." };
      }

      if (!product.inStock) {
        return { success: false, message: "Ürün stokta bulunmuyor." };
      }

      // Find sponsor by referral code
      let sponsorId: string | undefined;
      if (purchaseData.referralCode) {
        const sponsor = await this.getUserByMemberId(purchaseData.referralCode);
        sponsorId = sponsor?.id;
      }

      const purchase: ProductPurchase = {
        id: generateId(),
        productId: purchaseData.productId,
        buyerId: purchaseData.buyerId || generateId(),
        buyerEmail: purchaseData.buyerEmail,
        referralCode: purchaseData.referralCode,
        sponsorId,
        purchaseAmount: purchaseData.totalAmount || product.price,
        status: purchaseData.status || "pending", // Default to pending for payment processing
        paymentMethod: purchaseData.paymentMethod,
        shippingAddress: purchaseData.shippingAddress,
        purchaseDate: new Date(),
        commissionDistributed: false,
        paymentId: purchaseData.paymentId,
        conversationId: purchaseData.conversationId,
        shippingCost: purchaseData.shippingCost || 0,
      };

      this.db.data.productPurchases.push(purchase);
      await this.db.write();

      // Only distribute commissions if status is completed
      if (purchase.status === "completed") {
        await this.distributeProductCommissions(purchase.id);
      }

      return {
        success: true,
        purchase,
        message: "Ürün satın alma işlemi başarılı! Komisyonlar dağıtıldı.",
      };
    } catch (error) {
      console.error("Error creating product purchase:", error);
      return {
        success: false,
        message: "Satın alma işlemi sırasında hata oluştu.",
      };
    }
  }





  // Get product purchase by ID
  async getProductPurchaseById(purchaseId: string): Promise<ProductPurchase | undefined> {
    await this.db.read();
    return this.db.data.productPurchases.find(
      (purchase: ProductPurchase) => purchase.id === purchaseId
    );
  }

  // Update product purchase
  async updateProductPurchase(
    purchaseId: string,
    updates: Partial<ProductPurchase>
  ): Promise<{ success: boolean; purchase?: ProductPurchase; message: string }> {
    try {
      await this.db.read();
      const purchaseIndex = this.db.data.productPurchases.findIndex(
        (purchase: ProductPurchase) => purchase.id === purchaseId
      );

      if (purchaseIndex === -1) {
        return {
          success: false,
          message: "Satın alma kaydı bulunamadı.",
        };
      }

      this.db.data.productPurchases[purchaseIndex] = {
        ...this.db.data.productPurchases[purchaseIndex],
        ...updates,
      };

      await this.db.write();

      return {
        success: true,
        purchase: this.db.data.productPurchases[purchaseIndex],
        message: "Satın alma kaydı güncellendi.",
      };
    } catch (error) {
      console.error("Error updating purchase:", error);
      return {
        success: false,
        message: "Satın alma kaydı güncellenirken hata oluştu.",
      };
    }
  }

  // Get product sales statistics
  async getProductSalesStats(): Promise<{
    totalSales: number;
    totalRevenue: number;
    totalCommissions: number;
    totalSystemFund: number;
    topProducts: Array<{ productId: string; sales: number; revenue: number }>;
  }> {
    await this.db.read();

    const purchases = this.db.data.productPurchases.filter(
      (p: ProductPurchase) => p.status === "completed"
    );

    const totalSales = purchases.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + p.purchaseAmount, 0);
    const totalCommissions = totalRevenue * 0.4;
    const totalSystemFund = totalRevenue * 0.6;

    // Group by product
    const productStats = purchases.reduce((acc, purchase) => {
      const productId = purchase.productId;
      if (!acc[productId]) {
        acc[productId] = { sales: 0, revenue: 0 };
      }
      acc[productId].sales += 1;
      acc[productId].revenue += purchase.purchaseAmount;
      return acc;
    }, {} as Record<string, { sales: number; revenue: number }>);

    const topProducts = Object.entries(productStats)
      .map(([productId, stats]) => ({ productId, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalSales,
      totalRevenue,
      totalCommissions,
      totalSystemFund,
      topProducts,
    };
  }

  // Admin create product
  async adminCreateProduct(productData: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    features: string[];
    inStock?: boolean;
  }): Promise<{ success: boolean; product?: Product; message: string }> {
    try {
      await this.db.read();

      const newProduct: Product = {
        id: generateId(),
        name: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice,
        image: productData.image,
        category: productData.category,
        features: productData.features,
        inStock: productData.inStock !== undefined ? productData.inStock : true,
        rating: 4.5, // Default rating
        reviews: 0, // Start with 0 reviews
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.db.data.products.push(newProduct);
      await this.db.write();

      return {
        success: true,
        product: newProduct,
        message: "Ürün başarıyla oluşturuldu.",
      };
    } catch (error) {
      console.error("Error creating product:", error);
      return {
        success: false,
        message: "Ürün oluşturulurken hata oluştu.",
      };
    }
  }

  // Admin update product
  async adminUpdateProduct(
    productId: string,
    updates: Partial<Product>
  ): Promise<{ success: boolean; product?: Product; message: string }> {
    try {
      await this.db.read();
      const productIndex = this.db.data.products.findIndex(
        (product: Product) => product.id === productId
      );

      if (productIndex === -1) {
        return {
          success: false,
          message: "Ürün bulunamadı.",
        };
      }

      this.db.data.products[productIndex] = {
        ...this.db.data.products[productIndex],
        ...updates,
        updatedAt: new Date(),
      };

      await this.db.write();

      return {
        success: true,
        product: this.db.data.products[productIndex],
        message: "Ürün başarıyla güncellendi.",
      };
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        message: "Ürün güncellenirken hata oluştu.",
      };
    }
  }

  // Admin delete product
  async adminDeleteProduct(productId: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.db.read();
      const productIndex = this.db.data.products.findIndex(
        (product: Product) => product.id === productId
      );

      if (productIndex === -1) {
        return {
          success: false,
          message: "Ürün bulunamadı.",
        };
      }

      // Soft delete by setting isActive to false
      this.db.data.products[productIndex].isActive = false;
      this.db.data.products[productIndex].updatedAt = new Date();

      await this.db.write();

      return {
        success: true,
        message: "Ürün başarıyla silindi.",
      };
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        message: "Ürün silinirken hata oluştu.",
      };
    }
  }

  // Get all products for admin (including inactive)
  async adminGetAllProducts(): Promise<Product[]> {
    await this.db.read();
    return this.db.data.products || [];
  }

  // Get user product purchases (enhanced version)
  async getUserProductPurchases(userId: string): Promise<ProductPurchase[]> {
    try {
      await this.db.read();

      if (!this.db.data.productPurchases) {
        this.db.data.productPurchases = [];
      }

      return this.db.data.productPurchases.filter(
        (purchase: ProductPurchase) => purchase.buyerId === userId || purchase.userId === userId
      ).sort((a, b) => new Date(b.purchaseDate || b.createdAt).getTime() - new Date(a.purchaseDate || a.createdAt).getTime());
    } catch (error) {
      console.error("Error getting user product purchases:", error);
      return [];
    }
  }



  // Distribute product commissions
  async distributeProductCommissions(purchase: ProductPurchase): Promise<void> {
    try {
      if (purchase.commissionsDistributed) {
        return; // Already distributed
      }

      const commissionAmount = purchase.amount * 0.4; // 40% commission
      const sponsorAmount = commissionAmount * 0.25; // 10% of total (25% of commission)
      const careerAmount = commissionAmount * 0.625; // 25% of total (62.5% of commission)
      const passiveAmount = commissionAmount * 0.125; // 5% of total (12.5% of commission)

      // Distribute sponsor commission
      if (purchase.sponsorId) {
        const sponsor = await this.getUserById(purchase.sponsorId);
        if (sponsor) {
          await this.updateUserWallet(sponsor.id, sponsorAmount, "commission");

          // Create commission record
          await this.createProductCommission({
            purchaseId: purchase.id,
            userId: sponsor.id,
            amount: sponsorAmount,
            type: "sponsor",
            level: 1
          });
        }
      }

      // Distribute career and passive commissions through network
      await this.distributeNetworkCommissions(purchase.userId, careerAmount + passiveAmount, purchase.id);

      // Mark as distributed
      const purchaseIndex = this.db.data.productPurchases.findIndex(p => p.id === purchase.id);
      if (purchaseIndex !== -1) {
        this.db.data.productPurchases[purchaseIndex].commissionsDistributed = true;
      }

      await this.db.write();
    } catch (error) {
      console.error("Error distributing product commissions:", error);
    }
  }

  // Create product commission record
  async createProductCommission(commissionData: {
    purchaseId: string;
    userId: string;
    amount: number;
    type: string;
    level: number;
  }): Promise<void> {
    try {
      await this.db.read();

      if (!this.db.data.productCommissions) {
        this.db.data.productCommissions = [];
      }

      const commission: ProductCommission = {
        id: generateId(),
        purchaseId: commissionData.purchaseId,
        userId: commissionData.userId,
        amount: commissionData.amount,
        type: commissionData.type,
        level: commissionData.level,
        createdAt: new Date()
      };

      this.db.data.productCommissions.push(commission);
      await this.db.write();
    } catch (error) {
      console.error("Error creating product commission:", error);
    }
  }

  // ===== ENHANCED ADMIN USER MANAGEMENT FUNCTIONS =====

  // Comprehensive user creation with admin controls
  async adminCreateUser(userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role?: "admin" | "leader" | "member" | "visitor";
    sponsorId?: string;
    careerLevel?: (typeof CAREER_LEVELS)[number];
    isActive?: boolean;
    membershipType?: "entry" | "monthly" | "yearly";
    initialBalance?: number;
    placementPreference?: "left" | "right" | "auto";
  }): Promise<{
    success: boolean;
    user?: User;
    message: string;
    adminLog?: string;
  }> {
    try {
      await this.db.read();

      // Check if email already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          message: "Bu email adresi zaten kullanılıyor.",
          adminLog: `Failed to create user: Email ${userData.email} already exists`,
        };
      }

      // Check system capacity
      const capacity = await this.checkSystemCapacity();
      if (!capacity.canAddUser) {
        return {
          success: false,
          message: capacity.message || "Sistem kapasitesi dolu.",
          adminLog: "Failed to create user: System at capacity",
        };
      }

      // Generate secure user data
      const memberId = await this.generateMemberId();
      const hashedPassword = await hashPasswordBcrypt(userData.password);
      const referralCode = this.generateReferralCode(userData.fullName);

      // Resolve sponsor
      let sponsorId = userData.sponsorId;
      if (!sponsorId) {
        // Default to admin as sponsor
        const admin = await this.getUserByEmail(
          "psikologabdulkadirkan@gmail.com",
        );
        sponsorId = admin?.id;
      }

      const newUser: User = {
        id: generateSecureId(),
        memberId,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword, // Store bcrypt hash
        role: userData.role || "member",
        referralCode,
        sponsorId,
        membershipType: userData.membershipType || "entry",
        membershipStartDate: new Date(),
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        careerLevel: userData.careerLevel || CAREER_LEVELS[0],
        totalInvestment: 0,
        directReferrals: 0,
        totalTeamSize: 0,
        wallet: {
          balance: userData.initialBalance || 0,
          totalEarnings: 0,
          sponsorBonus: 0,
          careerBonus: 0,
          passiveIncome: 0,
          leadershipBonus: 0,
        },
        kycStatus: "pending",
        registrationDate: new Date(),
        lastLoginDate: new Date(),
        lastActivityDate: new Date(),
        monthlyActivityStatus: "active",
        yearlyRenewalDate: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()),
        daysSinceLastActivity: 0,
        monthlyActivityStreak: 1,
        nextRenewalWarning: new Date(new Date().getFullYear() + 1, new Date().getMonth() - 1, new Date().getDate()),
      };

      // Add user to database
      this.db.data.users.push(newUser);
      await this.db.write();

      // Handle binary placement if sponsor exists
      if (sponsorId && userData.placementPreference !== "auto") {
        await this.adminPlaceUserInBinary(
          newUser.id,
          sponsorId,
          userData.placementPreference,
        );
      } else if (sponsorId) {
        await this.placeBinaryUser(newUser.id, sponsorId);
      }

      // Create clone page
      await this.createClonePage(newUser.id, userData.fullName, memberId);

      // Create audit log
      await this.createAdminLog({
        action: "CREATE_USER",
        targetUserId: newUser.id,
        details: `Created user: ${userData.fullName} (${userData.email}) with member ID: ${memberId}`,
        adminId: "system",
      });

      return {
        success: true,
        user: sanitizeUserData(newUser),
        message: `Kullanıcı başarıyla oluşturuldu. Üye ID: ${memberId}`,
        adminLog: `Successfully created user: ${userData.fullName} (${memberId})`,
      };
    } catch (error) {
      console.error("Error in adminCreateUser:", error);
      return {
        success: false,
        message: "Kullanıcı oluşturulurken hata oluştu.",
        adminLog: `Error creating user: ${error.message}`,
      };
    }
  }

  // Admin manual binary tree placement
  async adminPlaceUserInBinary(
    userId: string,
    parentId: string,
    position: "left" | "right",
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await this.db.read();

      const user = await this.getUserById(userId);
      const parent = await this.getUserById(parentId);

      if (!user || !parent) {
        return {
          success: false,
          message: "Kullanıcı veya üst sponsor bulunamadı.",
        };
      }

      // Check if position is already occupied
      const targetField = position === "left" ? "leftChild" : "rightChild";
      if (parent[targetField]) {
        return {
          success: false,
          message: `${position === "left" ? "Sol" : "Sağ"} pozisyon zaten dolu.`,
        };
      }

      // Update parent's binary tree
      const updates: Partial<User> = {};
      updates[targetField] = userId;
      await this.updateUser(parentId, updates);

      // Update user's sponsor
      await this.updateUser(userId, { sponsorId: parentId });

      // Clear cache as tree structure changed
      this.clearTeamSizeCache();

      // Create audit log
      await this.createAdminLog({
        action: "MANUAL_PLACEMENT",
        targetUserId: userId,
        details: `Manually placed ${user.fullName} under ${parent.fullName} on ${position} side`,
        adminId: "system",
      });

      return {
        success: true,
        message: `${user.fullName} başarıyla ${parent.fullName} altına ${position === "left" ? "sol" : "sağ"} tarafa yerleştirildi.`,
      };
    } catch (error) {
      console.error("Error in adminPlaceUserInBinary:", error);
      return {
        success: false,
        message: "Yerleştirme sırasında hata oluştu.",
      };
    }
  }

  // Admin move user to different position
  async adminMoveUser(
    userId: string,
    newParentId: string,
    newPosition: "left" | "right",
  ): Promise<{
    success: boolean;
    message: string;
    adminLog?: string;
  }> {
    try {
      await this.db.read();

      const user = await this.getUserById(userId);
      const newParent = await this.getUserById(newParentId);

      if (!user || !newParent) {
        return {
          success: false,
          message: "Kullanıcı veya yeni üst sponsor bulunamadı.",
        };
      }

      // Check if new position is available
      const targetField = newPosition === "left" ? "leftChild" : "rightChild";
      if (newParent[targetField]) {
        return {
          success: false,
          message: "Hedef pozisyon zaten dolu.",
        };
      }

      // Remove user from current position
      if (user.sponsorId) {
        const currentParent = await this.getUserById(user.sponsorId);
        if (currentParent) {
          const updates: Partial<User> = {};
          if (currentParent.leftChild === userId) {
            updates.leftChild = undefined;
          } else if (currentParent.rightChild === userId) {
            updates.rightChild = undefined;
          }
          await this.updateUser(currentParent.id, updates);
        }
      }

      // Place user in new position
      const parentUpdates: Partial<User> = {};
      parentUpdates[targetField] = userId;
      await this.updateUser(newParentId, parentUpdates);

      // Update user's sponsor
      await this.updateUser(userId, { sponsorId: newParentId });

      // Clear caches
      this.clearTeamSizeCache();
      this.teamVolumeCache.clear();

      const adminLog = `Moved ${user.fullName} from ${user.sponsorId} to ${newParent.fullName} (${newPosition} side)`;

      // Create audit log
      await this.createAdminLog({
        action: "MOVE_USER",
        targetUserId: userId,
        details: adminLog,
        adminId: "system",
      });

      return {
        success: true,
        message: `${user.fullName} başarıyla taşındı.`,
        adminLog,
      };
    } catch (error) {
      console.error("Error in adminMoveUser:", error);
      return {
        success: false,
        message: "Kullanıcı taşıma sırasında hata oluştu.",
        adminLog: `Error moving user: ${error.message}`,
      };
    }
  }

  // Admin update user with comprehensive controls
  async adminUpdateUser(
    userId: string,
    updates: {
      fullName?: string;
      email?: string;
      phone?: string;
      role?: "admin" | "leader" | "member" | "visitor";
      isActive?: boolean;
      careerLevel?: (typeof CAREER_LEVELS)[number];
      walletBalance?: number;
      kycStatus?: "pending" | "approved" | "rejected";
      membershipType?: "entry" | "monthly" | "yearly";
      twoFactorEnabled?: boolean;
    },
    adminId: string,
  ): Promise<{
    success: boolean;
    message: string;
    user?: User;
    adminLog?: string;
  }> {
    try {
      await this.db.read();

      const user = await this.getUserById(userId);
      if (!user) {
        return {
          success: false,
          message: "Kullanıcı bulunamadı.",
        };
      }

      // Check for email uniqueness if email is being updated
      if (updates.email && updates.email !== user.email) {
        const existingUser = await this.getUserByEmail(updates.email);
        if (existingUser) {
          return {
            success: false,
            message: "Bu email adresi zaten kullanılıyor.",
          };
        }
      }

      // Prepare updates object
      const userUpdates: Partial<User> = {};
      let changeLog: string[] = [];

      if (updates.fullName && updates.fullName !== user.fullName) {
        userUpdates.fullName = updates.fullName;
        changeLog.push(`Name: ${user.fullName} → ${updates.fullName}`);
      }

      if (updates.email && updates.email !== user.email) {
        userUpdates.email = updates.email;
        changeLog.push(`Email: ${user.email} → ${updates.email}`);
      }

      if (updates.phone && updates.phone !== user.phone) {
        userUpdates.phone = updates.phone;
        changeLog.push(`Phone: ${user.phone} → ${updates.phone}`);
      }

      if (updates.role && updates.role !== user.role) {
        userUpdates.role = updates.role;
        changeLog.push(`Role: ${user.role} → ${updates.role}`);
      }

      if (
        updates.isActive !== undefined &&
        updates.isActive !== user.isActive
      ) {
        userUpdates.isActive = updates.isActive;
        changeLog.push(`Active: ${user.isActive} → ${updates.isActive}`);
      }

      if (updates.careerLevel && updates.careerLevel !== user.careerLevel) {
        userUpdates.careerLevel = updates.careerLevel;
        changeLog.push(
          `Career: ${user.careerLevel.name} → ${updates.careerLevel.name}`,
        );
      }

      if (
        updates.walletBalance !== undefined &&
        updates.walletBalance !== user.wallet.balance
      ) {
        userUpdates.wallet = {
          ...user.wallet,
          balance: updates.walletBalance,
        };
        changeLog.push(
          `Wallet: ${user.wallet.balance} → ${updates.walletBalance}`,
        );
      }

      if (updates.kycStatus && updates.kycStatus !== user.kycStatus) {
        userUpdates.kycStatus = updates.kycStatus;
        changeLog.push(`KYC: ${user.kycStatus} → ${updates.kycStatus}`);
      }

      if (
        updates.membershipType &&
        updates.membershipType !== user.membershipType
      ) {
        userUpdates.membershipType = updates.membershipType;
        changeLog.push(
          `Membership: ${user.membershipType} → ${updates.membershipType}`,
        );
      }

      if (
        updates.twoFactorEnabled !== undefined &&
        updates.twoFactorEnabled !== user.twoFactorEnabled
      ) {
        userUpdates.twoFactorEnabled = updates.twoFactorEnabled;
        changeLog.push(
          `2FA: ${user.twoFactorEnabled} → ${updates.twoFactorEnabled}`,
        );
      }

      if (Object.keys(userUpdates).length === 0) {
        return {
          success: false,
          message: "Güncellenecek alan bulunamadı.",
        };
      }

      // Apply updates
      const updatedUser = await this.updateUser(userId, userUpdates);
      if (!updatedUser) {
        return {
          success: false,
          message: "Kullanıcı güncellenemedi.",
        };
      }

      const adminLog = `Updated user ${user.fullName} (${user.memberId}): ${changeLog.join(", ")}`;

      // Create audit log
      await this.createAdminLog({
        action: "UPDATE_USER",
        targetUserId: userId,
        details: adminLog,
        adminId,
      });

      return {
        success: true,
        message: "Kullanıcı başarıyla güncellendi.",
        user: sanitizeUserData(updatedUser),
        adminLog,
      };
    } catch (error) {
      console.error("Error in adminUpdateUser:", error);
      return {
        success: false,
        message: "Kullanıcı güncellenirken hata oluştu.",
        adminLog: `Error updating user: ${error.message}`,
      };
    }
  }

  // Admin delete user with proper cleanup
  async adminDeleteUser(
    userId: string,
    adminId: string,
    transferChildrenTo?: string,
  ): Promise<{
    success: boolean;
    message: string;
    adminLog?: string;
  }> {
    try {
      await this.db.read();

      const user = await this.getUserById(userId);
      if (!user) {
        return {
          success: false,
          message: "Kullanıcı bulunamadı.",
        };
      }

      // Prevent deletion of admin user
      if (user.role === "admin") {
        return {
          success: false,
          message: "Admin kullanıcısı silinemez.",
        };
      }

      // Get user's children
      const directChildren = await this.getDirectReferrals(userId);

      // Handle children placement
      if (directChildren.length > 0) {
        if (transferChildrenTo) {
          const newParent = await this.getUserById(transferChildrenTo);
          if (!newParent) {
            return {
              success: false,
              message: "Transfer hedefi bulunamadı.",
            };
          }

          // Transfer children to new parent
          for (const child of directChildren) {
            await this.adminMoveUser(
              child.id,
              transferChildrenTo,
              "auto" as any,
            );
          }
        } else {
          // Move children to user's parent or admin
          const transferTarget = user.sponsorId || "admin-001";
          for (const child of directChildren) {
            await this.adminMoveUser(child.id, transferTarget, "auto" as any);
          }
        }
      }

      // Remove from parent's binary tree
      if (user.sponsorId) {
        const parent = await this.getUserById(user.sponsorId);
        if (parent) {
          const updates: Partial<User> = {};
          if (parent.leftChild === userId) {
            updates.leftChild = undefined;
          } else if (parent.rightChild === userId) {
            updates.rightChild = undefined;
          }
          await this.updateUser(parent.id, updates);
        }
      }

      // Delete clone page
      const clonePageIndex = this.db.data.clonePages.findIndex(
        (page) => page.userId === userId,
      );
      if (clonePageIndex > -1) {
        this.db.data.clonePages.splice(clonePageIndex, 1);
      }

      // Delete user
      const userIndex = this.db.data.users.findIndex((u) => u.id === userId);
      if (userIndex > -1) {
        this.db.data.users.splice(userIndex, 1);
      }

      await this.db.write();

      // Clear caches
      this.clearTeamSizeCache();
      this.teamVolumeCache.clear();

      const adminLog = `Deleted user ${user.fullName} (${user.memberId}). Children: ${directChildren.length} transferred.`;

      // Create audit log
      await this.createAdminLog({
        action: "DELETE_USER",
        targetUserId: userId,
        details: adminLog,
        adminId,
      });

      return {
        success: true,
        message: `Kullanıcı ${user.fullName} başarıyla silindi.`,
        adminLog,
      };
    } catch (error) {
      console.error("Error in adminDeleteUser:", error);
      return {
        success: false,
        message: "Kullanıcı silinirken hata oluştu.",
        adminLog: `Error deleting user: ${error.message}`,
      };
    }
  }

  // Generate referral code from full name
  private generateReferralCode(fullName: string): string {
    const initials = fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    const randomNum = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    return `${initials}${randomNum}`;
  }

  // Advanced user search and filtering
  async adminSearchUsers(
    criteria: {
      search?: string; // Search in name, email, memberId
      role?: string;
      isActive?: boolean;
      careerLevel?: string;
      kycStatus?: string;
      membershipType?: string;
      registeredAfter?: Date;
      registeredBefore?: Date;
      minBalance?: number;
      maxBalance?: number;
      hasChildren?: boolean;
      limit?: number;
      offset?: number;
      sortBy?: "name" | "email" | "registrationDate" | "balance" | "memberId";
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<{
    users: User[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      await this.db.read();
      let users = [...this.db.data.users];

      // Apply filters
      if (criteria.search) {
        const searchLower = criteria.search.toLowerCase();
        users = users.filter(
          (user) =>
            user.fullName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.memberId.toLowerCase().includes(searchLower),
        );
      }

      if (criteria.role) {
        users = users.filter((user) => user.role === criteria.role);
      }

      if (criteria.isActive !== undefined) {
        users = users.filter((user) => user.isActive === criteria.isActive);
      }

      if (criteria.careerLevel) {
        users = users.filter(
          (user) => user.careerLevel.name === criteria.careerLevel,
        );
      }

      if (criteria.kycStatus) {
        users = users.filter((user) => user.kycStatus === criteria.kycStatus);
      }

      if (criteria.membershipType) {
        users = users.filter(
          (user) => user.membershipType === criteria.membershipType,
        );
      }

      if (criteria.registeredAfter) {
        users = users.filter(
          (user) =>
            new Date(user.registrationDate) >= criteria.registeredAfter!,
        );
      }

      if (criteria.registeredBefore) {
        users = users.filter(
          (user) =>
            new Date(user.registrationDate) <= criteria.registeredBefore!,
        );
      }

      if (criteria.minBalance !== undefined) {
        users = users.filter(
          (user) => user.wallet.balance >= criteria.minBalance!,
        );
      }

      if (criteria.maxBalance !== undefined) {
        users = users.filter(
          (user) => user.wallet.balance <= criteria.maxBalance!,
        );
      }

      if (criteria.hasChildren !== undefined) {
        users = users.filter((user) => {
          const hasChildren = user.leftChild || user.rightChild;
          return criteria.hasChildren ? !!hasChildren : !hasChildren;
        });
      }

      const total = users.length;

      // Apply sorting
      if (criteria.sortBy) {
        users.sort((a, b) => {
          let aVal, bVal;

          switch (criteria.sortBy) {
            case "name":
              aVal = a.fullName.toLowerCase();
              bVal = b.fullName.toLowerCase();
              break;
            case "email":
              aVal = a.email.toLowerCase();
              bVal = b.email.toLowerCase();
              break;
            case "registrationDate":
              aVal = new Date(a.registrationDate).getTime();
              bVal = new Date(b.registrationDate).getTime();
              break;
            case "balance":
              aVal = a.wallet.balance;
              bVal = b.wallet.balance;
              break;
            case "memberId":
              aVal = a.memberId;
              bVal = b.memberId;
              break;
            default:
              return 0;
          }

          if (aVal < bVal) return criteria.sortOrder === "desc" ? 1 : -1;
          if (aVal > bVal) return criteria.sortOrder === "desc" ? -1 : 1;
          return 0;
        });
      }

      // Apply pagination
      const offset = criteria.offset || 0;
      const limit = criteria.limit || 50;
      const paginatedUsers = users.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      return {
        users: paginatedUsers.map((user) => sanitizeUserData(user)),
        total,
        hasMore,
      };
    } catch (error) {
      console.error("Error in adminSearchUsers:", error);
      return {
        users: [],
        total: 0,
        hasMore: false,
      };
    }
  }

  // Admin audit log system
  async createAdminLog(logEntry: {
    action: string;
    targetUserId?: string;
    details: string;
    adminId: string;
    metadata?: any;
  }): Promise<void> {
    try {
      await this.db.read();

      if (!this.db.data.adminLogs) {
        this.db.data.adminLogs = [];
      }

      const log = {
        id: generateSecureId(),
        ...logEntry,
        timestamp: new Date(),
        ipAddress: "system", // Would be actual IP in production
      };

      this.db.data.adminLogs.push(log);

      // Keep only last 10000 logs to prevent excessive storage
      if (this.db.data.adminLogs.length > 10000) {
        this.db.data.adminLogs = this.db.data.adminLogs.slice(-10000);
      }

      await this.db.write();
    } catch (error) {
      console.error("Error creating admin log:", error);
    }
  }

  // Get admin logs with filtering
  async getAdminLogs(
    criteria: {
      adminId?: string;
      action?: string;
      targetUserId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{
    logs: any[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      await this.db.read();

      if (!this.db.data.adminLogs) {
        return { logs: [], total: 0, hasMore: false };
      }

      let logs = [...this.db.data.adminLogs];

      // Apply filters
      if (criteria.adminId) {
        logs = logs.filter((log) => log.adminId === criteria.adminId);
      }

      if (criteria.action) {
        logs = logs.filter((log) => log.action === criteria.action);
      }

      if (criteria.targetUserId) {
        logs = logs.filter((log) => log.targetUserId === criteria.targetUserId);
      }

      if (criteria.startDate) {
        logs = logs.filter(
          (log) => new Date(log.timestamp) >= criteria.startDate!,
        );
      }

      if (criteria.endDate) {
        logs = logs.filter(
          (log) => new Date(log.timestamp) <= criteria.endDate!,
        );
      }

      // Sort by timestamp (newest first)
      logs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      const total = logs.length;

      // Apply pagination
      const offset = criteria.offset || 0;
      const limit = criteria.limit || 100;
      const paginatedLogs = logs.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      return {
        logs: paginatedLogs,
        total,
        hasMore,
      };
    } catch (error) {
      console.error("Error getting admin logs:", error);
      return { logs: [], total: 0, hasMore: false };
    }
  }

  // ===== ENHANCED MEMBER TRACKING SYSTEM =====

  // Create member activity log
  async createMemberLog(logEntry: {
    memberId: string;
    userId: string;
    action: string;
    details: string;
    ipAddress?: string;
    userAgent?: string;
    location?: {
      country?: string;
      region?: string;
      city?: string;
    };
    sessionId?: string;
    metadata?: any;
  }): Promise<void> {
    try {
      await this.db.read();

      if (!this.db.data.memberLogs) {
        this.db.data.memberLogs = [];
      }

      const log = {
        id: generateSecureId(),
        ...logEntry,
        timestamp: new Date(),
      };

      this.db.data.memberLogs.push(log);

      // Keep only last 50000 member logs to prevent excessive storage
      if (this.db.data.memberLogs.length > 50000) {
        this.db.data.memberLogs = this.db.data.memberLogs.slice(-50000);
      }

      await this.db.write();
    } catch (error) {
      console.error("Error creating member log:", error);
    }
  }

  // Create member activity tracking
  async createMemberActivity(activity: {
    memberId: string;
    userId: string;
    activityType: string;
    description: string;
    data?: any;
    duration?: number;
    device?: {
      type: string;
      os: string;
      browser: string;
    };
  }): Promise<void> {
    try {
      await this.db.read();

      if (!this.db.data.memberActivities) {
        this.db.data.memberActivities = [];
      }

      const activityLog = {
        id: generateSecureId(),
        ...activity,
        timestamp: new Date(),
      };

      this.db.data.memberActivities.push(activityLog);

      // Keep only last 100000 activities
      if (this.db.data.memberActivities.length > 100000) {
        this.db.data.memberActivities =
          this.db.data.memberActivities.slice(-100000);
      }

      await this.db.write();
    } catch (error) {
      console.error("Error creating member activity:", error);
    }
  }

  // Create member session
  async createMemberSession(session: {
    memberId: string;
    userId: string;
    sessionToken: string;
    ipAddress: string;
    userAgent: string;
  }): Promise<string> {
    try {
      await this.db.read();

      if (!this.db.data.memberSessions) {
        this.db.data.memberSessions = [];
      }

      const sessionId = generateSecureId();
      const sessionData = {
        id: sessionId,
        ...session,
        loginTime: new Date(),
        isActive: true,
        lastActivity: new Date(),
      };

      this.db.data.memberSessions.push(sessionData);

      // Clean old sessions (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      this.db.data.memberSessions = this.db.data.memberSessions.filter(
        (session) => new Date(session.loginTime) > thirtyDaysAgo,
      );

      await this.db.write();

      // Log the session creation
      await this.createMemberLog({
        memberId: session.memberId,
        userId: session.userId,
        action: "SESSION_START",
        details: `New session started from ${session.ipAddress}`,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        sessionId,
      });

      return sessionId;
    } catch (error) {
      console.error("Error creating member session:", error);
      throw error;
    }
  }

  // Update member session activity
  async updateMemberSessionActivity(sessionId: string): Promise<void> {
    try {
      await this.db.read();

      if (!this.db.data.memberSessions) {
        return;
      }

      const sessionIndex = this.db.data.memberSessions.findIndex(
        (session) => session.id === sessionId,
      );

      if (sessionIndex !== -1) {
        this.db.data.memberSessions[sessionIndex].lastActivity = new Date();
        await this.db.write();
      }
    } catch (error) {
      console.error("Error updating session activity:", error);
    }
  }

  // End member session
  async endMemberSession(sessionId: string): Promise<void> {
    try {
      await this.db.read();

      if (!this.db.data.memberSessions) {
        return;
      }

      const sessionIndex = this.db.data.memberSessions.findIndex(
        (session) => session.id === sessionId,
      );

      if (sessionIndex !== -1) {
        const session = this.db.data.memberSessions[sessionIndex];
        session.logoutTime = new Date();
        session.isActive = false;

        await this.db.write();

        // Log the session end
        await this.createMemberLog({
          memberId: session.memberId,
          userId: session.userId,
          action: "SESSION_END",
          details: `Session ended after ${Math.round((new Date().getTime() - new Date(session.loginTime).getTime()) / 1000 / 60)} minutes`,
          ipAddress: session.ipAddress,
          sessionId,
        });
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  }

  // Get member logs with filtering
  async getMemberLogs(
    criteria: {
      memberId?: string;
      userId?: string;
      action?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{
    logs: any[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      await this.db.read();

      if (!this.db.data.memberLogs) {
        return { logs: [], total: 0, hasMore: false };
      }

      let logs = [...this.db.data.memberLogs];

      // Apply filters
      if (criteria.memberId) {
        logs = logs.filter((log) => log.memberId === criteria.memberId);
      }

      if (criteria.userId) {
        logs = logs.filter((log) => log.userId === criteria.userId);
      }

      if (criteria.action) {
        logs = logs.filter((log) => log.action === criteria.action);
      }

      if (criteria.startDate) {
        logs = logs.filter(
          (log) => new Date(log.timestamp) >= criteria.startDate!,
        );
      }

      if (criteria.endDate) {
        logs = logs.filter(
          (log) => new Date(log.timestamp) <= criteria.endDate!,
        );
      }

      // Sort by timestamp (newest first)
      logs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      const total = logs.length;

      // Apply pagination
      const offset = criteria.offset || 0;
      const limit = criteria.limit || 50;
      const paginatedLogs = logs.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      return {
        logs: paginatedLogs,
        total,
        hasMore,
      };
    } catch (error) {
      console.error("Error getting member logs:", error);
      return { logs: [], total: 0, hasMore: false };
    }
  }

  // Get member activities
  async getMemberActivities(
    criteria: {
      memberId?: string;
      userId?: string;
      activityType?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{
    activities: any[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      await this.db.read();

      if (!this.db.data.memberActivities) {
        return { activities: [], total: 0, hasMore: false };
      }

      let activities = [...this.db.data.memberActivities];

      // Apply filters
      if (criteria.memberId) {
        activities = activities.filter(
          (activity) => activity.memberId === criteria.memberId,
        );
      }

      if (criteria.userId) {
        activities = activities.filter(
          (activity) => activity.userId === criteria.userId,
        );
      }

      if (criteria.activityType) {
        activities = activities.filter(
          (activity) => activity.activityType === criteria.activityType,
        );
      }

      if (criteria.startDate) {
        activities = activities.filter(
          (activity) => new Date(activity.timestamp) >= criteria.startDate!,
        );
      }

      if (criteria.endDate) {
        activities = activities.filter(
          (activity) => new Date(activity.timestamp) <= criteria.endDate!,
        );
      }

      // Sort by timestamp (newest first)
      activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      const total = activities.length;

      // Apply pagination
      const offset = criteria.offset || 0;
      const limit = criteria.limit || 50;
      const paginatedActivities = activities.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      return {
        activities: paginatedActivities,
        total,
        hasMore,
      };
    } catch (error) {
      console.error("Error getting member activities:", error);
      return { activities: [], total: 0, hasMore: false };
    }
  }

  // Get member sessions
  async getMemberSessions(
    criteria: {
      memberId?: string;
      userId?: string;
      isActive?: boolean;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{
    sessions: any[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      await this.db.read();

      if (!this.db.data.memberSessions) {
        return { sessions: [], total: 0, hasMore: false };
      }

      let sessions = [...this.db.data.memberSessions];

      // Apply filters
      if (criteria.memberId) {
        sessions = sessions.filter(
          (session) => session.memberId === criteria.memberId,
        );
      }

      if (criteria.userId) {
        sessions = sessions.filter(
          (session) => session.userId === criteria.userId,
        );
      }

      if (criteria.isActive !== undefined) {
        sessions = sessions.filter(
          (session) => session.isActive === criteria.isActive,
        );
      }

      if (criteria.startDate) {
        sessions = sessions.filter(
          (session) => new Date(session.loginTime) >= criteria.startDate!,
        );
      }

      if (criteria.endDate) {
        sessions = sessions.filter(
          (session) => new Date(session.loginTime) <= criteria.endDate!,
        );
      }

      // Sort by login time (newest first)
      sessions.sort(
        (a, b) =>
          new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime(),
      );

      const total = sessions.length;

      // Apply pagination
      const offset = criteria.offset || 0;
      const limit = criteria.limit || 50;
      const paginatedSessions = sessions.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      return {
        sessions: paginatedSessions,
        total,
        hasMore,
      };
    } catch (error) {
      console.error("Error getting member sessions:", error);
      return { sessions: [], total: 0, hasMore: false };
    }
  }

  // Get member tracking statistics
  async getMemberTrackingStats(memberId: string): Promise<{
    totalSessions: number;
    activeSessions: number;
    totalActivities: number;
    averageSessionDuration: number; // in minutes
    lastActivity: Date | null;
    loginFrequency: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    topActivities: Array<{
      type: string;
      count: number;
    }>;
    deviceStats: Array<{
      type: string;
      count: number;
    }>;
  }> {
    try {
      await this.db.read();

      const sessions =
        this.db.data.memberSessions?.filter((s) => s.memberId === memberId) ||
        [];
      const activities =
        this.db.data.memberActivities?.filter((a) => a.memberId === memberId) ||
        [];

      // Calculate session statistics
      const totalSessions = sessions.length;
      const activeSessions = sessions.filter((s) => s.isActive).length;

      // Calculate average session duration
      const completedSessions = sessions.filter((s) => s.logoutTime);
      let averageSessionDuration = 0;
      if (completedSessions.length > 0) {
        const totalDuration = completedSessions.reduce((sum, session) => {
          const duration =
            new Date(session.logoutTime!).getTime() -
            new Date(session.loginTime).getTime();
          return sum + duration;
        }, 0);
        averageSessionDuration =
          totalDuration / completedSessions.length / 1000 / 60; // Convert to minutes
      }

      // Get last activity
      const lastActivity =
        activities.length > 0
          ? new Date(
              Math.max(
                ...activities.map((a) => new Date(a.timestamp).getTime()),
              ),
            )
          : null;

      // Calculate login frequency
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const loginFrequency = {
        daily: sessions.filter((s) => new Date(s.loginTime) >= dayAgo).length,
        weekly: sessions.filter((s) => new Date(s.loginTime) >= weekAgo).length,
        monthly: sessions.filter((s) => new Date(s.loginTime) >= monthAgo)
          .length,
      };

      // Calculate top activities
      const activityCounts = activities.reduce(
        (counts, activity) => {
          counts[activity.activityType] =
            (counts[activity.activityType] || 0) + 1;
          return counts;
        },
        {} as Record<string, number>,
      );

      const topActivities = Object.entries(activityCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate device statistics
      const deviceCounts = sessions.reduce(
        (counts, session) => {
          const deviceType = session.userAgent?.includes("Mobile")
            ? "mobile"
            : "desktop";
          counts[deviceType] = (counts[deviceType] || 0) + 1;
          return counts;
        },
        {} as Record<string, number>,
      );

      const deviceStats = Object.entries(deviceCounts).map(([type, count]) => ({
        type,
        count,
      }));

      return {
        totalSessions,
        activeSessions,
        totalActivities: activities.length,
        averageSessionDuration,
        lastActivity,
        loginFrequency,
        topActivities,
        deviceStats,
      };
    } catch (error) {
      console.error("Error getting member tracking stats:", error);
      return {
        totalSessions: 0,
        activeSessions: 0,
        totalActivities: 0,
        averageSessionDuration: 0,
        lastActivity: null,
        loginFrequency: { daily: 0, weekly: 0, monthly: 0 },
        topActivities: [],
        deviceStats: [],
      };
    }
  }

  // ===== REAL-TIME TRANSACTION RECORDING SYSTEM =====

  // Create real-time transaction
  async createRealTimeTransaction(transactionData: {
    userId: string;
    type:
      | "deposit"
      | "withdrawal"
      | "commission"
      | "bonus"
      | "transfer"
      | "purchase"
      | "refund"
      | "penalty";
    subType?: string;
    amount: number;
    currency?: string;
    description: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
    location?: any;
    requireApproval?: boolean;
  }): Promise<{
    success: boolean;
    transaction?: any;
    message: string;
    transactionId?: string;
  }> {
    try {
      await this.db.read();

      if (!this.db.data.realTimeTransactions) {
        this.db.data.realTimeTransactions = [];
      }

      const user = await this.getUserById(transactionData.userId);
      if (!user) {
        return {
          success: false,
          message: "Kullanıcı bulunamadı.",
        };
      }

      // Generate unique transaction ID
      const transactionId = this.generateTransactionId();
      const currency = transactionData.currency || "TRY";

      // Get current balance
      const currentBalance = user.wallet.balance;

      // Calculate risk score
      const riskScore = await this.calculateTransactionRisk(
        transactionData,
        user,
      );

      // Determine if approval is required
      const approvalRequired =
        transactionData.requireApproval ||
        riskScore > 7 ||
        transactionData.amount > 10000 ||
        (transactionData.type === "withdrawal" &&
          transactionData.amount > currentBalance);

      // Create transaction record
      const transaction = {
        id: generateSecureId(),
        transactionId,
        userId: user.id,
        memberId: user.memberId,
        type: transactionData.type,
        subType: transactionData.subType,
        amount: transactionData.amount,
        currency,
        status: approvalRequired
          ? ("pending" as const)
          : ("processing" as const),
        description: transactionData.description,
        metadata: {
          ...transactionData.metadata,
          riskAssessment: {
            score: riskScore,
            factors: await this.getRiskFactors(transactionData, user),
          },
        },
        timestamps: {
          created: new Date(),
        },
        balancesBefore: {
          user: currentBalance,
          system: await this.getSystemBalance(),
        },
        balancesAfter: {
          user: currentBalance, // Will be updated when processed
          system: await this.getSystemBalance(),
        },
        ipAddress: transactionData.ipAddress,
        userAgent: transactionData.userAgent,
        location: transactionData.location,
        riskScore,
        approvalRequired,
        relatedTransactions: [],
      };

      // Add to database
      this.db.data.realTimeTransactions.push(transaction);

      // Create balance snapshot
      await this.createBalanceSnapshot({
        userId: user.id,
        memberId: user.memberId,
        balanceType: "wallet",
        amount: currentBalance,
        currency,
        triggeredBy: transactionId,
        reason: `Transaction created: ${transactionData.type}`,
      });

      // If not requiring approval, process immediately
      if (!approvalRequired) {
        await this.processTransaction(transactionId);
      }

      await this.db.write();

      // Create activity log
      await this.createMemberActivity({
        memberId: user.memberId,
        userId: user.id,
        activityType: "TRANSACTION",
        description: `${transactionData.type} transaction created: ${transactionData.amount} ${currency}`,
        data: {
          transactionId,
          type: transactionData.type,
          amount: transactionData.amount,
          status: transaction.status,
        },
      });

      return {
        success: true,
        transaction,
        message: approvalRequired
          ? "Transaction oluşturuldu ve onay bekliyor."
          : "Transaction oluşturuldu ve işleniyor.",
        transactionId,
      };
    } catch (error) {
      console.error("Error creating real-time transaction:", error);
      return {
        success: false,
        message: "Transaction oluşturulurken hata oluştu.",
      };
    }
  }

  // Process pending transaction
  async processTransaction(transactionId: string): Promise<{
    success: boolean;
    message: string;
    newBalance?: number;
  }> {
    try {
      await this.db.read();

      if (!this.db.data.realTimeTransactions) {
        return { success: false, message: "Transaction sistemi mevcut değil." };
      }

      const transactionIndex = this.db.data.realTimeTransactions.findIndex(
        (t) => t.transactionId === transactionId,
      );

      if (transactionIndex === -1) {
        return { success: false, message: "Transaction bulunamadı." };
      }

      const transaction = this.db.data.realTimeTransactions[transactionIndex];

      if (
        transaction.status !== "pending" &&
        transaction.status !== "processing"
      ) {
        return { success: false, message: "Transaction zaten işlendi." };
      }

      const user = await this.getUserById(transaction.userId);
      if (!user) {
        return { success: false, message: "Kullanıcı bulunamadı." };
      }

      // Update status to processing
      transaction.status = "processing";
      transaction.timestamps.processed = new Date();

      try {
        // Execute the transaction based on type
        const result = await this.executeTransaction(transaction, user);

        if (result.success) {
          transaction.status = "completed";
          transaction.timestamps.completed = new Date();
          transaction.balancesAfter.user = result.newBalance!;
          transaction.balancesAfter.system = await this.getSystemBalance();

          // Create balance snapshot for completion
          await this.createBalanceSnapshot({
            userId: user.id,
            memberId: user.memberId,
            balanceType: "wallet",
            amount: result.newBalance!,
            currency: transaction.currency,
            triggeredBy: transactionId,
            reason: `Transaction completed: ${transaction.type}`,
          });

          // Create completion activity
          await this.createMemberActivity({
            memberId: user.memberId,
            userId: user.id,
            activityType: "TRANSACTION",
            description: `Transaction completed: ${transaction.amount} ${transaction.currency}`,
            data: {
              transactionId,
              type: transaction.type,
              amount: transaction.amount,
              oldBalance: transaction.balancesBefore.user,
              newBalance: result.newBalance,
              status: "completed",
            },
          });

          await this.db.write();

          return {
            success: true,
            message: "Transaction başarıyla tamamlandı.",
            newBalance: result.newBalance,
          };
        } else {
          transaction.status = "failed";
          transaction.timestamps.failed = new Date();
          transaction.notes = result.message;

          await this.db.write();

          return {
            success: false,
            message: result.message || "Transaction başarısız.",
          };
        }
      } catch (error) {
        transaction.status = "failed";
        transaction.timestamps.failed = new Date();
        transaction.notes = `Execution error: ${error.message}`;

        await this.db.write();

        return {
          success: false,
          message: "Transaction çalıştırılırken hata oluştu.",
        };
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      return {
        success: false,
        message: "Transaction işlenirken hata oluştu.",
      };
    }
  }

  // Execute transaction based on type
  private async executeTransaction(
    transaction: any,
    user: User,
  ): Promise<{
    success: boolean;
    newBalance?: number;
    message?: string;
  }> {
    let newBalance = user.wallet.balance;

    switch (transaction.type) {
      case "deposit":
        newBalance += transaction.amount;
        break;

      case "withdrawal":
        if (user.wallet.balance < transaction.amount) {
          return {
            success: false,
            message: "Yetersiz bakiye.",
          };
        }
        newBalance -= transaction.amount;
        break;

      case "commission":
      case "bonus":
        newBalance += transaction.amount;
        // Update specific wallet fields
        if (transaction.type === "commission") {
          user.wallet.totalEarnings += transaction.amount;
          if (transaction.subType === "sponsor") {
            user.wallet.sponsorBonus += transaction.amount;
          } else if (transaction.subType === "career") {
            user.wallet.careerBonus += transaction.amount;
          }
        }
        break;

      case "transfer":
        if (transaction.metadata?.sourceUserId === user.id) {
          // Outgoing transfer
          if (user.wallet.balance < transaction.amount) {
            return {
              success: false,
              message: "Yetersiz bakiye.",
            };
          }
          newBalance -= transaction.amount;
        } else {
          // Incoming transfer
          newBalance += transaction.amount;
        }
        break;

      case "purchase":
        if (user.wallet.balance < transaction.amount) {
          return {
            success: false,
            message: "Yetersiz bakiye.",
          };
        }
        newBalance -= transaction.amount;
        break;

      case "refund":
        newBalance += transaction.amount;
        break;

      case "penalty":
        newBalance -= transaction.amount;
        if (newBalance < 0) {
          newBalance = 0; // Don't allow negative balance
        }
        break;

      default:
        return {
          success: false,
          message: "Geçersiz transaction tipi.",
        };
    }

    // Update user balance
    await this.updateUser(user.id, {
      wallet: {
        ...user.wallet,
        balance: newBalance,
      },
    });

    return {
      success: true,
      newBalance,
    };
  }

  // Calculate transaction risk score
  private async calculateTransactionRisk(
    transactionData: any,
    user: User,
  ): Promise<number> {
    let riskScore = 0;

    // Amount-based risk
    if (transactionData.amount > 50000) riskScore += 3;
    else if (transactionData.amount > 10000) riskScore += 2;
    else if (transactionData.amount > 5000) riskScore += 1;

    // User history risk
    const recentTransactions = await this.getRecentTransactions(user.id, 7); // Last 7 days
    if (recentTransactions.length > 10) riskScore += 2;

    // New user risk
    const daysSinceRegistration = Math.floor(
      (new Date().getTime() - new Date(user.registrationDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (daysSinceRegistration < 7) riskScore += 2;

    // KYC status risk
    if (user.kycStatus !== "approved") riskScore += 3;

    // High frequency risk
    if (
      transactionData.type === "withdrawal" &&
      recentTransactions.filter((t) => t.type === "withdrawal").length > 3
    ) {
      riskScore += 2;
    }

    return Math.min(riskScore, 10); // Cap at 10
  }

  // Get risk factors
  private async getRiskFactors(
    transactionData: any,
    user: User,
  ): Promise<string[]> {
    const factors = [];

    if (transactionData.amount > 10000) factors.push("High amount");
    if (user.kycStatus !== "approved") factors.push("KYC not approved");

    const daysSinceRegistration = Math.floor(
      (new Date().getTime() - new Date(user.registrationDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (daysSinceRegistration < 7) factors.push("New user");

    const recentTransactions = await this.getRecentTransactions(user.id, 7);
    if (recentTransactions.length > 10)
      factors.push("High transaction frequency");

    return factors;
  }

  // Get recent transactions
  private async getRecentTransactions(
    userId: string,
    days: number,
  ): Promise<any[]> {
    try {
      await this.db.read();

      if (!this.db.data.realTimeTransactions) return [];

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return this.db.data.realTimeTransactions.filter(
        (t) =>
          t.userId === userId && new Date(t.timestamps.created) >= cutoffDate,
      );
    } catch (error) {
      console.error("Error getting recent transactions:", error);
      return [];
    }
  }

  // Generate unique transaction ID
  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN-${timestamp}-${random}`.toUpperCase();
  }

  // Get system balance (placeholder - would be calculated from all user balances)
  private async getSystemBalance(): Promise<number> {
    try {
      const users = await this.getAllUsers();
      return users.reduce((total, user) => total + user.wallet.balance, 0);
    } catch (error) {
      return 0;
    }
  }

  // Create balance snapshot
  async createBalanceSnapshot(snapshotData: {
    userId: string;
    memberId: string;
    balanceType: "wallet" | "commission" | "bonus" | "locked" | "pending";
    amount: number;
    currency: string;
    triggeredBy: string;
    reason: string;
  }): Promise<void> {
    try {
      await this.db.read();

      if (!this.db.data.balanceSnapshots) {
        this.db.data.balanceSnapshots = [];
      }

      const snapshot = {
        id: generateSecureId(),
        ...snapshotData,
        timestamp: new Date(),
      };

      this.db.data.balanceSnapshots.push(snapshot);

      // Keep only last 10000 snapshots per user
      const userSnapshots = this.db.data.balanceSnapshots.filter(
        (s) => s.userId === snapshotData.userId,
      );

      if (userSnapshots.length > 10000) {
        // Remove oldest snapshots for this user
        const toRemove = userSnapshots.slice(0, userSnapshots.length - 10000);
        this.db.data.balanceSnapshots = this.db.data.balanceSnapshots.filter(
          (s) => !toRemove.some((r) => r.id === s.id),
        );
      }

      await this.db.write();
    } catch (error) {
      console.error("Error creating balance snapshot:", error);
    }
  }

  // Get real-time transactions with filtering
  async getRealTimeTransactions(
    criteria: {
      userId?: string;
      type?: string;
      status?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{
    transactions: any[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      await this.db.read();

      if (!this.db.data.realTimeTransactions) {
        return { transactions: [], total: 0, hasMore: false };
      }

      let transactions = [...this.db.data.realTimeTransactions];

      // Apply filters
      if (criteria.userId) {
        transactions = transactions.filter((t) => t.userId === criteria.userId);
      }

      if (criteria.type) {
        transactions = transactions.filter((t) => t.type === criteria.type);
      }

      if (criteria.status) {
        transactions = transactions.filter((t) => t.status === criteria.status);
      }

      if (criteria.startDate) {
        transactions = transactions.filter(
          (t) => new Date(t.timestamps.created) >= criteria.startDate!,
        );
      }

      if (criteria.endDate) {
        transactions = transactions.filter(
          (t) => new Date(t.timestamps.created) <= criteria.endDate!,
        );
      }

      // Sort by creation date (newest first)
      transactions.sort(
        (a, b) =>
          new Date(b.timestamps.created).getTime() -
          new Date(a.timestamps.created).getTime(),
      );

      const total = transactions.length;

      // Apply pagination
      const offset = criteria.offset || 0;
      const limit = criteria.limit || 50;
      const paginatedTransactions = transactions.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      return {
        transactions: paginatedTransactions,
        total,
        hasMore,
      };
    } catch (error) {
      console.error("Error getting real-time transactions:", error);
      return { transactions: [], total: 0, hasMore: false };
    }
  }

  // Get transaction statistics
  async getTransactionStats(
    userId?: string,
    days: number = 30,
  ): Promise<{
    totalTransactions: number;
    totalVolume: number;
    byType: Record<string, { count: number; volume: number }>;
    byStatus: Record<string, number>;
    avgAmount: number;
    pendingValue: number;
    riskDistribution: Record<string, number>;
  }> {
    try {
      await this.db.read();

      if (!this.db.data.realTimeTransactions) {
        return {
          totalTransactions: 0,
          totalVolume: 0,
          byType: {},
          byStatus: {},
          avgAmount: 0,
          pendingValue: 0,
          riskDistribution: {},
        };
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      let transactions = this.db.data.realTimeTransactions.filter(
        (t) => new Date(t.timestamps.created) >= cutoffDate,
      );

      if (userId) {
        transactions = transactions.filter((t) => t.userId === userId);
      }

      const totalTransactions = transactions.length;
      const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
      const avgAmount =
        totalTransactions > 0 ? totalVolume / totalTransactions : 0;

      // Group by type
      const byType = transactions.reduce(
        (acc, t) => {
          if (!acc[t.type]) {
            acc[t.type] = { count: 0, volume: 0 };
          }
          acc[t.type].count++;
          acc[t.type].volume += t.amount;
          return acc;
        },
        {} as Record<string, { count: number; volume: number }>,
      );

      // Group by status
      const byStatus = transactions.reduce(
        (acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Calculate pending value
      const pendingValue = transactions
        .filter((t) => t.status === "pending")
        .reduce((sum, t) => sum + t.amount, 0);

      // Risk distribution
      const riskDistribution = transactions.reduce(
        (acc, t) => {
          const riskLevel =
            t.riskScore <= 3 ? "low" : t.riskScore <= 6 ? "medium" : "high";
          acc[riskLevel] = (acc[riskLevel] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        totalTransactions,
        totalVolume,
        byType,
        byStatus,
        avgAmount,
        pendingValue,
        riskDistribution,
      };
    } catch (error) {
      console.error("Error getting transaction stats:", error);
      return {
        totalTransactions: 0,
        totalVolume: 0,
        byType: {},
        byStatus: {},
        avgAmount: 0,
        pendingValue: 0,
        riskDistribution: {},
      };
    }
  }

  // Clone Store Management Methods
  async getUserCloneStoreData(userId: string): Promise<any> {
    try {
      await this.db.read();

      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get user's clone store data from clone pages and products
      const clonePages = this.db.data.clonePages?.filter(page => page.userId === userId) || [];
      const cloneProducts = this.db.data.cloneProducts?.filter(product => product.userId === userId) || [];

      // Get sales/purchase data for this user's clone store
      const productPurchases = this.db.data.productPurchases?.filter(purchase =>
        cloneProducts.some(product => product.id === purchase.productId)
      ) || [];

      // Calculate clone store statistics
      const totalSales = productPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
      const totalProducts = cloneProducts.length;
      const totalOrders = productPurchases.length;

      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          memberId: user.memberId
        },
        clonePages,
        cloneProducts,
        productPurchases,
        statistics: {
          totalSales,
          totalProducts,
          totalOrders,
          averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0
        },
        settings: {
          storeEnabled: user.cloneStoreEnabled ?? true,
          storeName: user.cloneStoreName || `${user.fullName}'s Store`,
          storeDescription: user.cloneStoreDescription || '',
          storeTheme: user.cloneStoreTheme || 'default'
        }
      };
    } catch (error) {
      console.error('Error getting user clone store data:', error);
      throw error;
    }
  }

  async updateUserCloneStore(userId: string, storeData: any): Promise<any> {
    try {
      await this.db.read();

      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update user's clone store settings
      const userUpdates: any = {};
      if (storeData.settings) {
        userUpdates.cloneStoreEnabled = storeData.settings.storeEnabled;
        userUpdates.cloneStoreName = storeData.settings.storeName;
        userUpdates.cloneStoreDescription = storeData.settings.storeDescription;
        userUpdates.cloneStoreTheme = storeData.settings.storeTheme;
      }

      await this.updateUser(userId, userUpdates);

      // Update clone pages if provided
      if (storeData.clonePages) {
        for (const pageData of storeData.clonePages) {
          if (pageData.id) {
            // Update existing page
            const pageIndex = this.db.data.clonePages?.findIndex(p => p.id === pageData.id && p.userId === userId);
            if (pageIndex !== undefined && pageIndex >= 0) {
              this.db.data.clonePages![pageIndex] = { ...this.db.data.clonePages![pageIndex], ...pageData };
            }
          } else {
            // Create new page
            if (!this.db.data.clonePages) this.db.data.clonePages = [];
            this.db.data.clonePages.push({
              ...pageData,
              id: generateSecureId(),
              userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        }
      }

      // Update clone products if provided
      if (storeData.cloneProducts) {
        for (const productData of storeData.cloneProducts) {
          if (productData.id) {
            // Update existing product
            const productIndex = this.db.data.cloneProducts?.findIndex(p => p.id === productData.id && p.userId === userId);
            if (productIndex !== undefined && productIndex >= 0) {
              this.db.data.cloneProducts![productIndex] = { ...this.db.data.cloneProducts![productIndex], ...productData };
            }
          } else {
            // Create new product
            if (!this.db.data.cloneProducts) this.db.data.cloneProducts = [];
            this.db.data.cloneProducts.push({
              ...productData,
              id: generateSecureId(),
              userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        }
      }

      await this.db.write();

      console.log(`✅ Clone store updated for user: ${user.fullName}`);
      console.log(`🔄 Changes applied instantly to user's store`);

      // Return updated clone store data
      return await this.getUserCloneStoreData(userId);
    } catch (error) {
      console.error('Error updating user clone store:', error);
      throw error;
    }
  }

  // Helper methods for role and status updates
  async updateUserRole(userId: string, role: string): Promise<User> {
    const user = await this.updateUser(userId, { role });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUserCareerLevel(userId: string, careerLevel: number): Promise<User> {
    const user = await this.updateUser(userId, { careerLevel });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const user = await this.updateUser(userId, { isActive });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Enhanced delete user method that cleans up clone store data


  // ===========================
  // E-WALLET SYSTEM METHODS
  // ===========================

  // Initialize wallet for new user
  async initializeUserWallet(userId: string): Promise<void> {
    try {
      await this.db.read();

      if (!this.db.data.walletBalances) {
        this.db.data.walletBalances = [];
      }

      const currencies: CurrencyType[] = ['TRY', 'USD', 'EUR', 'BTC'];

      for (const currency of currencies) {
        const existingBalance = this.db.data.walletBalances.find(
          b => b.currency === currency && b.userId === userId
        );

        if (!existingBalance) {
          const newBalance: WalletBalance = {
            userId,
            currency,
            balance: 0,
            frozen: 0,
            available: 0,
            lastUpdated: new Date()
          };
          this.db.data.walletBalances.push(newBalance);
        }
      }

      await this.db.write();
      console.log(`✅ Wallet initialized for user: ${userId}`);
    } catch (error) {
      console.error('Error initializing wallet:', error);
      throw error;
    }
  }

  // Get user wallet balances
  async getUserWalletBalances(userId: string): Promise<WalletBalance[]> {
    try {
      await this.db.read();

      if (!this.db.data.walletBalances) {
        this.db.data.walletBalances = [];
      }

      let balances = this.db.data.walletBalances.filter(b => b.userId === userId);

      // If no balances exist, initialize them
      if (balances.length === 0) {
        await this.initializeUserWallet(userId);
        balances = this.db.data.walletBalances.filter(b => b.userId === userId);
      }

      return balances;
    } catch (error) {
      console.error('Error getting wallet balances:', error);
      return [];
    }
  }

  // Create wallet transaction
  async createWalletTransaction(transactionData: {
    userId: string;
    memberId: string;
    type: WalletTransactionType;
    currency: CurrencyType;
    amount: number;
    description: string;
    paymentMethod?: PaymentMethodType;
    reference?: string;
    transactionHash?: string;
    bankAccount?: any;
    cryptoAddress?: string;
    adminNote?: string;
  }): Promise<WalletTransaction> {
    try {
      await this.db.read();

      if (!this.db.data.walletTransactions) {
        this.db.data.walletTransactions = [];
      }

      const fee = this.calculateTransactionFee(transactionData.type, transactionData.currency, transactionData.amount);
      const netAmount = transactionData.type === 'withdrawal' ?
        transactionData.amount - fee : transactionData.amount;

      const transaction: WalletTransaction = {
        id: generateSecureId(),
        userId: transactionData.userId,
        memberId: transactionData.memberId,
        type: transactionData.type,
        currency: transactionData.currency,
        amount: transactionData.amount,
        fee,
        netAmount,
        status: 'pending',
        description: transactionData.description,
        reference: transactionData.reference,
        transactionHash: transactionData.transactionHash,
        paymentMethod: transactionData.paymentMethod,
        bankAccount: transactionData.bankAccount,
        cryptoAddress: transactionData.cryptoAddress,
        adminNote: transactionData.adminNote,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.db.data.walletTransactions.push(transaction);
      await this.db.write();

      console.log(`💰 Wallet transaction created: ${transaction.id} - ${transaction.type} ${transaction.amount} ${transaction.currency}`);
      return transaction;
    } catch (error) {
      console.error('Error creating wallet transaction:', error);
      throw error;
    }
  }

  // Process deposit request
  async processDepositRequest(transactionId: string, adminId: string, action: 'approve' | 'reject', adminNote?: string): Promise<WalletTransaction> {
    try {
      await this.db.read();

      const transaction = this.db.data.walletTransactions?.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.type !== 'deposit') {
        throw new Error('Not a deposit transaction');
      }

      transaction.adminId = adminId;
      transaction.adminNote = adminNote;
      transaction.processedAt = new Date();
      transaction.updatedAt = new Date();

      if (action === 'approve') {
        transaction.status = 'completed';

        // Update user balance
        await this.updateWalletBalance(transaction.userId, transaction.currency, transaction.amount, 'add');

        console.log(`✅ Deposit approved: ${transaction.amount} ${transaction.currency} for user ${transaction.userId}`);
      } else {
        transaction.status = 'rejected';
        console.log(`❌ Deposit rejected: ${transaction.amount} ${transaction.currency} for user ${transaction.userId}`);
      }

      await this.db.write();
      return transaction;
    } catch (error) {
      console.error('Error processing deposit:', error);
      throw error;
    }
  }

  // Process withdrawal request
  async processWithdrawalRequest(transactionId: string, adminId: string, action: 'approve' | 'reject', adminNote?: string): Promise<WalletTransaction> {
    try {
      await this.db.read();

      const transaction = this.db.data.walletTransactions?.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.type !== 'withdrawal') {
        throw new Error('Not a withdrawal transaction');
      }

      transaction.adminId = adminId;
      transaction.adminNote = adminNote;
      transaction.processedAt = new Date();
      transaction.updatedAt = new Date();

      if (action === 'approve') {
        transaction.status = 'processing';

        // Check if user has sufficient balance
        const balance = await this.getUserWalletBalance(transaction.userId, transaction.currency);
        if (balance.available < transaction.amount) {
          throw new Error('Insufficient balance');
        }

        // Freeze the amount
        await this.updateWalletBalance(transaction.userId, transaction.currency, transaction.amount, 'freeze');

        console.log(`✅ Withdrawal approved and amount frozen: ${transaction.amount} ${transaction.currency} for user ${transaction.userId}`);
      } else {
        transaction.status = 'rejected';
        console.log(`❌ Withdrawal rejected: ${transaction.amount} ${transaction.currency} for user ${transaction.userId}`);
      }

      await this.db.write();
      return transaction;
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      throw error;
    }
  }

  // Complete withdrawal (after actual transfer)
  async completeWithdrawal(transactionId: string, adminId: string): Promise<WalletTransaction> {
    try {
      await this.db.read();

      const transaction = this.db.data.walletTransactions?.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      transaction.status = 'completed';
      transaction.processedAt = new Date();
      transaction.updatedAt = new Date();

      // Remove frozen amount from balance
      await this.updateWalletBalance(transaction.userId, transaction.currency, transaction.amount, 'subtract');

      await this.db.write();
      console.log(`✅ Withdrawal completed: ${transaction.amount} ${transaction.currency} for user ${transaction.userId}`);

      return transaction;
    } catch (error) {
      console.error('Error completing withdrawal:', error);
      throw error;
    }
  }

  // Update wallet balance
  async updateWalletBalance(userId: string, currency: CurrencyType, amount: number, operation: 'add' | 'subtract' | 'freeze' | 'unfreeze'): Promise<void> {
    try {
      await this.db.read();

      if (!this.db.data.walletBalances) {
        this.db.data.walletBalances = [];
      }

      let balance = this.db.data.walletBalances.find(b => b.userId === userId && b.currency === currency);

      if (!balance) {
        // Initialize balance if doesn't exist
        balance = {
          userId,
          currency,
          balance: 0,
          frozen: 0,
          available: 0,
          lastUpdated: new Date()
        };
        this.db.data.walletBalances.push(balance);
      }

      switch (operation) {
        case 'add':
          balance.balance += amount;
          balance.available += amount;
          break;
        case 'subtract':
          balance.balance -= amount;
          balance.frozen -= amount;
          break;
        case 'freeze':
          balance.available -= amount;
          balance.frozen += amount;
          break;
        case 'unfreeze':
          balance.available += amount;
          balance.frozen -= amount;
          break;
      }

      balance.lastUpdated = new Date();
      await this.db.write();

      console.log(`💰 Balance updated: ${userId} ${currency} ${operation} ${amount}`);
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      throw error;
    }
  }

  // Get user wallet balance for specific currency
  async getUserWalletBalance(userId: string, currency: CurrencyType): Promise<WalletBalance> {
    try {
      const balances = await this.getUserWalletBalances(userId);
      const balance = balances.find(b => b.currency === currency);

      if (!balance) {
        // Return zero balance if not found
        return {
          userId,
          currency,
          balance: 0,
          frozen: 0,
          available: 0,
          lastUpdated: new Date()
        };
      }

      return balance;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  }

  // Get wallet transactions for user
  async getUserWalletTransactions(userId: string, limit: number = 50, offset: number = 0): Promise<WalletTransaction[]> {
    try {
      await this.db.read();

      if (!this.db.data.walletTransactions) {
        return [];
      }

      const userTransactions = this.db.data.walletTransactions
        .filter(t => t.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(offset, offset + limit);

      return userTransactions;
    } catch (error) {
      console.error('Error getting wallet transactions:', error);
      return [];
    }
  }

  // Get pending transactions for admin
  async getPendingWalletTransactions(): Promise<WalletTransaction[]> {
    try {
      await this.db.read();

      if (!this.db.data.walletTransactions) {
        return [];
      }

      return this.db.data.walletTransactions
        .filter(t => t.status === 'pending')
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch (error) {
      console.error('Error getting pending transactions:', error);
      return [];
    }
  }

  // Calculate transaction fee
  private calculateTransactionFee(type: WalletTransactionType, currency: CurrencyType, amount: number): number {
    if (type !== 'withdrawal') return 0;

    const feeRates = {
      TRY: 0.01, // 1%
      USD: 0.015, // 1.5%
      EUR: 0.015, // 1.5%
      BTC: 0.0005 // Fixed BTC fee
    };

    if (currency === 'BTC') {
      return feeRates.BTC;
    }

    return amount * feeRates[currency];
  }

  // Update crypto rates
  async updateCryptoRates(rates: {
    btc_try: number;
    btc_usd: number;
    btc_eur: number;
    usd_try: number;
    eur_try: number;
  }): Promise<void> {
    try {
      await this.db.read();

      if (!this.db.data.cryptoRates) {
        this.db.data.cryptoRates = [];
      }

      const newRates: CryptoRates = {
        ...rates,
        lastUpdated: new Date(),
        source: 'admin'
      };

      // Remove old rates and add new ones
      this.db.data.cryptoRates = [newRates];
      await this.db.write();

      console.log('💱 Crypto rates updated');
    } catch (error) {
      console.error('Error updating crypto rates:', error);
      throw error;
    }
  }

  // Get current crypto rates
  async getCryptoRates(): Promise<CryptoRates | null> {
    try {
      await this.db.read();

      if (!this.db.data.cryptoRates || this.db.data.cryptoRates.length === 0) {
        return null;
      }

      return this.db.data.cryptoRates[0];
    } catch (error) {
      console.error('Error getting crypto rates:', error);
      return null;
    }
  }

  // Get admin bank details
  async getAdminBankDetails(): Promise<AdminBankDetails[]> {
    try {
      await this.db.read();

      if (!this.db.data.adminBankDetails) {
        // Initialize with default bank details
        this.db.data.adminBankDetails = [
          {
            currency: 'TRY',
            bankName: 'İş Bankası',
            accountHolder: 'Kutbul Zaman Sistemi A.Ş.',
            iban: 'TR33 0006 1005 1978 6457 8413 26',
            isActive: true,
            notes: 'Ana TL hesabı',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            currency: 'USD',
            bankName: 'Silicon Valley Bank',
            accountHolder: 'Kutbul Zaman Systems Inc.',
            iban: 'US64 SVBK US6S 3300 9673 8637',
            swift: 'SVBKUS6S',
            isActive: true,
            notes: 'USD hesabı',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            currency: 'EUR',
            bankName: 'Commerzbank AG',
            accountHolder: 'Kutbul Zaman Systems GmbH',
            iban: 'DE89 3704 0044 0532 0130 00',
            swift: 'COBADEFF',
            isActive: true,
            notes: 'EUR hesabı',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            currency: 'BTC',
            walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            network: 'Bitcoin Mainnet',
            isActive: true,
            notes: 'Bitcoin cüzdan adresi',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        await this.db.write();
      }

      return this.db.data.adminBankDetails.filter(details => details.isActive);
    } catch (error) {
      console.error('Error getting admin bank details:', error);
      return [];
    }
  }

  // Get all wallet transactions for admin
  async getAllWalletTransactions(limit: number = 100, offset: number = 0): Promise<{
    transactions: WalletTransaction[];
    total: number;
  }> {
    try {
      await this.db.read();

      if (!this.db.data.walletTransactions) {
        return { transactions: [], total: 0 };
      }

      const total = this.db.data.walletTransactions.length;
      const transactions = this.db.data.walletTransactions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(offset, offset + limit);

      return { transactions, total };
    } catch (error) {
      console.error('Error getting all wallet transactions:', error);
      return { transactions: [], total: 0 };
    }
  }

  // Live Broadcast Management Methods
  async createLiveBroadcast(broadcast: LiveBroadcast): Promise<LiveBroadcast> {
    await this.db.read();

    if (!this.db.data.liveBroadcasts) {
      this.db.data.liveBroadcasts = [];
    }

    this.db.data.liveBroadcasts.push(broadcast);
    await this.db.write();

    return broadcast;
  }

  async getCurrentLiveBroadcast(): Promise<LiveBroadcast | null> {
    await this.db.read();

    if (!this.db.data.liveBroadcasts) {
      return null;
    }

    // Find the most recent broadcast (active or inactive)
    const broadcasts = this.db.data.liveBroadcasts.sort((a: LiveBroadcast, b: LiveBroadcast) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return broadcasts[0] || null;
  }

  async updateLiveBroadcast(broadcastId: string, updates: Partial<LiveBroadcast>): Promise<LiveBroadcast | null> {
    await this.db.read();

    if (!this.db.data.liveBroadcasts) {
      return null;
    }

    const broadcastIndex = this.db.data.liveBroadcasts.findIndex(
      (broadcast: LiveBroadcast) => broadcast.id === broadcastId
    );

    if (broadcastIndex === -1) {
      return null;
    }

    this.db.data.liveBroadcasts[broadcastIndex] = {
      ...this.db.data.liveBroadcasts[broadcastIndex],
      ...updates,
      lastUpdated: new Date()
    };

    await this.db.write();
    return this.db.data.liveBroadcasts[broadcastIndex];
  }

  async getAllLiveBroadcasts(): Promise<LiveBroadcast[]> {
    await this.db.read();

    if (!this.db.data.liveBroadcasts) {
      return [];
    }

    return this.db.data.liveBroadcasts.sort((a: LiveBroadcast, b: LiveBroadcast) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Monoline MLM System Methods
  async getMonolineSettings(): Promise<MonolineMLMSettings | null> {
    await this.db.read();

    if (!this.db.data.monolineSettings) {
      return null;
    }

    return this.db.data.monolineSettings;
  }

  async updateMonolineSettings(settings: Partial<MonolineMLMSettings>): Promise<MonolineMLMSettings> {
    await this.db.read();

    if (!this.db.data.monolineSettings) {
      // Import the service here to avoid circular dependency
      const { MonolineCommissionService } = await import('./monoline-commission-service');
      this.db.data.monolineSettings = MonolineCommissionService.getDefaultMonolineSettings();
    }

    this.db.data.monolineSettings = {
      ...this.db.data.monolineSettings,
      ...settings,
      updatedAt: new Date()
    };

    await this.db.write();
    return this.db.data.monolineSettings;
  }

  async createMonolineCommissionTransactions(transactions: MonolineCommissionTransaction[]): Promise<void> {
    await this.db.read();

    if (!this.db.data.monolineCommissions) {
      this.db.data.monolineCommissions = [];
    }

    this.db.data.monolineCommissions.push(...transactions);
    await this.db.write();
  }

  async getUserMonolineCommissions(userId: string, period: string = 'monthly'): Promise<MonolineCommissionTransaction[]> {
    await this.db.read();

    if (!this.db.data.monolineCommissions) {
      return [];
    }

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    return this.db.data.monolineCommissions.filter((commission: MonolineCommissionTransaction) =>
      commission.recipientId === userId &&
      new Date(commission.createdAt) >= startDate
    ).sort((a: MonolineCommissionTransaction, b: MonolineCommissionTransaction) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async addToPassiveIncomePool(amount: number): Promise<void> {
    await this.db.read();

    if (!this.db.data.passiveIncomePool) {
      this.db.data.passiveIncomePool = {
        totalAmount: 0,
        lastUpdated: new Date()
      };
    }

    this.db.data.passiveIncomePool.totalAmount += amount;
    this.db.data.passiveIncomePool.lastUpdated = new Date();

    await this.db.write();
  }

  async getPassiveIncomePoolAmount(): Promise<number> {
    await this.db.read();

    if (!this.db.data.passiveIncomePool) {
      return 0;
    }

    return this.db.data.passiveIncomePool.totalAmount || 0;
  }

  async resetPassiveIncomePool(): Promise<void> {
    await this.db.read();

    this.db.data.passiveIncomePool = {
      totalAmount: 0,
      lastUpdated: new Date()
    };

    await this.db.write();
  }

  async createPassiveIncomeDistribution(distribution: PassiveIncomeDistribution): Promise<void> {
    await this.db.read();

    if (!this.db.data.passiveIncomeDistributions) {
      this.db.data.passiveIncomeDistributions = [];
    }

    this.db.data.passiveIncomeDistributions.push(distribution);
    await this.db.write();
  }

  async getPassiveIncomeDistributions(limit: number = 50): Promise<PassiveIncomeDistribution[]> {
    await this.db.read();

    if (!this.db.data.passiveIncomeDistributions) {
      return [];
    }

    return this.db.data.passiveIncomeDistributions
      .sort((a: PassiveIncomeDistribution, b: PassiveIncomeDistribution) =>
        new Date(b.distributionDate).getTime() - new Date(a.distributionDate).getTime()
      )
      .slice(0, limit);
  }
}

export const mlmDb = new MLMDatabase();

// Utility function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
