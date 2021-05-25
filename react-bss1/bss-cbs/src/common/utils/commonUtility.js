/* eslint-disable */
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import _isArray from 'lodash/isArray';
import _toLower from 'lodash/toLower';
import _isFunction from 'lodash/isFunction';
import _isObject from 'lodash/isObject';
import _map from 'lodash/map';
import _omit from 'lodash/omit';
import _transform from 'lodash/transform';
import _isEqual from 'lodash/isEqual';
import _find from 'lodash/find';
import _camelCase from 'lodash/camelCase';
import _has from 'lodash/has';
import _sumBy from 'lodash/sumBy';
import _forEach from 'lodash/forEach';
import dayjs from 'dayjs';
import { getBillingAccountMandatoryCheck } from 'actions/partyInteraction';
import constants from 'common/constants/constants';
import appRoutes from 'common/constants/appRoutes';
import { getSessionData } from 'utils/utilService';
// import { commonFetch } from 'common/services/api';

function getAddressDetails(addressDetails, path) {
  let currentObject = addressDetails;
  for (let key of path.split('/')) {
    if (_.isArray(currentObject)) {
      for (let obj of currentObject) {
        if (obj.medium.type === key) {
          currentObject = obj.medium;
          break;
        }
      }
    } else {
      currentObject = currentObject[key];
    }
  }
  let countryName = _.get(currentObject, 'country', '') ? getMasterDesc(`country/${currentObject.country}`) : '';
  let stateName = _.get(currentObject, 'stateOrProvince', '')
    ? getMasterDesc(`country/${currentObject.country}/province/${currentObject.stateOrProvince}`)
    : '';
  let cityName = _.get(currentObject, 'city', '')
    ? getMasterDesc(
        `country/${currentObject.country}/province/${currentObject.stateOrProvince}/city/${currentObject.city}`
      )
    : '';
  return `${currentObject.streetOne}, ${currentObject.streetTwo},${cityName},${countryName},${stateName}-${currentObject.postcode}`;
}

export const getAddress = (addressDetails, addressType) => {
  return getAddressDetails(addressDetails, `contactMedium/${addressType}`);
};

function getCharacteristicDesc(characteristic, path) {
  let currentObject = characteristic;
  for (let key of path.split('/')) {
    if (_isArray(currentObject)) {
      for (let obj of currentObject) {
        if (obj.name === key) {
          currentObject = obj;
          break;
        }
      }
    } else {
      currentObject = currentObject[key] === undefined ? '' : currentObject[key];
    }
  }
  return currentObject.value;
}

function getSocialMediaDetails(socialMediaDetails, path) {
  let currentObject = socialMediaDetails;
  for (let key of path.split('/')) {
    if (_isArray(currentObject)) {
      for (let obj of currentObject) {
        if (obj.type === key) {
          currentObject = obj;
          break;
        }
      }
    } else {
      currentObject = currentObject[key] === undefined ? '' : currentObject[key];
    }
  }
  return currentObject.href;
}

function getContactMediumDetails(contactMedium, path, objType) {
  let currentObject = contactMedium;
  let keyType = objType;
  for (let key of path.split('/')) {
    if (_isArray(currentObject)) {
      for (let obj of currentObject) {
        if (obj.medium && obj.medium.type === key) {
          currentObject = obj.medium;
          keyType = objType;
          break;
        }
      }
    } else {
      currentObject = currentObject[keyType];
    }
  }
  return currentObject[keyType];
}

export const getContactMediumValue = (contactMedium, type, objType) => {
  return contactMedium && type ? getContactMediumDetails(contactMedium, `medium/${type}`, objType) : '';
};

export const getContactMediumAddress = (contactMedium, addressType) => {
  for (let item of contactMedium) {
    if (item.type === addressType) {
      return item.medium || {};
    }
  }
};

export const getsocialMediaValue = (socialMediaDetails, type) => {
  return getSocialMediaDetails(socialMediaDetails, `externalReference/${type}`);
};

export const getCharacteristicValue = (characteristic, name) => {
  return characteristic && name ? getCharacteristicDesc(characteristic, `characteristic/${name}`) : '';
};

export const getSearchTags = (
  businessTypeArray,
  serviceTypeArray,
  technologyArray,
  categoryArray,
  menuType,
  lobDependency,
  categoryDependency
) => {
  switch (menuType) {
    case 'businessType':
      return businessTypeArray;
    case 'lineOfBusiness':
      return serviceTypeArray;
    case 'technology':
      return technologyArray;
    case 'category':
      return categoryArray;
    case 'subCategory':
      for (const item of categoryArray) {
        if (categoryDependency && item.code === categoryDependency) {
          return _get(item, 'category[0].subCategory', []);
        }
      }
      return [];
    default:
      return [];
  }
};

