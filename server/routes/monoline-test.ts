import { Router } from 'express';
import { MonolineCommissionService } from '../lib/monoline-commission-service';
import { MLMDatabase } from '../lib/mlm-database';

const router = Router();

// Test monoline commission calculation
router.post('/test-commission', async (req, res) => {
  try {
    const { buyerId, productUnits = 1 } = req.body;
    
    // Get all users from database
    const allUsers = await MLMDatabase.getAllUsers();
    
    if (!buyerId) {
      return res.status(400).json({
        success: false,
        error: 'buyerId is required'
      });
    }

    // Check if buyer exists
    const buyer = allUsers.find(u => u.id === buyerId);
    if (!buyer) {
      return res.status(404).json({
        success: false,
        error: 'Buyer not found'
      });
    }

    // Simulate sales transaction
    const result = await MonolineCommissionService.simulateSalesTransaction(
      buyerId,
      productUnits,
      allUsers
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error testing monoline commission:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to test commission calculation'
    });
  }
});

// Test membership validation
router.post('/test-membership', async (req, res) => {
  try {
    const { purchaseAmount } = req.body;
    
    if (purchaseAmount === undefined) {
      return res.status(400).json({
        success: false,
        error: 'purchaseAmount is required'
      });
    }

    const validation = MonolineCommissionService.validateInitialMembership(purchaseAmount);
    
    res.json({
      success: true,
      data: {
        validation,
        requirements: MonolineCommissionService.getMembershipRequirements()
      }
    });
  } catch (error) {
    console.error('Error testing membership validation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to test membership validation'
    });
  }
});

// Test activity requirements
router.post('/test-activity', async (req, res) => {
  try {
    const { userId, monthlySales, annualSales } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    // Get all users from database
    const allUsers = await MLMDatabase.getAllUsers();
    const user = allUsers.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const activityCheck = MonolineCommissionService.checkUserActivity(user, {
      monthlySales: monthlySales || user.monthlySalesVolume || 0,
      annualSales: annualSales || user.annualSalesVolume || 0
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          memberId: user.memberId
        },
        activityCheck,
        requirements: MonolineCommissionService.getMembershipRequirements()
      }
    });
  } catch (error) {
    console.error('Error testing activity requirements:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to test activity requirements'
    });
  }
});

// Get monoline network statistics
router.get('/network-stats', async (req, res) => {
  try {
    // Get all users from database
    const allUsers = await MLMDatabase.getAllUsers();
    
    const stats = MonolineCommissionService.getMonolineNetworkStats(allUsers);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting network stats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get network statistics'
    });
  }
});

// Get default monoline settings
router.get('/default-settings', async (req, res) => {
  try {
    const settings = MonolineCommissionService.getDefaultMonolineSettings();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error getting default settings:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get default settings'
    });
  }
});

export default router;
