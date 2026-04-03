// Discount calculation utilities

const DISCOUNT_TIERS = {
  RANK_1: 100,
  TOP_10: 80,
  TOP_50: 50,
  TOP_100: 20,
  TOP_200: 10,
  DEFAULT: 5
};

/**
 * Calculate discount based on user rank
 * @param {number} rank - User's rank in the quiz
 * @returns {number} Discount percentage (0-100)
 */
const getDiscountByRank = (rank) => {
  if (rank === 1) return DISCOUNT_TIERS.RANK_1;
  if (rank <= 10) return DISCOUNT_TIERS.TOP_10;
  if (rank <= 50) return DISCOUNT_TIERS.TOP_50;
  if (rank <= 100) return DISCOUNT_TIERS.TOP_100;
  if (rank <= 200) return DISCOUNT_TIERS.TOP_200;
  return DISCOUNT_TIERS.DEFAULT;
};

/**
 * Calculate final price after discount
 * @param {number} originalPrice - Original course price
 * @param {number} discountPercentage - Discount percentage
 * @returns {number} Final price after discount
 */
const calculateFinalPrice = (originalPrice, discountPercentage) => {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return Math.round((originalPrice - discountAmount) * 100) / 100;
};

/**
 * Get discount tier information
 * @param {number} rank - User's rank
 * @returns {Object} Discount tier details
 */
const getDiscountTier = (rank) => {
  let tier;
  let discount;

  if (rank === 1) {
    tier = 'Champion';
    discount = DISCOUNT_TIERS.RANK_1;
  } else if (rank <= 10) {
    tier = 'Elite';
    discount = DISCOUNT_TIERS.TOP_10;
  } else if (rank <= 50) {
    tier = 'Advanced';
    discount = DISCOUNT_TIERS.TOP_50;
  } else if (rank <= 100) {
    tier = 'Intermediate';
    discount = DISCOUNT_TIERS.TOP_100;
  } else if (rank <= 200) {
    tier = 'Beginner';
    discount = DISCOUNT_TIERS.TOP_200;
  } else {
    tier = 'Participant';
    discount = DISCOUNT_TIERS.DEFAULT;
  }

  return {
    tier,
    discount,
    rank,
    message: `You earned ${discount}% discount as a ${tier} performer!`
  };
};

/**
 * Calculate savings amount
 * @param {number} originalPrice - Original course price
 * @param {number} discountPercentage - Discount percentage
 * @param {number} depositPaid - Amount paid as deposit
 * @returns {Object} Savings breakdown
 */
const calculateSavings = (originalPrice, discountPercentage, depositPaid) => {
  const finalPrice = calculateFinalPrice(originalPrice, discountPercentage);
  const totalSavings = originalPrice - finalPrice;
  const netSavings = totalSavings - depositPaid;

  return {
    originalPrice,
    discountPercentage,
    discountAmount: originalPrice - finalPrice,
    depositPaid,
    finalPrice,
    totalSavings,
    netSavings,
    effectiveDiscount: Math.round((netSavings / originalPrice) * 100)
  };
};

/**
 * Validate discount calculation
 * @param {number} rank - User rank
 * @param {number} originalPrice - Original price
 * @returns {Object} Validation result
 */
const validateDiscountCalculation = (rank, originalPrice) => {
  const errors = [];

  if (typeof rank !== 'number' || rank < 1) {
    errors.push('Rank must be a positive number');
  }

  if (typeof originalPrice !== 'number' || originalPrice <= 0) {
    errors.push('Original price must be a positive number');
  }

  const discount = getDiscountByRank(rank);
  if (discount < 0 || discount > 100) {
    errors.push('Invalid discount percentage calculated');
  }

  return {
    isValid: errors.length === 0,
    errors,
    discount
  };
};

module.exports = {
  DISCOUNT_TIERS,
  getDiscountByRank,
  calculateFinalPrice,
  getDiscountTier,
  calculateSavings,
  validateDiscountCalculation
};