export const getRiskCategory = (getRiskCategory, code) => {
  const riskCategories = getRiskCategory;
  for (let item of riskCategories) {
    if (item.code === code) {
      return item.name;
    }
  }
  return '';
};

export const relativeDate = date => {
  const currentDate = dayjs();
  const year = currentDate.diff(date, 'year');
  const month = currentDate.diff(date, 'month') - year * 12;
  const day = currentDate.diff(date, 'day');
  const yearString = year === 0 ? '' : `${year} year${year === 1 ? '' : 's'} `;
  const monthString = month === 0 ? '' : `${month} month${month === 1 ? '' : 's'} ago`;
  const dayString = day === 0 ? 'Today' : `${day} day${day === 1 ? '' : 's'} ago`;
  let relativeDateString = month > 0 ? yearString + monthString : dayString;
  return relativeDateString;
};

export const getRelatedParty = (relatedParty, partyName) => {
  return _filter(relatedParty, u => _toLower(u.role) === _toLower(partyName))[0];
};

export const getPreferredContact = contactMedium => {
  return _filter(contactMedium, c => c.preferred === true);
};

export const getUpdatedPayload = (id, type, name, touchedProp, otherProps) => {
  let partyPatch = [];
  let interactionItem = {};
  interactionItem = {
    href: '',
    itemDate: new Date(),
    resolution: 'DONE',
    item: {
      id: id,
      name: name,
      '@type': type,
      '@referredType': type,
      patch: []
    }
  };
  switch (name) {
    case 'contactInfo': {
      const cIPayload = getContactInfoPayload(touchedProp);
      const tempObj = {
        op: 'replace',
        path: '/contactMedium',
        value: cIPayload
      };
      partyPatch.push(tempObj);
      interactionItem.item.patch = partyPatch;
      return interactionItem;
    }
    case 'externalReference': {
      const ExRef = getexternalReferencePayload(touchedProp);
      const tempObj = {
        op: 'replace',
        path: '/externalReference',
        value: ExRef
      };
      partyPatch.push(tempObj);
      interactionItem.item.patch = partyPatch;
      return interactionItem;
    }
    //Future may use
    // case "secondaryContact": {
    //   const secon = getContactInfoPayload(touchedProp);
    //   const tempObj = {
    //     op: "replace",
    //     path: "/contactMedium",
    //     value: secon
    //   };
    //   partyPatch.push(tempObj);
    //   partyPatch.push(otherProps);
    //   interactionItem.item.patch = partyPatch;
    //   return interactionItem;
    // }
    case 'contacPreferrence': {
      const contact = getPreferrencePayload(touchedProp, otherProps);
      const tempObj = {
        op: 'replace',
        path: '/contactMedium',
        value: contact
      };
      partyPatch.push(tempObj);
      interactionItem.item.patch = partyPatch;
      return interactionItem;
    }

    default: {
      for (var prop in touchedProp) {
        if (touchedProp.hasOwnProperty(prop)) {
          const tempObj = {
            op: 'replace',
            path: `/${prop}`,
            value: touchedProp[prop]
          };
          partyPatch.push(tempObj);
        }
      }
      interactionItem.item.patch = partyPatch;
      return interactionItem;
    }
  }
};

function getContactInfoPayload(touchedProp) {
  let tempPayload = [];
  for (const key of Object.keys(touchedProp)) {
    const contactPayload = {
      type: '',
      medium: {
        preferredTime: '',
        preferredLanguage: ''
      },
      preferred: false
    };
    contactPayload.type = key === 'emailAddress' || key === 'alternateEmail' ? 'EmailAddress' : 'TelephoneNumber';
    contactPayload.medium[
      contactPayload.type === 'TelephoneNumber' ? 'number' : key === 'alternateEmail' ? 'emailAddress' : key
    ] = touchedProp[key];
    if (key === 'mobile' || key === 'emailAddress') {
      contactPayload.preferred = true;
      contactPayload.medium.preferredLanguage = 'ENG';
    }
    contactPayload.medium.type = key;
    tempPayload.push(contactPayload);
  }
  tempPayload.push({
    medium: {
      country: 'MU',
      streetTwo: 'swamy vivekananda Road',
      stateOrProvince: 'S1',
      city: 'L94',
      landmark: '',
      postcode: '744101',
      streetOne: '#25, 2nd Cross',
      type: 'MTNSTREET'
    },
    type: 'StreetAddress',
    preferred: false
  });
  return tempPayload;
}

