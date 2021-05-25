import _get from 'lodash/get';
import _groupBy from 'lodash/groupBy';

const getPriceSections = interaction => {
  const paymentDetails = {
    rentalTotal: 0,
    oneTimeTotal: 0,
    priceSummary: {},
    unit: ''
  };
  const orderTotalPrice = _get(interaction, 'item.orderTotalPrice');
  const priceSum = _groupBy(orderTotalPrice || [], 'priceType');
  paymentDetails.priceSummary = priceSum;
  paymentDetails.unit =
    _get(priceSum, 'oneTimeCharge[0].price.taxIncludedAmount.unit') ||
    _get(priceSum, 'Rental[0].price.taxIncludedAmount.unit') ||
    '';

  // merging all onetime charges into 1 key value pair
  if (priceSum.oneTimeCharge && priceSum.oneTimeCharge.length > 1) {
    paymentDetails.oneTimeTotal = priceSum.oneTimeCharge.reduce(
      (itema, itemb) =>
        parseInt(_get(itema, 'price.taxIncludedAmount.value') || '0') +
        parseInt(_get(itemb, 'price.taxIncludedAmount.value') || '0')
    );
  } else if (priceSum.oneTimeCharge) {
    paymentDetails.oneTimeTotal = _get(priceSum, 'oneTimeCharge[0].price.taxIncludedAmount.value') || 0;
  } else {
    paymentDetails.oneTimeTotal = 0;
  }
  // merging all rental charges into 1 key value pair
  if (priceSum.Rental && priceSum.Rental.length > 1) {
    paymentDetails.rentalTotal = priceSum.Rental.reduce(
      (itema, itemb) =>
        parseInt(_get(itema, 'price.taxIncludedAmount.value') || '0') +
        parseInt(_get(itemb, 'price.taxIncludedAmount.value') || '0')
    );
  } else if (priceSum.Rental) {
    paymentDetails.rentalTotal = _get(priceSum, 'Rental[0].price.taxIncludedAmount.value') || 0;
  } else {
    paymentDetails.rentalTotal = 0;
  }

  return paymentDetails;
};

export default function getInteractionItem(responseData = {}) {
  const { interactionItem = [], relatedParty = [], createdDate = null, channel = [] } = responseData;
  const interactionItemData = {};
  const storeData = (keyVale, dataValue) => {
    if (!interactionItemData[keyVale]) {
      interactionItemData[keyVale] = [];
    }
    interactionItemData[keyVale].push(dataValue);
  };

  (channel || []).forEach(item => {
    storeData('channel', item);
  });

  (interactionItem || []).forEach(interaction => {
    let type = (_get(interaction, 'item.@type') || '').toUpperCase();
    const roleType = _get(interaction, 'item.roleType', '').toUpperCase();
    if (type === 'PARTYROLE') {
      type = `${type}_${roleType}`;
    }
    switch (type) {
      case 'CUSTOMER':
        storeData('customer_details', _get(interaction, 'item'));
        storeData('customer_info', _get(interaction, 'item.engagedParty'));
        break;
      case 'ORGANIZATION':
        storeData('customer_info', _get(interaction, 'item'));
        break;
      case 'BILLINGACCOUNT':
        storeData('billing_details', _get(interaction, 'item'));
        break;
      case 'POSTALADDRESS':
        if (_get(interaction, 'item.role') === 'installationAddress') {
          storeData('installation_details', _get(interaction, 'item'));
        }
        break;
      case 'DOCUMENT':
        storeData('documents', _get(interaction, 'item'));
        break;
      case 'PRODUCTORDER':
        const item = _get(interaction, 'item');
        const { orderItem = [] } = item;
        if (orderItem && orderItem.length && orderItem[0].product) {
          storeData('service_details', item);
        }
        const businessType = _get(interaction, 'item.orderItem[0].product.businessType');
        if (interactionItem.customer_details) {
          interactionItem.customer_details[0].businessType = businessType;
        }
        storeData('productPayments', getPriceSections(interaction));
        storeData('productOffering', _get(interaction, 'item.orderItem[0].productOffering'));
        break;
      case 'PAYMENT':
        storeData('payments', _get(interaction, 'item'));
        break;
      case 'PARTYROLE_CONTACTPERSON':
        storeData('primary_contact', _get(interaction, 'item'));
        break;
      case 'PARTYROLE_PROFILEOWNER':
        storeData('profileOwner_details', _get(interaction, 'item'));
        break;
      default:
        break;
    }
  });
  (relatedParty || []).forEach(data => {
    const type = (_get(data, '@referredType') || '').toUpperCase();
    switch (type) {
      case 'CUSTOMER':
        storeData('customer_details', data);
        break;
      case 'INDIVIDUAL':
        storeData('user_details', { ...data, createdDate });
        break;
      case 'ORGANIZATION':
        storeData('user_details', { ...data, createdDate });
        break;
      default:
        break;
    }
  });

  interactionItemData.subscriptionDetails = {
    status: _get(responseData, 'status'),
    id: _get(responseData, 'id'),
    productOrderId: _get(responseData, 'productOrderId[0]'),
    type: _get(responseData, '@type')
  };

  return interactionItemData;
}
