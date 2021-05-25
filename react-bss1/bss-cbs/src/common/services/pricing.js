import _get from 'lodash/get';

/**
 * Check whether the price is of priceType ['OneTimeCharge', 'Fee', 'Penalty', 'Charge', 'Deposit']
 * @param {*} price The ProductOfferingPrice
 * Usage:
 *  isUpfront = isOneTimePrice(price); // returns Boolean
 */
export function isOneTimePrice(price) {
  return (
    ['OneTimeCharge', 'Fee', 'Penalty', 'Charge', 'Deposit'].indexOf(
      _get(price, 'priceType')
    ) >= 0
  );
}

/**
 * Check whether the price is of priceType ['Recurring', 'Rental', 'AdvancedRental', 'Installment']
 * @param {*} price The ProductOfferingPrice
 * Usage:
 *  isRecurring = isRecurringPrice(price); // returns Boolean
 */
export function isRecurringPrice(price) {
  return (
    ['Recurring', 'Rental', 'AdvancedRental', 'Installment'].indexOf(
      _get(price, 'priceType')
    ) >= 0
  );
}