function getexternalReferencePayload(touchedProp) {
  let tempMediaPayload = [];
  for (const key of Object.keys(touchedProp)) {
    const mediaPayload = {
      type: '',
      href: ''
    };
    mediaPayload.type = key;
    mediaPayload.href = touchedProp[key];
    tempMediaPayload.push(mediaPayload);
  }
  return tempMediaPayload;
}

function getPreferrencePayload(mediums, conMed) {
  let tempPayload;
  for (const key of Object.keys(mediums)) {
    if (key === 'preferredMedium') {
      for (let mObj of mediums['preferredMedium']) {
        for (let cObj of conMed.contactMedium) {
          if (cObj.medium.type === mObj) {
            cObj.preferred = true;
            cObj.medium.preferredLanguage = mediums['preferredLanguage'];
            cObj.medium.preferredTime = mediums['preferredTime'];
          }
        }
      }
    }
  }
  for (let mObj of conMed.unselectedList) {
    for (let cObj of conMed.contactMedium) {
      if (cObj.medium.type === mObj) {
        cObj.preferred = false;
      }
    }
  }
  tempPayload = conMed.contactMedium;
  return tempPayload;
}

export const awaitObject = async obj => {
  if (!obj) {
    return obj;
  }
  for (let prop in obj) {
    // If the propriety has a ‘then’ function it’s a Promise
    if (_isFunction(obj[prop].then)) {
      obj[prop] = await obj[prop];
    } else if (_isObject(obj[prop])) {
      obj[prop] = await awaitObject(obj[prop]);
    } else if (_isArray(obj[prop])) {
      for (let i = 0; i < obj[prop].length; i++) {
        obj[prop][i] = await awaitObject(obj[prop][i]);
      }
    }
  }
  return obj;
};

export const getId = entity => {
  return entity && (entity.id || entity._id);
};

export const traverse = (o, fn) => {
  for (var i in o) {
    fn.apply(this, [i, o[i]]);
    if (o[i] !== null && typeof o[i] == 'object') {
      traverse(o[i], fn);
    }
  }
};

export const removeProperty = (entity, property) => {
  for (let prop in entity) {
    if (prop === property) delete entity[prop];
    else if (typeof entity[prop] === 'object') removeProperty(entity[prop]);
  }
};

export const toCamelCase = str => {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
};

export const getLocationNamesCode = (countries, countryCode, provinceCode, cityCode) => {
  let location = null;
  for (let country of countries) {
    if (country.code === countryCode) {
      for (let province of country.province) {
        if (province.code === provinceCode) {
          for (let city of province.city) {
            if (city.code === cityCode) {
              location = {
                city: city.name,
                province: province.name,
                country: country.name
              };
            }
          }
        }
      }
    }
  }
  return location;
};

//get unmatched keys and values between two arrays
export const getObjectDifference = (object, base) => {
  return _transform(object, (result, value, key) => {
    if (!_isEqual(value, base[key])) {
      result[key] = _isObject(value) && _isObject(base[key]) ? difference(value, base[key]) : value;
    }
  });
};

export const getContactDetailsForRequestHeader = contactInfo => {
  const contactDetails = {};
  contactInfo.forEach(item => {
    if (item.type === 'EmailAddress') {
      contactDetails.emailAddress = item.medium.emailAddress;
    } else if (item.type === 'Phone') {
      contactDetails.number = item.medium.number;
    }
  });
  return contactDetails;
};

export const getOldAndNewUpdatedDetails = getInteractionItemData => {
  let newItemArray = [];
  let oldItemArray = [];
  getInteractionItemData.map(data => {
    if (
      data.role === 'new' &&
      (data.item['@type'] === 'Individual' ||
        data.item['@type'] === 'Customer' ||
        data.item['@type'] === 'BillingAccount')
    ) {
      newItemArray.push(data.item);
    } else if (
      data.role === 'old' &&
      (data.item['@type'] === 'Individual' ||
        data.item['@type'] === 'Customer' ||
        data.item['@type'] === 'BillingAccount')
    ) {
      oldItemArray.push(data.item);
    }
  });
  return { newItemArray, oldItemArray };
};

export const removeBlackList = (array, blackList) => {
  return _map(array, obj => _omit(obj, blackList));
};

