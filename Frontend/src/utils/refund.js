// Refund calculation utilities

const REFUND_RATES = {
  RANK_1: 1.0,      // 100% refund for rank 1
  TOP_10: 0.9,      // 90% refund for top 10
  TOP_50: 0.85,     // 85% refund for top 50
  DEFAULT: 0.8      // 80% refund for others
};

/**
 * Calculate refund amount based on rank and deposit
 * @param {number} depositPaid - Amount paid as deposit
 * @param {number} rank - User's rank in the quiz
 * @returns {number} Refund amount
 */
const calculateRefund = (depositPaid, rank) => {
  let refundRate;

  if (rank === 1) {
    refundRate = REFUND_RATES.RANK_1;
  } else if (rank <= 10) {
    refundRate = REFUND_RATES.TOP_10;
  } else if (rank <= 50) {
    refundRate = REFUND_RATES.TOP_50;
  } else {
    refundRate = REFUND_RATES.DEFAULT;
  }

  return Math.round(depositPaid * refundRate * 100) / 100;
};

/**
 * Get refund tier information
 * @param {number} rank - User's rank
 * @returns {Object} Refund tier details
 */
const getRefundTier = (rank) => {
  let tier;
  let rate;

  if (rank === 1) {
    tier = 'Champion';
    rate = REFUND_RATES.RANK_1;
  } else if (rank <= 10) {
    tier = 'Elite';
    rate = REFUND_RATES.TOP_10;
  } else if (rank <= 50) {
    tier = 'Advanced';
    rate = REFUND_RATES.TOP_50;
  } else {
    tier = 'Participant';
    rate = REFUND_RATES.DEFAULT;
  }

  return {
    tier,
    rate,
    rank,
    message: `You receive ${Math.round(rate * 100)}% refund as a ${tier} performer!`
  };
};

/**
 * Calculate complete refund breakdown
 * @param {number} depositPaid - Amount paid as deposit
 * @param {number} rank - User's rank
 * @returns {Object} Complete refund breakdown
 */
const calculateRefundBreakdown = (depositPaid, rank) => {
  const refundAmount = calculateRefund(depositPaid, rank);
  const platformFee = depositPaid - refundAmount;
  const refundTier = getRefundTier(rank);

  return {
    depositPaid,
    rank,
    refundAmount,
    platformFee,
    refundRate: refundTier.rate,
    refundTier: refundTier.tier,
    netLoss: platformFee,
    effectiveReturn: Math.round((refundAmount / depositPaid) * 100)
  };
};

/**
 * Process refund for multiple users
 * @param {Array} participants - Array of participants with rank and deposit
 * @returns {Array} Array of refund calculations
 */
const processBatchRefunds = (participants) => {
  return participants.map(participant => {
    const refund = calculateRefundBreakdown(
      participant.depositPaid,
      participant.rank
    );

    return {
      userId: participant.userId,
      userName: participant.userName,
      ...refund
    };
  });
};

/**
 * Calculate total platform revenue from refunds
 * @param {Array} refundCalculations - Array of refund calculations
 * @returns {Object} Platform revenue summary
 */
const calculatePlatformRevenue = (refundCalculations) => {
  const totalDeposits = refundCalculations.reduce((sum, r) => sum + r.depositPaid, 0);
  const totalRefunds = refundCalculations.reduce((sum, r) => sum + r.refundAmount, 0);
  const totalPlatformFees = refundCalculations.reduce((sum, r) => sum + r.platformFee, 0);

  return {
    totalDeposits,
    totalRefunds,
    totalPlatformFees,
    platformRevenue: totalPlatformFees,
    averageRefundRate: Math.round((totalRefunds / totalDeposits) * 100),
    participantCount: refundCalculations.length
  };
};

/**
 * Validate refund calculation
 * @param {number} depositPaid - Amount paid as deposit
 * @param {number} rank - User's rank
 * @returns {Object} Validation result
 */
const validateRefundCalculation = (depositPaid, rank) => {
  const errors = [];

  if (typeof depositPaid !== 'number' || depositPaid <= 0) {
    errors.push('Deposit paid must be a positive number');
  }

  if (typeof rank !== 'number' || rank < 1) {
    errors.push('Rank must be a positive number');
  }

  const refund = calculateRefund(depositPaid, rank);
  if (refund < 0 || refund > depositPaid) {
    errors.push('Invalid refund amount calculated');
  }

  return {
    isValid: errors.length === 0,
    errors,
    refund
  };
};

/**
 * Generate refund receipt
 * @param {Object} refundData - Refund calculation data
 * @returns {Object} Formatted receipt
 */
const generateRefundReceipt = (refundData) => {
  const {
    depositPaid,
    rank,
    refundAmount,
    platformFee,
    refundTier,
    userName,
    courseTitle,
    completedAt
  } = refundData;

  return {
    receiptId: `RF_${Date.now()}_${rank}`,
    userName,
    courseTitle,
    completedAt,
    rank,
    refundTier,
    amounts: {
      depositPaid,
      refundAmount,
      platformFee,
      netLoss: platformFee
    },
    rates: {
      refundRate: Math.round((refundAmount / depositPaid) * 100),
      platformFeeRate: Math.round((platformFee / depositPaid) * 100)
    },
    message: `Refund processed: ${refundAmount} (${Math.round((refundAmount / depositPaid) * 100)}% of deposit)`,
    processedAt: new Date().toISOString()
  };
};

module.exports = {
  REFUND_RATES,
  calculateRefund,
  getRefundTier,
  calculateRefundBreakdown,
  processBatchRefunds,
  calculatePlatformRevenue,
  validateRefundCalculation,
  generateRefundReceipt
};
