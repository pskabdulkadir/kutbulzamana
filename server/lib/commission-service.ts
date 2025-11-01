import { User, MembershipPackage } from '../../shared/mlm-types';

export interface CommissionCalculation {
  userId: string;
  type: 'sponsor' | 'career' | 'leadership' | 'passive';
  amount: number;
  percentage: number;
  sourceUserId?: string;
  sourcePackage?: string;
  level: number;
  timestamp: Date;
}

export interface BonusCalculation {
  userId: string;
  type: 'package' | 'team' | 'performance' | 'monthly';
  amount: number;
  percentage: number;
  sourceAmount: number;
  details: string;
  timestamp: Date;
}

export class CommissionService {
  // Real-time commission calculation when a package is purchased
  static async calculatePackagePurchaseCommissions(
    purchasingUser: User,
    membershipPackage: MembershipPackage,
    allUsers: User[]
  ): Promise<CommissionCalculation[]> {
    const commissions: CommissionCalculation[] = [];
    const packageAmount = membershipPackage.price;

    // 1. Direct Sponsor Commission (10% of package price)
    if (purchasingUser.sponsorId) {
      const sponsor = allUsers.find(u => u.id === purchasingUser.sponsorId);
      if (sponsor) {
        const sponsorCommission = packageAmount * 0.10; // 10% direct sponsor bonus
        commissions.push({
          userId: sponsor.id,
          type: 'sponsor',
          amount: sponsorCommission,
          percentage: 10,
          sourceUserId: purchasingUser.id,
          sourcePackage: membershipPackage.id,
          level: 1,
          timestamp: new Date()
        });
      }
    }

    // 2. Career Level Commissions (Multi-level)
    const sponsorChain = this.getSponsorChain(purchasingUser, allUsers, 5); // Up to 5 levels
    
    const careerCommissionRates = [0.05, 0.03, 0.02, 0.01, 0.01]; // 5%, 3%, 2%, 1%, 1%
    
    sponsorChain.forEach((sponsor, index) => {
      if (index < careerCommissionRates.length) {
        const rate = careerCommissionRates[index];
        const careerCommission = packageAmount * rate;
        
        commissions.push({
          userId: sponsor.id,
          type: 'career',
          amount: careerCommission,
          percentage: rate * 100,
          sourceUserId: purchasingUser.id,
          sourcePackage: membershipPackage.id,
          level: index + 2, // Level 2+ (level 1 is direct sponsor)
          timestamp: new Date()
        });
      }
    });

    // 3. Package-specific bonus
    const packageBonus = packageAmount * (membershipPackage.bonusPercentage / 100);
    commissions.push({
      userId: purchasingUser.id,
      type: 'passive',
      amount: packageBonus,
      percentage: membershipPackage.bonusPercentage,
      sourceUserId: purchasingUser.id,
      sourcePackage: membershipPackage.id,
      level: 0,
      timestamp: new Date()
    });

    return commissions;
  }

  // Real-time team placement bonus calculation
  static async calculateTeamPlacementBonuses(
    sponsorUser: User,
    newUser: User,
    position: 'left' | 'right' | 'auto',
    allUsers: User[]
  ): Promise<BonusCalculation[]> {
    const bonuses: BonusCalculation[] = [];

    // 1. Direct placement bonus
    const placementBonus = 10; // $10 for each direct placement
    bonuses.push({
      userId: sponsorUser.id,
      type: 'team',
      amount: placementBonus,
      percentage: 0,
      sourceAmount: 0,
      details: `New team member placement: ${newUser.fullName}`,
      timestamp: new Date()
    });

    // 2. Binary matching bonus (if both sides have members)
    const binaryBonus = this.calculateBinaryMatchingBonus(sponsorUser, allUsers);
    if (binaryBonus > 0) {
      bonuses.push({
        userId: sponsorUser.id,
        type: 'team',
        amount: binaryBonus,
        percentage: 0,
        sourceAmount: 0,
        details: 'Binary matching bonus for balanced team',
        timestamp: new Date()
      });
    }

    // 3. Team performance bonus for upline
    const uplineBonus = this.calculateUplineTeamBonus(sponsorUser, allUsers);
    if (uplineBonus.length > 0) {
      bonuses.push(...uplineBonus);
    }

    return bonuses;
  }