export const unMatchedUserData = (newData, oldData, result) => {
  Object.keys(newData).forEach(key => {
    if (typeof newData[key] !== 'object') {
      if (newData[key] != oldData[key])
        result.push({ role: 'new', [key]: newData[key] }, { role: 'old', [key]: oldData[key] });
    } else {
      unMatchedUserData(newData[key], oldData[key], result);
    }
  }, result);

  return result;
};

export const compareOldAndNewUpdatedDetails = getInteractionItemData => {
  let newDataArray = [];
  let oldDataArray = [];
  const blackList = [
    '@baseType',
    '@type',
    'modifiedDate',
    'createdDate',
    'id',
    'href',
    'name',
    '@schemaLocation',
    'areaOfInterest',
    'contactMedium',
    'relatedParty',
    'externalReference',
    'highestQualification',
    'suffix',
    'title',
    'occupation',
    'incomeRange',
    'vip'
  ];
  const data = getOldAndNewUpdatedDetails(getInteractionItemData);
  let newData = removeBlackList(data.newItemArray, blackList);
  let oldData = removeBlackList(data.oldItemArray, blackList);
  newDataArray.push(newData);
  oldDataArray.push(oldData);
  const updatedData = unMatchedUserData(newDataArray, oldDataArray, []);
  return updatedData;
};

export const getBillingPreferenceUpdatedDetails = getInteractionItemData => {
  let newDataArray = [];
  let oldDataArray = [];
  const blackList = [
    '@baseType',
    '@type',
    'modifiedDate',
    'createdDate',
    'id',
    'href',
    'name',
    'fullName',
    'familyName',
    'givenName',
    'middleName',
    '@schemaLocation',
    'billStructure',
    'taxPlanId',
    'relatedParty',
    'contact',
    'accountID',
    'individualIdentification',
    'areaOfInterest',
    'contactMedium',
    'relatedParty',
    'externalReference',
    'highestQualification',
    'suffix',
    'title',
    'birthDate',
    'occupation',
    'incomeRange',
    'customerCategory',
    'customerSubCategory',
    'gender',
    'nationality',
    'maritalStatus',
    'vip'
  ];
  const data = getOldAndNewUpdatedDetails(getInteractionItemData);
  let newData = removeBlackList(data.newItemArray, blackList);
  let oldData = removeBlackList(data.oldItemArray, blackList);
  newDataArray.push(newData);
  oldDataArray.push(oldData);
  const updatedData = unMatchedUserData(newDataArray, oldDataArray, []);
  return updatedData;
};

export const getVipsTitlesUpdatedDetails = getInteractionItemData => {
  let newDataArray = [];
  let oldDataArray = [];
  const blackList = [
    '@baseType',
    '@type',
    'modifiedDate',
    'createdDate',
    'id',
    'href',
    'name',
    '@schemaLocation',
    'areaOfInterest',
    'birthDate',
    'contactMedium',
    'relatedParty',
    'fullName',
    'givenName',
    'middleName',
    'familyName',
    'gender',
    'externalReference',
    'highestQualification',
    'individualIdentification',
    'maritalStatus',
    'customerCategory',
    'customerSubCategory',
    'nationality',
    'occupation',
    'incomeRange'
  ];
  const data = getOldAndNewUpdatedDetails(getInteractionItemData);
  let newData = removeBlackList(data.newItemArray, blackList);
  let oldData = removeBlackList(data.oldItemArray, blackList);
  newDataArray.push(newData);
  oldDataArray.push(oldData);
  const updatedData = unMatchedUserData(newDataArray, oldDataArray, []);
  return updatedData;
};

export const getDemographicUpdatedDetails = getInteractionItemData => {
  let newDataArray = [];
  let oldDataArray = [];
  const blackList = [
    'id',
    'href',
    '@type',
    'contactMedium',
    'gender',
    'areaOfInterest',
    'individualIdentification',
    'fullName',
    'givenName',
    'middleName',
    'familyName',
    'title',
    'relatedParty',
    'suffix',
    'birthDate',
    'externalReference',
    'createdDate',
    'nationality',
    '@baseType',
    'modifiedDate',
    'vip',
    'name',
    '@schemaLocation',
    'maritalStatus',
    'customerCategory',
    'customerSubCategory'
  ];
  const data = getOldAndNewUpdatedDetails(getInteractionItemData);
  let newData = removeBlackList(data.newItemArray, blackList);
  let oldData = removeBlackList(data.oldItemArray, blackList);
  newDataArray.push(newData);
  oldDataArray.push(oldData);
  const updatedData = unMatchedUserData(newDataArray, oldDataArray, []);
  return updatedData;
};

