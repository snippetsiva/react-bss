import _get from 'lodash/get';
import _has from 'lodash/has';
import _map from 'lodash/map';
import _find from 'lodash/find';
import _sumBy from 'lodash/sumBy';
import _toLower from 'lodash/toLower';
import _isEmpty from 'lodash/isEmpty';
import _forEach from 'lodash/forEach';
import _includes from 'lodash/includes';
import _cloneDeep from 'lodash/cloneDeep';
import _compact from 'lodash/compact';
import constants from '../constants/constants';
import { decimalService } from './stringUtil';
import { isOneTimePrice, isRecurringPrice } from './commonUtility';

const _getTotalPrice = offeringCurrency => {
  return {
    priceType: '',
    price: {
      taxIncludedAmount: {
        value: 0,
        unit: offeringCurrency
      },
      dutyFreeAmount: {
        value: 0,
        unit: offeringCurrency
      },
      taxRate: 0
    }
  };
};

export const getOrderItemPrices = (offering, action, subAction) => {
  const { productOfferingPrice } = offering || {};
  const itemPrice = [];
  _.forEach(productOfferingPrice, pop => {
    if (action === 'add' && !pop.isServiceActionPrice) {
      itemPrice.push(pop);
    } else if (pop.isServiceActionPrice) {
      const actionItem = _.find(pop.prodOfferPriceAction, { action });
      const actionSubTypes = _.get(actionItem, 'actionSubType', []);
      const hasSubActionItem = subAction && actionSubTypes.length ? _.includes(actionSubTypes, subAction) : true;
      if (actionItem && hasSubActionItem) {
        itemPrice.push(pop);
      }
    }
  });
  return itemPrice.filter(item => {
    return (
      (item['@baseType'] || item['baseType']) === constants.productPriceBaseType.CHARGE &&
      (((item['@type'] || item['type']) === constants.productPriceType.UPFRONT &&
        constants.actionPriceTypes.UPFRONT[action].indexOf(item.priceType) > -1) ||
        ((item['@type'] || item['type']) === constants.productPriceType.RECURRING &&
          constants.actionPriceTypes.RECURRING[action].indexOf(item.priceType) > -1))
    );
  });
};

// calculates and returns offering price
export const calculateOfferingPrice = (offering, action, subAction = '') => {
  const { productOfferingPrice } = offering;

  const offeringCurrency = _.get(
    _.find(productOfferingPrice, item => _.get(item, 'price.unit')),
    'price.unit'
  );

  const upfront = _.cloneDeep(_getTotalPrice(offeringCurrency));
  const monthly = _.cloneDeep(_getTotalPrice(offeringCurrency));

  const itemPrice = getOrderItemPrices(offering, action, subAction);

  itemPrice.forEach(price => {
    if (price['@baseType'] === constants.productPriceBaseType.CHARGE) {
      if (price['@type'] === constants.productPriceType.UPFRONT) {
        const { priceType, price: priceObj } = price;
        const { taxRate = 0, unit = '', dutyFreeAmount = 0, taxIncludedAmount = 0 } = priceObj;
        upfront.priceType = 'oneTimeCharge';
        upfront.price.taxRate = taxRate;
        upfront.price.dutyFreeAmount.unit = unit;
        upfront.price.taxIncludedAmount.unit = unit;
        upfront.price.dutyFreeAmount.value += parseFloat(dutyFreeAmount);
        upfront.price.taxIncludedAmount.value += parseFloat(taxIncludedAmount);
      }
      if (price['@type'] === constants.productPriceType.RECURRING) {
        const { priceType, recurringChargePeriodType, price: priceObj } = price;
        const { taxRate = 0, unit = '', dutyFreeAmount = 0, taxIncludedAmount = 0 } = priceObj;
        monthly.priceType = priceType;
        monthly.recurringChargePeriod = recurringChargePeriodType;
        monthly.price.taxRate = taxRate;
        monthly.price.dutyFreeAmount.unit = unit;
        monthly.price.taxIncludedAmount.unit = unit;
        monthly.price.dutyFreeAmount.value += parseFloat(dutyFreeAmount);
        monthly.price.taxIncludedAmount.value += parseFloat(taxIncludedAmount);
      }
    }
  });

  return [upfront, monthly];
};