  // Calculate monthly performance bonuses
  static async calculateMonthlyPerformanceBonuses(
    user: User,
    allUsers: User[]
  ): Promise<BonusCalculation[]> {
    const bonuses: BonusCalculation[] = [];
    
    // Team size bonus
    const teamSize = this.getTeamSize(user, allUsers);
    if (teamSize >= 10) {
      const teamBonus = Math.floor(teamSize / 10) * 25; // $25 for every 10 team members
      bonuses.push({
        userId: user.id,
        type: 'performance',
        amount: teamBonus,
        percentage: 0,
        sourceAmount: teamSize,
        details: `Team size bonus: ${teamSize} members`,
        timestamp: new Date()
      });
    }

    // Leadership bonus for strong performers
    const totalTeamEarnings = this.getTeamTotalEarnings(user, allUsers);
    if (totalTeamEarnings >= 1000) {
      const leadershipBonus = totalTeamEarnings * 0.02; // 2% of team earnings
      bonuses.push({
        userId: user.id,
        type: 'performance',
        amount: leadershipBonus,
        percentage: 2,
        sourceAmount: totalTeamEarnings,
        details: `Leadership bonus: 2% of team earnings`,
        timestamp: new Date()
      });
    }

    return bonuses;
  }

  // Apply commissions and bonuses to user wallets in real-time
  static async applyCommissionsToWallet(
    userId: string,
    commissions: CommissionCalculation[],
    bonuses: BonusCalculation[],
    users: User[]
  ): Promise<User[]> {
    return users.map(user => {
      if (user.id === userId) {
        const userCommissions = commissions.filter(c => c.userId === userId);
        const userBonuses = bonuses.filter(b => b.userId === userId);
        
        const totalCommissionAmount = userCommissions.reduce((sum, c) => sum + c.amount, 0);
        const totalBonusAmount = userBonuses.reduce((sum, b) => sum + b.amount, 0);
        
        return {
          ...user,
          wallet: {
            ...user.wallet,
            balance: user.wallet.balance + totalCommissionAmount + totalBonusAmount,
            totalEarnings: user.wallet.totalEarnings + totalCommissionAmount + totalBonusAmount,
            sponsorBonus: user.wallet.sponsorBonus + userCommissions.filter(c => c.type === 'sponsor').reduce((sum, c) => sum + c.amount, 0),
            careerBonus: user.wallet.careerBonus + userCommissions.filter(c => c.type === 'career').reduce((sum, c) => sum + c.amount, 0),
            passiveIncome: user.wallet.passiveIncome + userCommissions.filter(c => c.type === 'passive').reduce((sum, c) => sum + c.amount, 0),
            leadershipBonus: user.wallet.leadershipBonus + totalBonusAmount
          }
        };
      }
      return user;
    });
  }

  // Helper methods
  private static getSponsorChain(user: User, allUsers: User[], levels: number): User[] {
    const chain: User[] = [];
    let currentUser = user;
    
    for (let i = 0; i < levels; i++) {
      if (!currentUser.sponsorId) break;
      
      const sponsor = allUsers.find(u => u.id === currentUser.sponsorId);
      if (!sponsor) break;
      
      chain.push(sponsor);
      currentUser = sponsor;
    }
    
    return chain;
  }

  private static calculateBinaryMatchingBonus(user: User, allUsers: User[]): number {
    // Simplified binary matching - in real implementation, would check left/right team balance
    const leftTeam = allUsers.filter(u => u.sponsorId === user.id && u.leftChild === user.id).length;
    const rightTeam = allUsers.filter(u => u.sponsorId === user.id && u.rightChild === user.id).length;
    
    if (leftTeam > 0 && rightTeam > 0) {
      return Math.min(leftTeam, rightTeam) * 5; // $5 per matching pair
    }
    
    return 0;
  }

  private static calculateUplineTeamBonus(sponsor: User, allUsers: User[]): BonusCalculation[] {
    const bonuses: BonusCalculation[] = [];
    const sponsorChain = this.getSponsorChain(sponsor, allUsers, 3);
    
    sponsorChain.forEach((uplineSponsor, index) => {
      const bonus = 5 - index; // $5, $4, $3 for levels
      bonuses.push({
        userId: uplineSponsor.id,
        type: 'team',
        amount: bonus,
        percentage: 0,
        sourceAmount: 0,
        details: `Upline team growth bonus (Level ${index + 2})`,
        timestamp: new Date()
      });
    });
    
    return bonuses;
  }

  private static getTeamSize(user: User, allUsers: User[]): number {
    return allUsers.filter(u => u.sponsorId === user.id).length;
  }

  private static getTeamTotalEarnings(user: User, allUsers: User[]): number {
    const teamMembers = allUsers.filter(u => u.sponsorId === user.id);
    return teamMembers.reduce((sum, member) => sum + member.wallet.totalEarnings, 0);
  }
}

export default CommissionService;