export const customerSubCategoryOldAndNew = (customerSubCategory, updatedCustomerDetails) => {
  let result = [];
  let customerSubCategorys = [];
  customerSubCategory.map(data => {
    customerSubCategorys.push(data);
  });
  let propsArray = [];
  customerSubCategorys.forEach(props => {
    propsArray.push(props);
  });
  let subArray = [];
  propsArray.forEach(data => {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object') {
        subArray.push(data[key].subCategory);
      }
    });
  });
  let newVal = {};
  let oldVal = {};

  updatedCustomerDetails.forEach(upData => {
    if (upData.role === 'new') {
      newVal.customerSubCategory = upData.customerSubCategory;
    }
    oldVal.customerSubCategory = upData.customerSubCategory;
  });
  subArray.forEach(data => {
    Object.values(newVal).forEach(upData => {
      Object.values(data).forEach(key => {
        if (upData == key.code) {
          result.push({ role: 'new', customerSubCategory: key.name });
        }
      });
    });
    Object.values(oldVal).forEach(upData => {
      Object.values(data).forEach(key => {
        if (upData == key.code) {
          result.push({ role: 'old', customerSubCategory: key.name });
        }
      });
    });
  });
  return result;
};

export const generateFullName = (givenName, middleName, familyName) => {
  let fullName = '';
  if (givenName) fullName = givenName.trim();
  if (middleName) fullName = (fullName + ' ' + middleName.trim()).trim();
  if (familyName) fullName = (fullName + ' ' + familyName.trim()).trim();
  return fullName;
};

export const prevalidationMsgCheck = (response, product) => {
  if (Array.isArray(response)) {
    let errMsgsArray = response.filter(flag => flag.result === 'FAILED' || flag.result === 'ERROR');
    let err = '';
    if (errMsgsArray.length > 0) {
      errMsgsArray.forEach(errMsg => {
        switch (errMsg.name) {
          case 'PendingOrderCheck':
            err = product.productOffering.name + ' is in progress';
            break;
          case 'ProductStatusCheckRule':
            err = product.productOffering.name + ' status check failed';
            break;
          case 'CustomerBlackListValidation':
            err = product.productOffering.name + ' Customer Black List Validation failed';
            break;
          case 'SimChangeFrequencyValidation':
            err = product.productOffering.name + ' SimChange Frequency Validation failed';
            break;
          default:
            err = 'PreValidation Process Failed';
        }
      });
      return err;
    } else {
      return 'SUCCESS';
    }
  } else {
    return 'PreValidation Process Failed';
  }
};

export const handleUndefinedObjectValues = options => {
  return Object.values(options).some(value => value === 'undefined' || value === '');
};

export const getTempCustomerInteractionItem = () => ({
  itemDate: new Date().toISOString(),
  item: {
    name: '',
    '@baseType': 'PartyRole',
    '@type': constants.PARTY_INTERACTION_TYPES.CUSTOMER,
    customerType: 'individual',
    engagedParty: {
      contactMedium: [],
      '@baseType': 'Party',
      '@type': constants.PARTY_INTERACTION_TYPES.INDIVIDUAL
    }
  }
});

export const getContactMediumMobile = number => {
  const mobile = {
    medium: {
      number,
      type: 'mobile'
    },
    type: constants.contactMediumTypes.PHONE,
    preferred: true
  };
  return mobile;
};

export const getContactMediumEmail = emailAddress => {
  const email = {
    medium: {
      emailAddress,
      type: 'emailAddress'
    },
    type: constants.contactMediumTypes.EMAILADDRESS,
    preferred: true
  };
  return email;
};

export const getBusinessType = partyInteraction => {
  const productOrderItem = _find(partyInteraction.interactionItem, {
    item: { '@type': constants.PARTY_INTERACTION_TYPES.PRODUCT_ORDER }
  });

  const businessType = _get(productOrderItem, 'item.orderItem[0].product.businessType', null);
  if (businessType) {
    return businessType;
  } else {
    const businessTypes = _get(productOrderItem, 'item.orderItem[0].productOffering.businessType', []);
    return _isArray(businessTypes) ? businessTypes[0] : businessTypes;
  }
};

