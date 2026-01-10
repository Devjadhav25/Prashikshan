import currency from 'currency.js';

const formatMoney = (amount: number, currencyCode: string) => {
  // ✅ Set symbol to ₹ for INR, fallback to £ or $
  const symbol = currencyCode === "INR" ? "₹" : currencyCode === "GBP" ? "£" : "$";

  return currency(amount, {
    symbol,
    precision: 0, // ✅ Indian currency is often shown without decimals for whole amounts
    separator: ",",
    decimal: ".",
    // ✅ This ensures the symbol appears before the number (e.g., ₹ 50,000)
    pattern: `! #`, 
  }).format();
};

export default formatMoney;