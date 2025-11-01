import { User, MonolineCommissionStructure, MonolineCommissionTransaction, MonolineNetwork, PassiveIncomeDistribution, MonolineMLMSettings } from '../../shared/mlm-types';

export class MonolineCommissionService {
  // Exact commission structure according to specifications
  static getDefaultCommissionStructure(): MonolineCommissionStructure {
    const productPrice = 20; // $20 USD per unit
    
    return {
      productPrice,
      // Direct Sponsor Bonus: 15% ($3)
      directSponsorBonus: {
        percentage: 15,
        amount: 3.00
      },
      // Depth Commission: $7.9 distributed to 7 sponsors
      depthCommissions: {
        level1: { percentage: 12.5, amount: 2.50 }, // Top sponsor
        level2: { percentage: 7.5, amount: 1.50 },  // 2nd sponsor
        level3: { percentage: 5.0, amount: 1.00 },  // 3rd sponsor
        level4: { percentage: 3.5, amount: 0.70 },  // 4th sponsor
        level5: { percentage: 2.5, amount: 0.50 },  // 5th sponsor
        level6: { percentage: 2.0, amount: 0.40 },  // 6th sponsor
        level7: { percentage: 1.5, amount: 0.30 },  // 7th sponsor
        totalPercentage: 39.5,
        totalAmount: 7.90
      },
      // Passive Income Pool: $0.1 distributed equally among active members
      passiveIncomePool: {
        percentage: 0.5,
        amount: 0.10,
        distribution: 'equal_among_active'
      },
      // Company Fund: 45% ($9)
      companyFund: {
        percentage: 45,
        amount: 9.00
      }
    };
  }

  // Membership and activity requirements
  static getMembershipRequirements() {
    return {
      initialPurchase: {
        minimumAmount: 100, // $100 (5 units of $20)
        minimumUnits: 5
      },
      monthlyActivity: {
        minimumAmount: 20, // $20 (1 unit)
        minimumUnits: 1
      },
      annualActivity: {
        minimumAmount: 200, // $200 (10 units)
        minimumUnits: 10
      }
    };
  }

  // Check if user meets activity requirements
  static checkUserActivity(user: User, salesData?: {
    monthlySales: number;
    annualSales: number;
  }): {
    isMonthlyActive: boolean;
    isAnnuallyActive: boolean;
    isFullyActive: boolean;
    hasInitialPurchase: boolean;
  } {
    const requirements = this.getMembershipRequirements();
    const monthly = salesData?.monthlySales || user.monthlySalesVolume || 0;
    const annual = salesData?.annualSales || user.annualSalesVolume || 0;
    const initial = user.totalInvestment || 0;

    const isMonthlyActive = monthly >= requirements.monthlyActivity.minimumAmount;
    const isAnnuallyActive = annual >= requirements.annualActivity.minimumAmount;
    const hasInitialPurchase = initial >= requirements.initialPurchase.minimumAmount;
    const isFullyActive = isMonthlyActive && isAnnuallyActive && hasInitialPurchase;

    return {
      isMonthlyActive,
      isAnnuallyActive,
      isFullyActive,
      hasInitialPurchase
    };
  }