export const billingAccountMandatoryCheck = async (activeInteraction, activeCustomerRequest, customerType) => {
  let isBillingAccReq = false;
  if (activeCustomerRequest === 'Addplanproductrequest') {
    const businessType = getBusinessType(activeInteraction);
    const payload = {
      JsonName: 'billingAccountMandatory',
      billingAccountMandatory: {
        customerType,
        businessType
      }
    };
    const response = await getBillingAccountMandatoryCheck(payload);
    isBillingAccReq = _get(response, 'billingAccountMandatory.isRequired', false);
  }
  return isBillingAccReq;
};

// export const checkForDuplicateId = async payload => {
//   let error;
//   if (payload) {
//     const response = await commonFetch(
//       'customer',
//       'POST',
//       payload,
//       'validate/duplicateIdentificationCheck'
//     );
//     if (_get(response, 'result', '') === 'FAIL') {
//       error = 'Another Customer exists with this ID';
//       return error;
//     }
//   }
//   return false;
// };

export const getPerformanceDates = (range = 1) => {
  let performanceDates = {};
  let date1 = new Date();
  date1 = date1.toISOString().substr(0, 10);
  date1 = `${date1}T00:00:01.342Z`;

  let date2 = new Date(new Date().setDate(new Date().getDate() - range));
  date2 = date2.toISOString().substr(0, 10);
  date2 = `${date2}T00:00:01.342Z`;
  if (range > 1) {
    performanceDates = {
      todayDate: date2,
      yesterdayDate: date1
    };
  } else {
    performanceDates = {
      todayDate: date1,
      yesterdayDate: date2
    };
  }

  return performanceDates;
};

// export const getSRUrl = (type, customerId) => {
//   const requestName = _camelCase(type); // used in old wizard
//   const url = [
//     constants.serviceRequestType.CHANGE_OF_PLAN,
//     constants.serviceRequestType.RESET_PASSWORD,
//     constants.serviceRequestType.CHANGE_OF_SERVICE_ID,
//     constants.serviceRequestType.SOFT_SUSPENSION,
//     constants.serviceRequestType.SUSPENSION,
//     constants.serviceRequestType.TERMINATION,
//     constants.serviceRequestType.REVOKE_SUSPENSION,
//     constants.serviceRequestType.PRE_TO_POST_REQUEST,
//     constants.serviceRequestType.POST_TO_PRE_REQUEST,
//     constants.serviceRequestType.BAR_UNBAR,
//     constants.serviceRequestType.ADD_VAS,
//     constants.serviceRequestType.CHANGE_OF_LANGUAGE,
//     constants.serviceRequestType.SERVICE_CLASS_CHANGE,
//     constants.serviceRequestType.DUNNING,
//     constants.serviceRequestType.MANAGE_VAS.TERMINATE,
//     constants.serviceRequestType.TRANSFER_OF_OWNERSHIP,
//     constants.serviceRequestType.REGISTRATION,
//     constants.serviceRequestType.SIM_CHANGE
//   ].includes(type)
//     ? `${appRoutes.serviceRequest}/${type}?customerId=${customerId}`
//     : `${appRoutes.customerRequest.customerRequest}/${requestName}?customerId=${customerId}`;

//   return url;
// };

export const convertToOldPriceStructure = pop => {
  const priceUnit = _has(pop, 'price.unit') ? _get(pop, 'price.unit', '') : _get(pop, 'price.units', '');

  if (_has(pop, 'price.dutyFreeAmount')) {
    return { ...pop, price: { ...pop.price, unit: priceUnit } };
  }
  const price = {
    dutyFreeAmount: _get(pop, 'price.value', 0),
    percentage: _get(pop, 'percentage', 0),
    unit: priceUnit
  };
  const totalTax = _sumBy(_get(pop, 'tax'), tax => _get(tax, 'taxAmount.value', 0));
  price.taxIncludedAmount = price.dutyFreeAmount + totalTax;
  price.taxRate = totalTax === 0 ? 0 : (totalTax * 100) / price.dutyFreeAmount;
  return {
    ...pop,
    price
  };
};

export const findItem = (list, code) => _find(list, { code }) || {};

export const getItemNameByCode = (list, code, defaultValue = '') => {
  const item = findItem(list, code);
  return _.get(item, 'name', defaultValue);
};

export const getItemCodeByName = (list, name) => {
  const item = _find(list, { name: _toLower(name) }) || {};
  return _.get(item, 'code', '');
};

/**
 * Check whether the price is of priceType ['OneTimeCharge', 'Fee', 'Penalty', 'Charge', 'Deposit']
 * @param {*} price The ProductOfferingPrice
 * Usage:
 *  isUpfront = isOneTimePrice(price); // returns Boolean
 */