// Modifies productOrder with the orderItemPrice and orderTotalPrice
export const calculateProductOrderPrice = productOrderInteraction => {
  const upfront = _.cloneDeep(_getTotalPrice(''));
  const monthly = _.cloneDeep(_getTotalPrice(''));

  productOrderInteraction.item.orderItem.forEach(orderItem => {
    orderItem.itemTotalPrice.forEach(({ priceType, price }) => {
      if (_.toLower(priceType) === 'onetimecharge') {
        upfront.priceType = priceType;
        upfront.price.taxRate += price.taxRate;
        upfront.price.dutyFreeAmount.unit = price.unit;
        upfront.price.dutyFreeAmount.value += parseFloat(price.dutyFreeAmount.value);
        upfront.price.taxIncludedAmount.unit = price.taxIncludedAmount.unit;
        upfront.price.taxIncludedAmount.value += parseFloat(price.taxIncludedAmount.value);
      } else {
        monthly.priceType = priceType;
        monthly.price.taxRate += price.taxRate;
        monthly.price.dutyFreeAmount.unit = price.unit;
        monthly.price.dutyFreeAmount.value += parseFloat(price.dutyFreeAmount.value);
        monthly.price.taxIncludedAmount.unit = price.taxIncludedAmount.unit;
        monthly.price.taxIncludedAmount.value += parseFloat(price.taxIncludedAmount.value);
        monthly.recurringChargePeriod = price.recurringChargePeriod;
      }
    });
  });

  productOrderInteraction.item.orderTotalPrice = [upfront, monthly];

  return productOrderInteraction;
};

// Modify partyInteraction, adds/modifies the payment object
export const calcualtePartyInteractionPrice = partyInteraction => {
  /* for productOrder in partyInteraction.interactionItem.@type == ProductOrder
        calculateProductOrderPrice(productOrder)
 
    // some requests like duplicateBill/creditLimit can be handled here
 
    if partyInteraction.@type === CreditLimitModification
        call something apply price in payment
 
 
    (partyInteraction.interactionItem.@type == Payment).price = sum(productOrders)
 
    return partyInteraction */
};
/**
 * Converting prices to old price Structure
 */

function isOldPriceStructure(pop) {
  return _has(pop, 'price.dutyFreeAmount');
}

function convertToOldPriceStructure(pop) {
  const priceUnit = _has(pop, 'price.unit') ? _get(pop, 'price.unit', '') : _get(pop, 'price.units', '');

  if (isOldPriceStructure(pop)) {
    return { ...pop, price: { ...pop.price, unit: priceUnit } };
  }
  const price = {
    dutyFreeAmount: parseFloat(_get(pop, 'price.value', 0)),
    percentage: parseFloat(_get(pop, 'percentage', 0)),
    unit: priceUnit
  };
  const totalTax = _sumBy(_get(pop, 'tax'), tax => parseFloat(_get(tax, 'taxAmount.value', 0)));
  const totalTaxRate = _sumBy(_get(pop, 'tax'), tax => parseFloat(_get(tax, 'taxRate', 0)));
  price.taxIncludedAmount = price.dutyFreeAmount * (1 + totalTaxRate / 100);
  price.taxRate = totalTaxRate;
  return {
    ...pop,
    price
  };
}

export const convertProductOfferingPrice = productOffering => {
  if (!_isEmpty(productOffering, 'productOfferingPrice')) {
    return {
      ...productOffering,
      productOfferingPrice: _map(productOffering.productOfferingPrice, convertToOldPriceStructure)
    };
  }
  return productOffering;
};

export const calculateTotalCharges = (allUpFrontPrices, allRentalPrices) => {
  const filteredAllUpfrontPrices = allUpFrontPrices
    .filter(item => item.name.includes('Suspension') === false)
    .filter(item => item.name.includes('Termination') === false);

  let totalUpfrontPricing = 0;
  filteredAllUpfrontPrices.forEach(priceObj => {
    totalUpfrontPricing += priceObj?.price?.taxIncludedAmount || priceObj?.price?.value || 0;
  });

  let totalRentalPricing = 0;
  allRentalPrices.forEach(priceObj => {
    totalRentalPricing += priceObj?.price?.taxIncludedAmount || priceObj?.price?.value || 0;
  });

  return { filteredAllUpfrontPrices, totalUpfrontPricing, totalRentalPricing };
};

