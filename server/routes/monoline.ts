import express from 'express';
import { mlmDb } from '../lib/mlm-database';
import { MonolineCommissionService } from '../lib/monoline-commission-service';
import { MonolineMLMSettings, MonolineCommissionStructure } from '../../shared/mlm-types';

import express from 'express';

const router = express.Router();

// Admin middleware (simplified)
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    // Simplified admin check
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get monoline settings (Admin)
router.get('/admin/settings', requireAdmin, async (req, res) => {
  try {
    const settings = await mlmDb.getMonolineSettings();
    
    res.json({
      success: true,
      settings: settings || MonolineCommissionService.getDefaultMonolineSettings()
    });
  } catch (error) {
    console.error('Error getting monoline settings:', error);
    res.status(500).json({
      error: 'Failed to get monoline settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update monoline settings (Admin)
router.put('/admin/settings', requireAdmin, async (req, res) => {
  try {
    const { settings }: { settings: Partial<MonolineMLMSettings> } = req.body;
    
    if (!settings) {
      return res.status(400).json({
        error: 'Settings are required'
      });
    }

    const updatedSettings = await mlmDb.updateMonolineSettings(settings);
    
    console.log('💎 Monoline settings updated:', updatedSettings);
    
    res.json({
      success: true,
      settings: updatedSettings,
      message: 'Monoline MLM ayarları başarıyla güncellendi!'
    });
  } catch (error) {
    console.error('Error updating monoline settings:', error);
    res.status(500).json({
      error: 'Failed to update monoline settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Process product sale and calculate commissions
router.post('/sale', async (req, res) => {
  try {
    const { buyerId, productPrice, productId } = req.body;
    
    if (!buyerId || !productPrice) {
      return res.status(400).json({
        error: 'Buyer ID and product price are required'
      });
    }

    const allUsers = await mlmDb.getAllUsers();
    const settings = await mlmDb.getMonolineSettings();
    const commissionStructure = settings?.commissionStructure || MonolineCommissionService.getDefaultCommissionStructure();
    
    // Calculate commissions
    const result = await MonolineCommissionService.calculateMonolineCommissions(
      buyerId,
      productPrice,
      allUsers,
      commissionStructure
    );

    // Process each commission transaction
    for (const transaction of result.transactions) {
      const recipient = allUsers.find(u => u.id === transaction.recipientId);
      if (recipient) {
        const updatedUser = await MonolineCommissionService.processCommissionTransaction(transaction, recipient);
        await mlmDb.updateUser(updatedUser.id, updatedUser);
        
        // Mark transaction as processed
        transaction.status = 'processed';
        transaction.processedAt = new Date();
      }
    }

    // Add to passive income pool
    if (result.passivePoolAmount > 0) {
      await mlmDb.addToPassiveIncomePool(result.passivePoolAmount);
    }

    // Log sale and commissions
    await mlmDb.createMonolineCommissionTransactions(result.transactions);
    
    console.log('💰 Monoline sale processed:', {
      buyerId,
      productPrice,
      totalCommissions: result.totalDistributed,
      passivePool: result.passivePoolAmount,
      companyFund: result.companyFundAmount
    });

    res.json({
      success: true,
      sale: {
        buyerId,
        productPrice,
        saleId: result.transactions[0]?.saleId
      },
      commissions: {
        totalDistributed: result.totalDistributed,
        transactionCount: result.transactions.length,
        passivePoolAmount: result.passivePoolAmount,
        companyFundAmount: result.companyFundAmount
      },
      transactions: result.transactions.map(t => ({
        recipientId: t.recipientId,
        type: t.commissionType,
        amount: t.amount,
        level: t.level
      }))
    });
  } catch (error) {
    console.error('Error processing monoline sale:', error);
    res.status(500).json({
      error: 'Failed to process sale',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Distribute passive income pool (Admin)
router.post('/admin/distribute-passive-income', requireAdmin, async (req, res) => {
  try {
    const allUsers = await mlmDb.getAllUsers();
    const activeUsers = allUsers.filter(u => u.isActive);
    const currentPoolAmount = await mlmDb.getPassiveIncomePoolAmount();
    
    if (currentPoolAmount <= 0) {
      return res.json({
        success: true,
        message: 'Pasif gelir havuzu boş',
        distributed: 0,
        recipients: 0
      });
    }

    if (activeUsers.length === 0) {
      return res.json({
        success: true,
        message: 'Aktif üye bulunamadı',
        distributed: 0,
        recipients: 0
      });
    }

    // Calculate distribution
    const distribution = MonolineCommissionService.calculatePassiveIncomeDistribution(
      currentPoolAmount,
      activeUsers
    );

    // Process distribution
    let distributedAmount = 0;
    let successfulRecipients = 0;

    for (const recipient of distribution.recipients) {
      try {
        const user = activeUsers.find(u => u.id === recipient.userId);
        if (user && recipient.amount > 0) {
          const updatedUser = {
            ...user,
            wallet: {
              ...user.wallet,
              balance: user.wallet.balance + recipient.amount,
              totalEarnings: user.wallet.totalEarnings + recipient.amount,
              passiveIncome: user.wallet.passiveIncome + recipient.amount
            }
          };
          
          await mlmDb.updateUser(user.id, updatedUser);
          distributedAmount += recipient.amount;
          successfulRecipients++;
          recipient.status = 'distributed';
        }
      } catch (error) {
        console.error(`Error distributing to user ${recipient.userId}:`, error);
        recipient.status = 'failed';
      }
    }

    // Reset passive income pool
    await mlmDb.resetPassiveIncomePool();
    
    // Save distribution record
    await mlmDb.createPassiveIncomeDistribution(distribution);

    console.log('🌊 Passive income distributed:', {
      totalPool: currentPoolAmount,
      distributed: distributedAmount,
      recipients: successfulRecipients,
      activeMembers: activeUsers.length
    });

    res.json({
      success: true,
      distribution: {
        totalPool: currentPoolAmount,
        distributedAmount,
        recipients: successfulRecipients,
        amountPerMember: distribution.amountPerMember,
        activeMembers: activeUsers.length
      },
      message: `Pasif gelir dağıtıldı: $${distributedAmount.toFixed(2)} toplam, ${successfulRecipients} üye`
    });
  } catch (error) {
    console.error('Error distributing passive income:', error);
    res.status(500).json({
      error: 'Failed to distribute passive income',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get monoline network statistics
router.get('/admin/network-stats', requireAdmin, async (req, res) => {
  try {
    const allUsers = await mlmDb.getAllUsers();
    const stats = MonolineCommissionService.getMonolineNetworkStats(allUsers);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting network stats:', error);
    res.status(500).json({
      error: 'Failed to get network statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user's monoline commissions
router.get('/user/:userId/commissions', async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'monthly' } = req.query;
    
    const commissions = await mlmDb.getUserMonolineCommissions(userId, period as string);
    
    res.json({
      success: true,
      commissions
    });
  } catch (error) {
    console.error('Error getting user commissions:', error);
    res.status(500).json({
      error: 'Failed to get user commissions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test monoline commission calculation
router.post('/admin/test-commission', requireAdmin, async (req, res) => {
  try {
    const { buyerId, productPrice } = req.body;
    
    const allUsers = await mlmDb.getAllUsers();
    const result = await MonolineCommissionService.calculateMonolineCommissions(
      buyerId || 'admin-001',
      productPrice || 20,
      allUsers
    );

    res.json({
      success: true,
      test: true,
      result,
      breakdown: {
        directSponsor: `${result.transactions.filter(t => t.commissionType === 'direct_sponsor').length} recipients`,
        careerBonuses: `${result.transactions.filter(t => t.commissionType.startsWith('career_level')).length} recipients`,
        totalCommissions: `$${result.totalDistributed.toFixed(2)}`,
        passivePool: `$${result.passivePoolAmount.toFixed(2)}`,
        companyFund: `$${result.companyFundAmount.toFixed(2)}`
      }
    });
  } catch (error) {
    console.error('Error testing commission calculation:', error);
    res.status(500).json({
      error: 'Failed to test commission calculation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