export function isOneTimePrice(price) {
  return ['OneTimeCharge', 'Fee', 'Penalty', 'Charge', 'Deposit'].indexOf(_.get(price, 'priceType')) >= 0;
}

/**
 * Check whether the price is of priceType ['Recurring', 'Rental', 'AdvancedRental', 'Installment']
 * @param {*} price The ProductOfferingPrice
 * Usage:
 *  isRecurring = isRecurringPrice(price); // returns Boolean
 */
export function isRecurringPrice(price) {
  return ['Recurring', 'Rental', 'AdvancedRental', 'Installment'].indexOf(_.get(price, 'priceType')) >= 0;
}

export const getCustomerCategories = (partyTypes, customerType) => {
  const item = findItem(partyTypes, customerType);
  return _get(item, 'category', []);
};

export const getCustomerSubCategories = (categories, category) => {
  const item = findItem(categories, category);
  return _get(item, 'subCategory', []);
};

export const getCities = (countries = []) => {
  const cities = [];
  for (let country of countries) {
    for (let province of country.province) {
      for (let city of province.city) {
        cities.push({
          ...city,
          province: {
            name: province.name,
            code: province.code
          },
          country: {
            name: country.name,
            code: country.code
          }
        });
      }
    }
  }
  return cities.sort();
};

export const poAddressToPayloadFormat = (currentAddress = {}) => {
  return {
    type: 'Address',
    medium: {
      city: currentAddress.POCity,
      country: currentAddress.POCountry,
      postcode: currentAddress.POBox,
      stateOrProvince: currentAddress.POState,
      addressLine1: currentAddress.POaddressLine1,
      type: currentAddress.addressFormat,
      landmark: currentAddress.POlandmark
    }
  };
};

export const poAddressToPoBoxFormat = (address = {}) => {
  return {
    addressFormat: 'POBox',
    POaddressLine1: address.medium.addressLine1,
    POlandmark: address.medium.landmark,
    POCity: address.medium.city,
    POBox: address.medium.postcode,
    POState: address.medium.stateOrProvince,
    POCountry: address.medium.country
  };
};

export const poAddressToGeographicalAddress = (address = {}) => {
  const formattedAddress = {
    '@type': 'GeographicAddress',
    role: 'InstallationAddress',
    addressLine1: address.POaddressLine1,
    postcode: address.POBox,
    city: address.POCity,
    stateOrProvince: address.POState,
    country: address.POCountry,
    landmark: address.POlandmark
  };
  return formattedAddress;
};

