// Utility function to format currency values
export const formatCurrency = (amount, currency = 'USD') => {
  // Handle different currency formats
  const formatters = {
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    EUR: new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    GBP: new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
  };

  // Return formatted currency or default to USD format
  return formatters[currency]?.format(amount) || formatters.USD.format(amount);
};

// Format currency without symbol (for display purposes)
export const formatCurrencyValue = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Parse currency string back to number
export const parseCurrency = (currencyString) => {
  // Remove currency symbols and commas, then parse as number
  const cleanString = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleanString) || 0;
};