export const getOfferDetailsWithCharges = card => {
  const { name, description } = card || {};
  const dataValue = getOrderItemPrices(card, 'add', '');
  const returnValue = {
    Rental: {
      taxIncludedAmount: 0,
      unit: ''
    },
    OneTimeCharge: {
      taxIncludedAmount: 0,
      unit: ''
    }
  };
  let rentalPrice, upFrontPrice;
  dataValue.map(priceObj => {
    const { price } = priceObj;
    if (isOneTimePrice(priceObj)) {
      // returnValue.OneTimeCharge.taxIncludedAmount += price?.taxIncludedAmount || price?.value || 0;
      returnValue.OneTimeCharge.unit = price.unit;
      upFrontPrice = priceObj;
    }
    if (isRecurringPrice(priceObj)) {
      // returnValue.Rental.taxIncludedAmount += price?.taxIncludedAmount || price?.value || 0;
      returnValue.Rental.unit = price.unit;
      rentalPrice = priceObj;
    }
  });

  // const rentalPrice = (card.productOfferingPrice || []).filter((item) => item.priceType === "Rental" || item.priceType === "Recurring");
  // const upFrontPrice = (card.productOfferingPrice || []).filter((item) => item.priceType === "OneTimeCharge");
  const allRentalPrices = (card.productOfferingPrice || []).filter(item => isRecurringPrice(item));
  const allUpFrontPrices = (card.productOfferingPrice || []).filter(item => isOneTimePrice(item));

  const { totalUpfrontPricing, totalRentalPricing } = calculateTotalCharges(allUpFrontPrices, allRentalPrices);

  returnValue.OneTimeCharge.taxIncludedAmount += totalUpfrontPricing;
  returnValue.Rental.taxIncludedAmount += totalRentalPricing;

  const discountPrices = (card.productOfferingPrice || []).filter(item => item.priceType === 'OneTimeDiscount');
  const inclusions = [];
  const productSpecification = _get(card, 'productSpecification');
  const characteristics = _get(productSpecification, 'productSpecCharacteristic', []);
  characteristics.map(item => {
    inclusions.push({
      title: item.name,
      subText: _get(item, 'productSpecCharacteristicValue[0].value')
    });
  });
  const priceValue = _get(returnValue, 'Rental.taxIncludedAmount');
  const upFrontUnitPriceValue = _get(returnValue, 'OneTimeCharge.taxIncludedAmount');
  const discountPriceValue = discountPrices.length
    ? _get(discountPrices[0], 'price.taxIncludedAmount') || _get(discountPrices[0], 'price.value', 0)
    : 0;
  const specName = _compact([
    productSpecification && _.get(productSpecification, 'technology[0]'),
    productSpecification && _.get(productSpecification, 'LoB'),
    _.get(card, 'businessType[0]', '')
  ]).join('-');
  return {
    isOffer: discountPrices.length ? _get(discountPrices[0], 'name', false) : false,
    name,
    description,
    unit: _get(returnValue, 'Rental.unit') || '',
    priceValue: decimalService(parseFloat(priceValue || 0), 2),
    upFrontUnit: _get(returnValue, 'OneTimeCharge.unit') || '',
    upFrontUnitPriceValue: decimalService(parseFloat(upFrontUnitPriceValue || 0), 2),
    // upFrontUnitPriceValue: decimalService(parseFloat(upFrontUnitPriceValue - discountPriceValue || 0), 2),
    discountPriceValue: discountPriceValue,
    subText: _get(productSpecification, 'name'),
    // rentalName: _get(rentalPrice, 'name'),
    // rentalPeriod: _get(rentalPrice, 'recurringChargePeriodType'),
    // upFrontName: _get(upFrontPrice, 'name'),
    upFrontType: _get(upFrontPrice, 'priceType'),
    rentalType: _get(rentalPrice, 'priceType'),
    inclusions,
    specName,
    allRentalPrices,
    allUpFrontPrices
  };
};