export const downloadBlob = (blob, name) => {
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = name;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

export const isValidRegEx = regEx => {
  if (!regEx) return false;
  try {
    new RegExp(regEx);
    return true;
  } catch (e) {
    return false;
  }
};

// DUNNING PREVALIDATION CHECK
export const dunningPreValidationCheck = (customerDetails, account) => {
  // ACCOUNT SHOULD BE ACTIVE
  const accountState = _get(account, 'state', '') === constants.status.ACTIVE;

  // CUSTOMER SHOULD BE ACTIVE
  const customerStatus = _get(customerDetails, 'status', '') === constants.status.ACTIVE;

  // CUSTOMER SHOULD BE VIP
  const vip = _get(customerDetails, 'engagedParty.vip', false);
  if (!accountState) return `Account status is ${_get(account, 'state', '')}`;
  else if (!customerStatus) return `Customer status is ${_get(customerDetails, 'state', '')}`;
  // else if (!vip) return `Not VIP Customer`;
  else return 'SUCCESS';
};

export const updateDiffFinder = (oldObj, newObj, isInsideArray) => {
  const toType = obj => {
    return {}.toString
      .call(obj)
      .match(/\s([a-zA-Z]+)/)[1]
      .toLowerCase();
  };

  const diff1 = (oldObj, newObj, isInsideArray) => {
    const oldObjType = toType(oldObj);
    const newObjType = toType(newObj);
    if (oldObjType !== newObjType) {
      return newObj === undefined ? null : newObj; // for deleting the key, we send null
    }
    if (oldObjType === 'object') {
      const diffObj = {};
      const fullDiffObj = {};
      for (const key in oldObj) {
        if (oldObj.hasOwnProperty(key)) {
          fullDiffObj[key] = oldObj[key];
          const diffValue = diff1(oldObj[key], newObj[key], isInsideArray);
          if (diffValue !== undefined) {
            diffObj[key] = diffValue;
            fullDiffObj[key] = diffValue;
          }
        }
      }
      for (const key in newObj) {
        if (newObj.hasOwnProperty(key) && !oldObj.hasOwnProperty(key)) {
          diffObj[key] = newObj[key];
          fullDiffObj[key] = newObj[key];
        }
      }
      return Object.keys(diffObj).length > 0 ? (isInsideArray ? fullDiffObj : diffObj) : undefined;
    }
    if (oldObjType === 'array') {
      if (oldObj.length !== newObj.length) {
        return newObj;
      }
      const diffArray = [];
      let arrayChanged = false;
      for (let i = 0; i < oldObj.length; i++) {
        const diffValue = diff1(oldObj[i], newObj[i], true);
        diffArray.push(diffValue === undefined ? oldObj[i] : diffValue);
        if (diffValue !== undefined) {
          arrayChanged = true;
        }
      }
      return arrayChanged ? diffArray : undefined;
    }

    return oldObj === newObj ? undefined : newObj;
  };
  return diff1(oldObj, newObj, isInsideArray);
};

export const stringToTitleCase = str => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const removeEmptyDataFromPartyInteraction = (partyInteraction, type) => {
  switch (type) {
    case constants.PARTY_INTERACTION_TYPES.PRODUCT_ORDER:
      for (const [index, interaction] of partyInteraction.interactionItem.entries()) {
        if (
          interaction.item['@type'] === constants.PARTY_INTERACTION_TYPES.PRODUCT_ORDER &&
          interaction.item.orderItem.length === 0
        ) {
          partyInteraction.interactionItem.splice(index, 1);
        }
      }
      return partyInteraction;
    default:
      return partyInteraction;
  }
};

export const fetchProductStatus = (activeAccountId, activeProductId) => {
  let status = '';
  const userInfo = getSessionData('userInfo') || {};
  const accounts = _.get(userInfo, 'assets.customer[0].account', []);
  _forEach(accounts, account => {
    if (account.id === activeAccountId) {
      const products = _.get(account, 'product', []);
      _forEach(products, product => {
        if (product.id === activeProductId) {
          status = _.get(product, 'status');
        }
      });
    }
  });
  return status;
};

export const getFormattedPermissionsArray = permissionsString => {
  const formattedArray = permissionsString.split(',');
  return formattedArray;
};

// overflow:hidden disables the scrolling on a desktop browser
// position: fixed is additionally needed for mobile devices
export const lockBodyScroll = () => {
  document.body.setAttribute('style', 'width: 100%;');
};

// overflow:visible ables the scrolling on a desktop browser
// position: static is additionally needed for mobile devices
export const unlockBodyScroll = () => {
  document.body.setAttribute('style', 'overflow: visible; position: static;');
};

export const deepMergeObjectSum = (obj1, obj2) => {
  return Object.keys(obj1).reduce((acc, key) => {
    if (typeof obj2[key] === 'object') {
      acc[key] = deepMergeObjectSum(obj1[key], obj2[key]);
    } else if (obj2.hasOwnProperty(key) && !isNaN(parseFloat(obj2[key]))) {
      acc[key] = obj1[key] + obj2[key];
    }
    return acc;
  }, {});
};

export const deepMergeObjectSub = (obj1, obj2) => {
  return Object.keys(obj1).reduce((acc, key) => {
    if (typeof obj2[key] === 'object') {
      acc[key] = deepMergeObjectSub(obj1[key], obj2[key]);
    } else if (obj2.hasOwnProperty(key) && !isNaN(parseFloat(obj2[key]))) {
      acc[key] = obj1[key] - obj2[key];
    }
    return acc;
  }, {});
};

export const getProductPlace = productsData => {
  const productRltnshp = _get(productsData, '[0].productRelationship', []);
  const rltnshipWithPlaceArr = _filter(productRltnshp, item => {
    return _get(item, 'product.place');
  });
  const placeArr = rltnshipWithPlaceArr.map(i => {
    return i.product.place;
  });
  const finalPlaceArr = [].concat.apply([], placeArr);
  const productPlace = _find(finalPlaceArr, item => {
    return _get(item, '@type', '') === 'GeographicAddress';
  });
  return { productPlace };
};

export const convertFarsiDigits = value => {
  return value.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
};

export const emailArrayFromCommaSeparated = (commaSeparatedEmails = '') => {
  const emails = commaSeparatedEmails.split(',');
  const result = [];
  if (emails.length) {
    for (const email of emails) {
      result.push({
        medium: { emailAddress: email.trim() },
        preferred: true,
        type: constants.contactMediumTypes.EMAILADDRESS
      });
    }
  }
  return result;
};
