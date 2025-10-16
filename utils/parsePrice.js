module.exports = function parsePrice(str) {
  // Handle undefined, null, or non-string values
  if (!str) return 0;

  // Convert to string if it's a number
  const priceStr = typeof str === "string" ? str : String(str);

  // Remove everything except digits and decimal points
  const numeric = priceStr.replace(/[^\d.]/g, "");

  // Convert to a number (or 0 if something goes wrong)
  return parseFloat(numeric) || 0;
};
