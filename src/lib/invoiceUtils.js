/**
 * Invoice & GST Utility functions for FYXEN Tax Invoices
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(num) {
  let current = '';
  if (num >= 100) {
    current += ONES[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num >= 20) {
    current += TENS[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  if (num > 0) {
    current += ONES[num] + ' ';
  }
  return current.trim();
}

/**
 * Converts a numerical INR amount into Indian Rupee words (e.g. Lakhs, Crores)
 * @param {number} amount 
 * @returns {string} e.g. "Indian Rupees Two Thousand Nine Hundred Ninety-Eight Only"
 */
export function numberToWordsIndian(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Indian Rupees Zero Only';
  
  const num = Math.abs(Number(amount));
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  if (rupees === 0 && paise === 0) {
    return 'Indian Rupees Zero Only';
  }

  let words = '';

  const crores = Math.floor(rupees / 10000000);
  let remainder = rupees % 10000000;

  const lakhs = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  const thousands = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  const hundreds = remainder;

  if (crores > 0) {
    words += convertLessThanThousand(crores) + ' Crore ';
  }
  if (lakhs > 0) {
    words += convertLessThanThousand(lakhs) + ' Lakh ';
  }
  if (thousands > 0) {
    words += convertLessThanThousand(thousands) + ' Thousand ';
  }
  if (hundreds > 0) {
    words += convertLessThanThousand(hundreds) + ' ';
  }

  words = words.trim();
  let result = 'Indian Rupees ' + (words || 'Zero');

  if (paise > 0) {
    result += ' and ' + convertLessThanThousand(paise) + ' Paise';
  }

  result += ' Only';
  return result.replace(/\s+/g, ' ');
}

/**
 * Checks if the customer address / state is within West Bengal (Intra-state)
 */
export function isWestBengalState(state = '', postalCode = '', city = '') {
  const s = (state || '').toLowerCase().trim();
  const p = (postalCode || '').trim();
  const c = (city || '').toLowerCase().trim();

  if (p.length >= 2 && ['70', '71', '72', '73', '74'].includes(p.slice(0, 2))) {
    return true;
  }
  if (s.includes('west bengal') || s.includes('bengal') || s.includes('paschim banga') || s.includes('wb')) {
    return true;
  }
  const wbKeywords = ['kolkata', 'calcutta', 'howrah', 'hooghly', 'darjeeling', 'siliguri', 'asansol', 'durgapur', 'jangipur', 'murshidabad'];
  return wbKeywords.some(kw => c.includes(kw));
}

/**
 * Calculates Tax-Inclusive GST Line Item details
 */
export function calculateTaxInclusiveItem({
  quantity = 1,
  unitPriceInclusive = 0,
  taxRate = 18,
  isIntraState = true
}) {
  const qty = Math.max(1, Number(quantity) || 1);
  const unitPrice = Number(unitPriceInclusive) || 0;
  const lineTotal = Number((qty * unitPrice).toFixed(2));
  const rate = Number(taxRate) || 0;

  // Formula: Taxable = Total / (1 + Rate / 100)
  const taxableAmount = Number((lineTotal / (1 + rate / 100)).toFixed(2));
  const totalTax = Number((lineTotal - taxableAmount).toFixed(2));

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isIntraState) {
    cgst = Number((totalTax / 2).toFixed(2));
    sgst = Number((totalTax - cgst).toFixed(2)); // handle odd cents
  } else {
    igst = totalTax;
  }

  return {
    quantity: qty,
    unitPriceInclusive: unitPrice,
    totalPriceInclusive: lineTotal,
    taxRate: rate,
    taxableAmount,
    totalTax,
    cgst,
    sgst,
    igst
  };
}
