import _get from 'lodash/get';
import _find from 'lodash/find';

const getMasterData = store => {
  return _get(store, 'app.masterData', {});
};

const getMasterDataArray = (store, path, type = 'clmMasterData') => {
  const masterData = getMasterData(store);
  let currentObject = masterData[type];
  for (const key of path.split('/')) {
    if (_.isArray(currentObject)) {
      for (const obj of currentObject) {
        if (obj.code === key) {
          currentObject = obj;
          break;
        }
      }
    } else {
      currentObject =
        !currentObject || currentObject[key] === undefined
          ? ''
          : currentObject[key];
    }
  }
  return _.sortBy(currentObject, 'name');
};

const getCommonMaster = (store, path, type = 'clmMasterData') => {
  const masterData = getMasterData(store);
  let currentObject = masterData[type];
  for (const key of path.split('/')) {
    if (_.isArray(currentObject)) {
      for (const obj of currentObject) {
        if (obj.code === key) {
          currentObject = obj;
          break;
        }
      }
    } else if (currentObject) {
      currentObject = currentObject[key] || {};
    }
  }
  return currentObject;
};

export const customerRequestReasonListSelector = (store, requestType) => {
  return getMasterDataArray(store, `customerRequest/${requestType}/reason`);
};

export const getCustomerRequestsSelector = store => {
  return getMasterDataArray(store, `customerRequest`);
};

export const getCountriesSelector = store => {
  return getMasterDataArray(store, 'country/');
};

export const getCurrencyDataSelector = store => {
  return getMasterDataArray(store, `currency/`);
};

export const getDunningDataSelectors = store => {
  return getMasterDataArray(store, 'dunningSchedule', 'bssCbsMasterData');
};

export const getBillCycleSpecificationSelectors = store => {
  return getMasterDataArray(store, 'billPeriodicity', 'bssCbsMasterData');
};

export const getLanguagesDataSelectors = store => {
  return getMasterDataArray(store, 'preferredLanguage/');
};

export const getMaritalStatusDataSelectors = store => {
  return getMasterDataArray(store, 'maritalStatus');
};

export const getGenderSelectors = store => {
  return getMasterDataArray(store, 'gender');
};

export const getRelationshipListSelectors = store => {
  return getMasterDataArray(store, `relationship`);
};

export const getNationalityListSelectors = store => {
  return getMasterDataArray(store, 'nationality');
};

export const getBusinessTypeSelector = store => {
  return getMasterDataArray(store, 'businessType');
};

export const getCompanyTypeSelector = store => {
  return getMasterDataArray(store, 'companyType');
};

export const getkeyAccountGroupSelector = store => {
  return getMasterDataArray(store, 'keyAccountGroup');
};

export const getServiceTypeSelector = store => {
  return getMasterDataArray(store, 'serviceType');
};

export const getDocumentPurposeSelectors = store => {
  return getMasterDataArray(store, `purpose`);
};

export const getDocumentTypeSelector = store => {
  return getMasterDataArray(store, `documentType`);
};

export const getRiskCategorySelectors = store => {
  return getMasterDataArray(store, 'riskCategory/');
};

export const getHighestQualificationsSelector = store => {
  return getMasterDataArray(store, `highestQualification`);
};

export const getOccupationSelector = store => {
  return getMasterDataArray(store, `occupation`);
};

export const getIndustrySelector = store => {
  return getMasterDataArray(store, 'industry');
};

export const getMediumSelector = store => {
  return getMasterDataArray(store, 'preferredMedium');
};

export const getPartyTypesSelector = store => {
  return getMasterDataArray(store, 'partyType');
};

export const getPaymentMethodSelector = store => {
  return getMasterDataArray(store, 'paymentMethod');
};

export const getTransactionTypeSelector = store => {
  return getMasterDataArray(store, 'transactionType');
};

export const getRelationDescSelector = store => {
  return getMasterDataArray(store, 'relationship');
};

export const getLanguageSelector = store => {
  return getMasterDataArray(store, 'preferredLanguage');
};

export const getCurrencySelector = store => {
  return getMasterDataArray(store, 'currency');
};

export const getPartyTypeSelector = store => {
  return getMasterDataArray(store, 'partyType');
};

export const getDefaultCurrencySelector = store => {
  const currencies = getCommonMaster(store, 'currency');
  const defaultCurrency = _find(currencies, { default: true });
  return _get(defaultCurrency, 'code', '');
};

export const getIncomeRangeSelector = (store, value) => {
  return getMasterDataArray(store, `incomeRange/${value}`);
};

export const getCitySelector = store => {
  return getMasterDataArray(store, 'city');
};

export const getMaritalStatusSelector = store => {
  return getMasterDataArray(store, 'maritalStatus');
};

export const getTaxPoliciesSelectors = store => {
  return getMasterDataArray(store, 'taxPlan', 'bssCbsMasterData');
};

export const getRecurringPeriodSelector = store => {
  return getMasterDataArray(store, 'periodShortFormat');
};

export const getGprsSettingSelector = store => {
  return getMasterDataArray(store, 'gprsSetting');
};

export const getCardType = store => {
  return getMasterDataArray(store, 'cardType');
};

export const getBankList = store => {
  return getMasterDataArray(store, 'bank');
};

export const getContractTypeSelector = (store) => {
  return getMasterDataArray(store, `contractType`);
};

/**
 * Trouble Ticket Master Data Starts From Here
 */
const troubleTicket = 'troubleTicketData';

export const getServiceTypeListSelector = store => {
  return getMasterDataArray(store, 'serviceType');
};

export const getTroubleTicketTypeListSelector = store => {
  return getMasterDataArray(store, 'ticketType', troubleTicket);
};

export const getTroubleTicketSeverityListSelector = store => {
  return getMasterDataArray(store, 'customerType', troubleTicket);
};

export const getDataTypeListSelector = store => {
  return getMasterDataArray(store, 'DataType', troubleTicket);
};

export const getXDirectoryLevelSelector = store => {
  return getMasterDataArray(store, 'xDirLevel');
};

export const getOutletsSelector = store => {
  return getMasterDataArray(store, 'outlets');
};

export const getSupportTopicSelector = store => {
  return getMasterDataArray(store, 'supportTopic');
};

export const getCommunicationLinksSelector = (store, linkType) => {
  return getMasterDataArray(store, `communicationLinks/${linkType}`);
};