  // Calculate and distribute commissions for a $20 product sale
  static async calculateMonolineCommissions(
    buyerId: string, 
    productPrice: number = 20, 
    allUsers: User[],
    commissionStructure?: MonolineCommissionStructure
  ): Promise<{
    transactions: MonolineCommissionTransaction[];
    passivePoolAmount: number;
    companyFundAmount: number;
    totalDistributed: number;
    inactiveCommissionsToCompany: number;
  }> {
    const structure = commissionStructure || this.getDefaultCommissionStructure();
    const transactions: MonolineCommissionTransaction[] = [];
    const saleId = `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let inactiveCommissionsToCompany = 0;
    
    // Find buyer
    const buyer = allUsers.find(u => u.id === buyerId);
    if (!buyer) {
      throw new Error('Buyer not found');
    }

    // 1. Direct Sponsor Bonus: $3 (Always paid regardless of activity)
    if (buyer.sponsorId) {
      const sponsor = allUsers.find(u => u.id === buyer.sponsorId);
      if (sponsor) {
        transactions.push({
          id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          saleId,
          buyerId,
          productPrice,
          commissionType: 'direct_sponsor',
          recipientId: sponsor.id,
          percentage: structure.directSponsorBonus.percentage,
          amount: structure.directSponsorBonus.amount,
          status: 'pending',
          createdAt: new Date()
        });
      }
    }

    // 2. Depth Commission Distribution: $7.9 to 7 sponsors (only if active)
    const uplineChain = this.getUplineChain(buyer, allUsers, 7);
    const depthLevels = [
      { level: 1, ...structure.depthCommissions.level1 },
      { level: 2, ...structure.depthCommissions.level2 },
      { level: 3, ...structure.depthCommissions.level3 },
      { level: 4, ...structure.depthCommissions.level4 },
      { level: 5, ...structure.depthCommissions.level5 },
      { level: 6, ...structure.depthCommissions.level6 },
      { level: 7, ...structure.depthCommissions.level7 }
    ];

    uplineChain.forEach((uplineUser, index) => {
      if (index < depthLevels.length) {
        const levelBonus = depthLevels[index];
        const activityCheck = this.checkUserActivity(uplineUser);
        
        if (activityCheck.isFullyActive) {
          // User is active - pay commission
          transactions.push({
            id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            saleId,
            buyerId,
            productPrice,
            commissionType: `depth_level_${levelBonus.level}` as any,
            recipientId: uplineUser.id,
            level: levelBonus.level,
            percentage: levelBonus.percentage,
            amount: levelBonus.amount,
            status: 'pending',
            createdAt: new Date()
          });
        } else {
          // User is inactive - commission goes to company fund
          inactiveCommissionsToCompany += levelBonus.amount;
        }
      }
    });

    // 3. Passive Income Pool: $0.1 for active members
    const passivePoolAmount = structure.passiveIncomePool.amount;
    
    // 4. Company Fund: $9 + any inactive commissions
    const companyFundAmount = structure.companyFund.amount + inactiveCommissionsToCompany;
    const totalDistributed = transactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      transactions,
      passivePoolAmount,
      companyFundAmount,
      totalDistributed,
      inactiveCommissionsToCompany
    };
  }

  // Get upline chain for depth commissions
  private static getUplineChain(user: User, allUsers: User[], maxLevels: number): User[] {
    const chain: User[] = [];
    let currentUser = user;
    
    for (let i = 0; i < maxLevels; i++) {
      if (!currentUser.sponsorId) break;
      
      const sponsor = allUsers.find(u => u.id === currentUser.sponsorId);
      if (!sponsor) break;
      
      chain.push(sponsor);
      currentUser = sponsor;
    }
    
    return chain;
  }

  // Calculate passive income distribution among all active members
  static calculatePassiveIncomeDistribution(
    totalPoolAmount: number,
    allUsers: User[]
  ): PassiveIncomeDistribution {
    const activeUsers = allUsers.filter(user => {
      const activityCheck = this.checkUserActivity(user);
      return activityCheck.isFullyActive;
    });
    
    const activeMembers = activeUsers.length;
    const amountPerMember = activeMembers > 0 ? totalPoolAmount / activeMembers : 0;

    return {
      id: `passive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      totalPool: totalPoolAmount,
      activeMembers,
      amountPerMember,
      distributionDate: new Date(),
      recipients: activeUsers.map(user => ({
        userId: user.id,
        memberId: user.memberId,
        amount: amountPerMember,
        status: 'pending' as const
      }))
    };
  }

  // Process new member initial purchase validation
  static validateInitialMembership(purchaseAmount: number): {
    isValid: boolean;
    requiredAmount: number;
    message: string;
  } {
    const requirements = this.getMembershipRequirements();
    const isValid = purchaseAmount >= requirements.initialPurchase.minimumAmount;
    
    return {
      isValid,
      requiredAmount: requirements.initialPurchase.minimumAmount,
      message: isValid 
        ? 'Initial membership requirement met'
        : `Minimum initial purchase of $${requirements.initialPurchase.minimumAmount} (${requirements.initialPurchase.minimumUnits} units) required`
    };
  }

  // Process commission transaction (add to user wallet)
  static async processCommissionTransaction(
    transaction: MonolineCommissionTransaction,
    recipient: User
  ): Promise<User> {
    const updatedUser = {
      ...recipient,
      wallet: {
        ...recipient.wallet,
        balance: recipient.wallet.balance + transaction.amount,
        totalEarnings: recipient.wallet.totalEarnings + transaction.amount,
        sponsorBonus: transaction.commissionType === 'direct_sponsor' 
          ? recipient.wallet.sponsorBonus + transaction.amount 
          : recipient.wallet.sponsorBonus,
        careerBonus: transaction.commissionType.startsWith('depth_level') 
          ? recipient.wallet.careerBonus + transaction.amount 
          : recipient.wallet.careerBonus,
        passiveIncome: transaction.commissionType === 'passive_income' 
          ? recipient.wallet.passiveIncome + transaction.amount 
          : recipient.wallet.passiveIncome
      }
    };

    return updatedUser;
  }

  // Get detailed monoline network statistics
  static getMonolineNetworkStats(users: User[]): {
    totalMembers: number;
    activeMembers: number;
    monthlyActiveMembers: number;
    annuallyActiveMembers: number;
    totalVolume: number;
    monthlyVolume: number;
    annualVolume: number;
    avgDepth: number;
    passiveIncomePool: number;
    companyFund: number;
    topPerformers: Array<{
      userId: string;
      memberId: string;
      fullName: string;
      directReferrals: number;
      monthlyVolume: number;
      annualVolume: number;
      activityStatus: string;
    }>;
  } {
    const totalMembers = users.length;
    let activeMembers = 0;
    let monthlyActiveMembers = 0;
    let annuallyActiveMembers = 0;
    let monthlyVolume = 0;
    let annualVolume = 0;
    
    users.forEach(user => {
      const activity = this.checkUserActivity(user);
      if (activity.isFullyActive) activeMembers++;
      if (activity.isMonthlyActive) monthlyActiveMembers++;
      if (activity.isAnnuallyActive) annuallyActiveMembers++;
      
      monthlyVolume += user.monthlySalesVolume || 0;
      annualVolume += user.annualSalesVolume || 0;
    });
    
    const totalVolume = annualVolume;
    
    // Calculate average depth
    const depths = users.map(u => this.calculateUserDepth(u, users));
    const avgDepth = depths.reduce((sum, depth) => sum + depth, 0) / depths.length;
    
    // Estimate passive income pool and company fund
    const estimatedMonthlySales = monthlyVolume / 20; // Number of $20 sales
    const passiveIncomePool = estimatedMonthlySales * 0.1;
    const companyFund = estimatedMonthlySales * 9;
    
    // Get top performers
    const topPerformers = users
      .map(u => {
        const activity = this.checkUserActivity(u);
        return {
          userId: u.id,
          memberId: u.memberId,
          fullName: u.fullName,
          directReferrals: u.directReferrals,
          monthlyVolume: u.monthlySalesVolume || 0,
          annualVolume: u.annualSalesVolume || 0,
          activityStatus: activity.isFullyActive ? 'Fully Active' : 
                         activity.isMonthlyActive ? 'Monthly Active' :
                         activity.isAnnuallyActive ? 'Annually Active' : 'Inactive'
        };
      })
      .sort((a, b) => b.annualVolume - a.annualVolume)
      .slice(0, 10);

    return {
      totalMembers,
      activeMembers,
      monthlyActiveMembers,
      annuallyActiveMembers,
      totalVolume,
      monthlyVolume,
      annualVolume,
      avgDepth,
      passiveIncomePool,
      companyFund,
      topPerformers
    };
  }

  // Calculate user depth in monoline structure
  private static calculateUserDepth(user: User, allUsers: User[]): number {
    let depth = 0;
    let currentUser = user;
    
    while (currentUser.sponsorId) {
      const sponsor = allUsers.find(u => u.id === currentUser.sponsorId);
      if (!sponsor) break;
      depth++;
      currentUser = sponsor;
    }
    
    return depth;
  }

  // Updated monoline settings with exact specifications
  static getDefaultMonolineSettings(): MonolineMLMSettings {
    return {
      isEnabled: true,
      productPrice: 20,
      commissionStructure: this.getDefaultCommissionStructure(),
      membershipRequirements: this.getMembershipRequirements(),
      passiveIncomeSettings: {
        minimumActiveMembers: 1,
        distributionFrequency: 'monthly',
        lastDistribution: new Date(),
        totalPoolAmount: 0
      },
      activityRequirements: {
        monthly: { amount: 20, units: 1 },
        annual: { amount: 200, units: 10 },
        initial: { amount: 100, units: 5 }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Simulate a complete sales transaction
  static async simulateSalesTransaction(
    buyerId: string,
    productUnits: number = 1,
    allUsers: User[]
  ): Promise<{
    saleAmount: number;
    commissionBreakdown: any;
    affectedUsers: string[];
    companyRevenue: number;
    summary: string;
  }> {
    const saleAmount = productUnits * 20;
    const commissionResults = await this.calculateMonolineCommissions(buyerId, 20, allUsers);
    
    // Process each unit sale
    let totalCommissions = 0;
    let totalPassivePool = 0;
    let totalCompanyFund = 0;
    
    for (let i = 0; i < productUnits; i++) {
      totalCommissions += commissionResults.totalDistributed;
      totalPassivePool += commissionResults.passivePoolAmount;
      totalCompanyFund += commissionResults.companyFundAmount;
    }
    
    const affectedUsers = Array.from(new Set(commissionResults.transactions.map(t => t.recipientId)));
    
    const summary = `
🔄 MONOLINE MLM SALES TRANSACTION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Sale Details:
   • Product Units: ${productUnits}
   • Total Sale Amount: $${saleAmount}
   • Commission Structure: Exact Monoline Specifications

💵 Revenue Distribution per $20 Unit:
   • Direct Sponsor: $3.00 (15%)
   • Depth Commissions: $7.90 (39.5%) - 7 levels
   • Passive Income Pool: $0.10 (0.5%)
   • Company Fund: $9.00 (45%)

📊 Transaction Results:
   • Total Commissions Paid: $${totalCommissions.toFixed(2)}
   • Passive Income Pool: $${totalPassivePool.toFixed(2)}
   • Company Revenue: $${totalCompanyFund.toFixed(2)}
   • Users Affected: ${affectedUsers.length}

✅ Commission paid only to active members
❌ Inactive member commissions → Company Fund
`;

    return {
      saleAmount,
      commissionBreakdown: {
        directSponsor: productUnits * 3,
        depthCommissions: productUnits * 7.9,
        passivePool: productUnits * 0.1,
        companyFund: totalCompanyFund
      },
      affectedUsers,
      companyRevenue: totalCompanyFund,
      summary
    };
  }
}

export default MonolineCommissionService;
