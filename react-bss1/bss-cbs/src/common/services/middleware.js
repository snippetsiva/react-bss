import config from 'config';
import constants from 'common/constants/constants';
import { getSessionData } from 'utils/utilService';
const { apiConfig } = config.dev;
import * as _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import _isFunction from 'lodash/isFunction';
import { queryEntityByNetwork } from 'common/services/api';
import { get } from 'axios';
import gql from 'graphql-tag';
import { FETCH_ACTIVE_TERMINATED_VAS_DETAILS } from 'queries/addVasProductServiceRequest';

const getAccessToken = async () => {
  return _.get(getSessionData(constants.userInfo), constants.oAuth.ACCESS_TOKEN);
};

export const fetchBillingAccountDetails = async id => {
  const accessToken = await getAccessToken();
  let headers = {
    Authorization: `Bearer ${accessToken}`,
    isauthorizationrequired: 'true',
    'Content-Type': 'application/json',
    pragma: 'no-cache',
    'cache-control': 'no-cache'
  };
  const request = {
    method: 'GET',
    headers
  };
  const url = `${apiConfig.accountManagement.href}/account/${id}`;
  let res = await get(url, request);

  // return _.get(res, 'data[0]', []);
  // const res = await restAPI(`${apiConfig.accountManagement.href}/account/${id}`);
  _.each(_.get(res, 'data.relatedParty', []), item => {
    if (item['@referredType'] === 'AccountOwner') {
      item['@referredType'] = 'AccountManager';
    }
  });
  // return res.data;
  return _.get(res, 'data', []);

  /*  return fetch(`${apiConfig.accountManagement.href}/account/${id}`)
    .then(res => res.json())
    .then(res => {
      _.each(_.get(res, 'relatedParty', []), item => {
        if (item['@referredType'] === 'AccountOwner') {
          item['@referredType'] = 'AccountManager';
        }
      });
      return res;
    }); */
};

export const accountUpdateRequest = async payload => {
  const res = await restAPI(`${apiConfig.accountUpdateRequest.href}`, 'POST', payload);
  return res.data;
  // const accessToken = getAccessToken();
  // try {
  //   let res = await fetch(`${apiConfig.accountUpdateRequest.href}`, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(payload)
  //   });
  //   if (res.status >= 200 && res.status <= 299) {
  //     res = await res.json();
  //     return res;
  //   } else if (res.status >= 400 && res.status <= 499) {
  //     console.log('error', res.status);
  //   }
  //   return res;
  // } catch (e) {
  //   return e;
  // }
};

export const getCustomerDetails = async customerId => {
  const res = await restAPI(`${apiConfig.customerManagement.href}/${customerId}`);
  return _.get(res, 'data[0]', {});
  // return fetch(`${apiConfig.customerManagement.href}/${customerId}`)
  //   .then(res => res.json())
  //   .then(res => res[0] || {});
};
export const getCustomerProducts = async customerId => {
  const res = await restAPI(
    `${apiConfig.productManagement.href}?relatedParty.id=${customerId}&productOffering.category.name=Plan&limit=${constants.productInventoryManagementProductSize}&offset=0`
  );
  return res.data || [];
  // return fetch(
  //   `${apiConfig.productManagement.href}?relatedParty.id=${customerId}&productOffering.category.name=Plan&limit=${constants.productInventoryManagementProductSize}&offset=0`
  // ).then(res => {
  //   if (res.ok) {
  //     return res.json();
  //   } else {
  //     return [];
  //   }
  // });
};

export const getPartyById = async (type, partyId) => {
  const url = `${apiConfig.partyManagement.href}/${type}/${partyId}`;
  const accessToken = await getAccessToken();
  let headers = {
    Authorization: `Bearer ${accessToken}`,
    isauthorizationrequired: 'true',
    'Content-Type': 'application/json',
    pragma: 'no-cache',
    'cache-control': 'no-cache'
  };
  const request = {
    method: 'GET',
    headers
  };
  let res = await get(url, request);
  return _.get(res, 'data[0]', []);
};

export const getPartyInteractionByOptions = async (
  customerId,
  accountId,
  publicIdentifier,
  type,
  status,
  offset,
  limit,
  startDate,
  endDate,
  filterType
) => {
  let url = `${apiConfig.partyInteraction.href}?`;
  if (customerId) {
    url += `relatedParty.id=${customerId}&`;
  }
  if (accountId) {
    url += `accountId=${accountId}&`;
  }
  if (publicIdentifier) {
    url += `publicIdentifier=${publicIdentifier}&`;
  }
  if (status) {
    url += `status=${status}&`;
  }
  if (type) {
    url += `interactionItem.item.type=${type}&`;
  }
  if (startDate) {
    url += `startDate=${startDate}&`;
  }
  if (endDate) {
    url += `endDate=${endDate}&`;
  }
  if (filterType) {
    url += `type=${filterType}&`;
  }
  url += `sort=interactionDate.startDateTime&limit=${limit}&offset=${offset}`;
  const res = await get(url);
  const count = _.get(res, 'headers[x-total-count]', 0);
  return { data: res.data, count: count };
};

// API Issue Of ActiveRequests
export const fetchPartyInteractionCustomerDetails = async (queryParams, type, offset, sort, options) => {
  const res = await restAPI(
    `${apiConfig[type].href}?${queryParams}&offset=${offset || 0}${sort ? '&sort=' + sort : ''}${
      options.limit ? '&limit=' + options.limit : ''
    }`
  );
  return { ...res.data, count: res.count };
  // return fetch(
  //   `${apiConfig[type].href}?${queryParams}&offset=${offset || 0}${sort ? '&sort=' + sort : ''}${
  //     options.limit ? '&limit=' + options.limit : ''
  //   }`
  // ).then(async res => {
  //   const responseJson = await res.json();
  //   responseJson.count = res.headers.has('X-Total-Count') ? res.headers.get('X-Total-Count') : 0;
  //   return responseJson;
  // });
};
export const fetchPartyInteraction = async id => {
  const res = await restAPI(`${apiConfig.partyInteraction.href}/${id}`);
  return res.data;
  // return fetch(`${apiConfig.partyInteraction.href}/${id}`).then(res => res.json());
};

export const fetchDocumentManegment = async (id, referredType) => {
  const res = await restAPI(
    `${apiConfig.documentManagement.href}/document?relatedEntity.id=${id}&relatedEntity.referredType=${referredType}`
  );
  return res.data || {};
  // return fetch(
  //   `${apiConfig.documentManagement.href}/document?relatedEntity.id=${id}&relatedEntity.referredType=${referredType}`
  // )
  //   .then(res => res.json())
  //   .then(res => res || {});
};

export const fetchProductNotesData = async (productId, onSuccess) => {
  const api = apiConfig.productManagement.href + `/${productId}/note?sort=-createdDate&limit=1`;
  const res = await restAPI(api);
  const { data = [] } = res;
  onSuccess(data);
  return data;
  // fetch(api)
  //   .then(res => {
  //     return res.json();
  //   })
  //   .then(data => {
  //     onSuccess(data);
  //   })
  //   .then(response => {
  //     if (response && response.code === '404') {
  //       return {};
  //     } else {
  //       return response;
  //     }
  //   });
};

export const fetchMasterData = async type => {
  let result = await fetch(apiConfig.masterData.href + `?type=${type}&lang=en`)
    .then(res => res.json())
    .then(response => {
      return response.code !== '404' ? response : {};
    });
  return result;
};
export const fetchBssCbsMasterData = async () => {
  let result = await fetch(apiConfig.bssCbsMasterData.href)
    .then(res => res.json())
    .then(response => {
      return response.code !== '404' ? response : {};
    });
  return result;
};

export const getBillingAccountDetails = async id => {
  const res = await restAPI(`${apiConfig.accountManagement.href}/account/${id}`);
  return res.data || [];
  // return fetch(`${apiConfig.accountManagement.href}/account/${id}`)
  //   .then(res => res.json())
  //   .then(res => (_.isArray(res) && res.length ? res : []));
};
// export const getTaxPlan = id => {
//   return fetch(`${apiConfig.accountManagement.href}/taxPlan`)
//     .then(res => res.json())
//     .then(res => (_.isArray(res) && res.length ? res : []));
// };
export const fetchAccountDetails = async ids => {
  const billingAccounts = [];
  for (const id of ids) {
    // const url = prepareURL(BILLING_ACCOUNT, '', id);
    let billingAccount;
    const onError = response => {
      billingAccount = {};
      console.log('Error while fetching Accounts', response);
    };

    const onSuccess = response => {
      billingAccount = response;
    };

    if (!isEmpty(billingAccount)) {
      billingAccounts.push(billingAccount);
    }
  }
  return billingAccounts;
};

export const getProductAccountDetails = async id => {
  const res = await restAPI(`${apiConfig.accountManagement.href}/productAccount/${id}`);
  return res.data || {};
  // return fetch(`${apiConfig.accountManagement.href}/productAccount/${id}`)
  //   .then(res => res.json())
  //   .then(res => res || {});
};

export const getUsageDetails = async (type, queryString) => {
  const res = await restAPI(`${apiConfig.usageApi.href}/${type}?${queryString}`);
  return res.data;
  // return fetch(`${apiConfig.usageApi.href}/${type}?${queryString}`).then(res => res.json());
};
export const getProductInventoryManagement = async (productId, fields, expand = 'productRelationship') => {
  let url = `${apiConfig.productManagement.href}/${productId}?depth=3`;
  if (fields) {
    url += `&fields=${fields}`;
  }
  if (expand) {
    url += `&expand=${expand}`;
  }

  // const res = await restAPI(url);
  let res = await get(url);
  return _.get(res, 'data[0]', {});
  // return fetch(url)
  //   .then(res => res.json())
  //   .then(res => res[0] || {});
};
export const getProductInventoryDetails = async (productId, fields, expand = 'productRelationship') => {
  let url = `${apiConfig.productManagement.href}/${productId}?depth=3`;
  const accessToken = await getAccessToken();
  let headers = {
    Authorization: `Bearer ${accessToken}`,
    isauthorizationrequired: 'true',
    'Content-Type': 'application/json',
    pragma: 'no-cache',
    'cache-control': 'no-cache'
  };
  const request = {
    method: 'GET',
    headers
  };
  let res = await get(url, request);
  return _.get(res, 'data[0]', {});
};

export const getPaymentTransaction = async (customerId, accountId, productId, type, queryParams) => {
  let url = `${apiConfig.paymentTransaction.href}`;
  if (customerId) {
    url += `?relatedParty.id=${customerId}`;
  }
  if (accountId) {
    url += `?account.id=${accountId}`;
  }
  if (productId) {
    url += `?productId=${productId}`;
  }
  if (type) {
    url += `&@type=${type}`;
  }
  if (queryParams) {
    url += `&${queryParams}`;
  }
  const res = await restAPI(url);
  return _.get(res, 'data', []);
  // return fetch(url)
  //   .then(res => {
  //     if (res.ok) {
  //       return res.json();
  //     } else {
  //       return [];
  //     }
  //   })
  //   .then(res => res || []);
};
export const getRechargeTransaction = async (productId, type) => {
  const res = await restAPI(`${apiConfig.rechargeTransaction.href}?productId=${productId}&type=${type}`);
  return _.get(res, 'data');
  // return fetch(`${apiConfig.rechargeTransaction.href}?productId=${productId}&type=${type}`).then(res => res.json());
};
export const fetchResourceInventoryItem = async (type, queryString) => {
  const res = await restAPI(`${apiConfig.resourceInventoryManagement.href}/${type}?${queryString}`);
  return _.get(res, 'data');
  // return fetch(`${apiConfig.resourceInventoryManagement.href}/${type}?${queryString}`).then(res => res.json());
};
export const getRuleService = async (payload, requestMethod) => {
  const entityURL = apiConfig.ruleService.href + requestMethod;
  const res = await restAPI(entityURL, 'POST', payload);
  return _.get(res, 'data', {});
  // const accessToken = getAccessToken();
  // try {
  //   let rule = await fetch(entityURL, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(payload)
  //   });
  //   if (rule.status >= 200 && rule.status <= 299) {
  //     rule = await rule.json();
  //     return rule;
  //   } else if (rule.status >= 400 && rule.status <= 499) {
  //     // return rule;
  //     console.log('error', rule.status);
  //   }
  //   return rule;
  // } catch (e) {
  //   return e;
  // }
};
export const fetchValidationResult = async (payload, type) => {
  const accessToken = getAccessToken();
  try {
    let validateRequest = await fetch(`${apiConfig.partyInteraction.href}/preValidate/validate${type}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (validateRequest.status >= 200 && validateRequest.status <= 299) {
      validateRequest = await validateRequest.json();
      return validateRequest;
    } else if (validateRequest.status >= 400 && validateRequest.status <= 499) {
      console.log('error', validateRequest.status);
    }
    return validateRequest;
  } catch (e) {
    return e;
  }
};
export const changePassword = async payload => {
  const accessToken = getAccessToken();
  try {
    let res = await fetch(`${apiConfig.changePassword.href}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.status >= 200 && res.status <= 299) {
      res = await res.json();
      return res;
    } else if (res.status >= 400 && res.status <= 499) {
      console.log('error', res.status);
    }
    return res;
  } catch (e) {
    return e;
  }
};
export const enrollment = async payload => {
  const accessToken = getAccessToken();
  try {
    payload.password = new Buffer(payload.password).toString('base64');
    let res = await fetch(`${apiConfig.enrollment.href}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.status >= 200 && res.status <= 299) {
      res = await res.json();
      return res;
    } else if (res.status >= 400 && res.status <= 499) {
      console.log('error', res.status);
    }
    return res;
  } catch (e) {
    return e;
  }
};

export const sendOTP = async payload => {
  const accessToken = getAccessToken();
  try {
    let res = await fetch(`${apiConfig.otp.href}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.status >= 200 && res.status <= 299) {
      res = await res.json();
      return res;
    } else if (res.status >= 400 && res.status <= 499) {
      console.log('error', res.status);
    }
    return res;
  } catch (e) {
    return e;
  }
};
export const verifyOTP = async (payload, type = 'enroll') => {
  const accessToken = getAccessToken();
  const { forgotPassword } = apiConfig;
  let url = type === 'forgot' ? `${forgotPassword.href}${forgotPassword.verify}` : `${apiConfig.verifyOTP.href}`;
  try {
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.status >= 200 && res.status <= 299) {
      res = await res.json();
      return res;
    } else if (res.status >= 400 && res.status <= 499) {
      console.log('error', res.status);
    }
    return res;
  } catch (e) {
    return e;
  }
};
export const deactivate = async serviceNumber => {
  const accessToken = getAccessToken();
  try {
    let res = await fetch(`${apiConfig.deactivate.href}/${serviceNumber}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (res.status >= 200 && res.status <= 299) {
      res = await res.json();
      return res;
    } else if (res.status >= 400 && res.status <= 499) {
      console.log('error', res.status);
    }
    return res;
  } catch (e) {
    return e;
  }
};
export const validateUserName = userName => {
  return fetch(`${apiConfig.validateUserName.href}${apiConfig.validateUserName.queryString}?userName=${userName}`)
    .then(res => res.json())
    .then(res => res || {});
};
export const verifyUsername = (userName, customerId) => {
  return fetch(
    `${apiConfig.verifyUsername.href}${apiConfig.verifyUsername.queryString}?userName=${userName}&customerId=${customerId}`
  )
    .then(res => res.json())
    .then(res => res || []);
};
export const fetchVasDetailsForProduct = async params => {
  // const queryString = `status=active,terminated&productRelationshipType=reliesOn&customerId=${params.customerId}&productOfferingCategory=VAS&isCustomerVisible=true`;
  // return fetch(`${apiConfig.productManagement.href}/${params.productId}/vasDetails?${queryString}`)
  //   .then(res => res.json())
  //   .then(res => res || []);
  try {
    const { data, errors } = await params.client.query({
      query: gql(FETCH_ACTIVE_TERMINATED_VAS_DETAILS),
      variables: {
        queryParameters: `status=active,terminated&productRelationship.type=reliesOn&relatedParty.id=${params.customerId}&productRelationship.product.id=${params.productId}&productOffering.category.name=VAS&isCustomerVisible=true&createdDate>=${params.dateRange.fromDate}&createdDate<=${params.dateRange.toDate}`
      }
    });
    if (errors) {
      console.log('errors', errors);
    }
    const { fetchVasDetailsForReport } = data;
    return fetchVasDetailsForReport;
  } catch (error) {
    console.log('errors', error);
  }
};

export const getTroubleTickets = (customerId, accountId, publicIdentifier, query, limit = 100, offset = 0) => {
  let url = `${apiConfig.troubleTicket.href}/${apiConfig.troubleTicket.ticket}?`;
  if (customerId) {
    url += `customerId=${customerId}&`;
  }
  if (accountId) {
    url += `accountId=${accountId}&`;
  }
  if (publicIdentifier) {
    url += `publicIdentifier=${publicIdentifier}&`;
  }
  if (query) {
    url += `${query}&`;
  }
  url += `limit=${limit}&offset=${offset}`;
  return fetch(url)
    .then(res => res.json())
    .then(res => res || []);
};
export const getTicketId = () => {
  return fetch(`${apiConfig.troubleTicket.href}/${apiConfig.troubleTicket.generateId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json'
    },
    body: []
  }).then(res => res.json());
};
export const saveTroubleTicket = request => {
  const { description, category = '', subCategory = '', product = {}, customerId, customFields = {} } = request;
  const { userInfo, troubleTicket } = constants;
  // const payload = getTroubleTicketUpdatePayload()
  // const interactionData =
  const payload = {
    ...troubleTicket,
    customerId: [customerId],
    accountId: [_.get(product, 'billingAccount.id')],
    interactionItem: [
      {
        item: {
          '@baseType': 'TroubleTicket',
          '@type': 'TroubleTicket',
          accountId: [_.get(product, 'billingAccount.id')],
          category: `${category},${subCategory}`,
          channel: troubleTicket.channel,
          customerId: [request.customerId],
          description,
          id: request.ticketId,
          itemDate: new Date(),
          LoB: product.LoB,
          name: '',
          notifyCustomer: '',
          priority: 'Medium',
          customFields: customFields || {},
          productId: [product.id],
          publicIdentifier: [product.publicIdentifier],
          reasonForCall: '',
          relatedParty: [
            {
              '@referredType': 'Customer',
              engagedParty: {
                '@referredType': 'Organization',
                id: request.organisationId
              },
              id: request.customerId,
              name: request.customerName,
              role: 'Customer'
            }
          ],
          status: 'open',
          ticketType: 'Complaint'
        }
      }
    ],
    productId: [product.id],
    publicIdentifier: [product.publicIdentifier],
    relatedParty: [
      {
        '@referredType': 'Customer',
        engagedParty: {
          '@referredType': 'Organization',
          id: request.organisationId
        },
        id: request.customerId,
        name: request.customerName,
        role: 'Customer'
      }
    ]
  };

  return fetch(`${apiConfig.troubleTicketCustomerRequest.href}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then(res => res.json());
};
export const getBillingCycles = async () => {
  const res = await restAPI(`${apiConfig.accountManagement.href}/billingCycleSpecification`);
  return res.data || [];
  // return fetch(`${apiConfig.accountManagement.href}/billingCycleSpecification`)
  //   .then(res => res.json())
  //   .then(res => res || []);
};
export const fetchPartyRole = id => {
  return fetch(`${apiConfig.customerManagement.href}/${id}?expand=relatedParty`)
    .then(res => res.json())
    .then(res => res || []);
};
export const fetchBills = (customerId, accountId) => {
  let url = `${apiConfig.customerBillManagement.href}/customerBill`;
  if (customerId) {
    url += `?relatedParty.id=${customerId}`;
  }
  if (accountId) {
    url += `?billingAccount.id=${accountId}`;
  }
  if (customerId || accountId) {
    return fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return [];
        }
      })
      .then(res => res || []);
  } else {
    return [];
  }
};
export const getProductOffering = (type, offerId) => {
  return fetch(`${apiConfig.productOffering.href}/${type}/${offerId}?depth=3`).then(res => res.json());
};
export const getLoyaltyBalance = publicIdentifier => {
  return fetch(
    `${apiConfig.loyalty.href}/${apiConfig.loyalty.balance}?publicIdentifier=${publicIdentifier}`
  ).then(res => res.json());
};
export const getWalletBalance = publicIdentifier => {
  return fetch(`${apiConfig.wallet.href}?mobileno=${publicIdentifier}`).then(res => res.json());
};
export const fetchAssets = async customerId => {
  // return fetch(`${apiConfig.assets.href}?customerId=${customerId}`).then(res => res.json());
  const res = await restAPI(`${apiConfig.assets.href}?customerId=${customerId}`);
  return res.data || {};
};

export const fetchOrganization = id => {
  return fetch(`${apiConfig.organization.href}/${id}`).then(res => res.json());
};
export const fetchIndividual = id => {
  // return fetch(`${apiConfig.organization.href}/${id}`).then(res => res.json());
};
export const updateCustomerDetailsPartyInformation = async payload => {};
export const fetchCustomer = async (id, state, options) => {
  // const querryParams = '?expand=relatedParty'
  return fetch(`${apiConfig.customerManagement.href}/${id}?expand=relatedParty`)
    .then(res => res.json())
    .then(res => res[0] || {});
};
export const fetchTroubleTicketCategories = () => {
  const { troubleTicket } = apiConfig;
  return fetch(`${troubleTicket.href}/${troubleTicket.category}`).then(res => res.json());
};
export const fetchTroubleTicketSubCategories = id => {
  const { troubleTicket } = apiConfig;
  return fetch(`${troubleTicket.href}/${troubleTicket.category}/${id}`).then(res => res.json());
};
export const fetchCustomerNotes = () => {};
export const setCustomerNote = () => {};

export const queryFullCustomer = async (payload, state, options) => {
  try {
    let customer;
    customer = await queryEntityByNetwork('customer', payload);
    // customer = await getEntity('customer',state,id,options);
    if (customer && customer.length) {
      customer = customer[0];
      if (customer.customerType === 'Individual') {
        customer.engagedParty = await fetchIndividual(customer.engagedParty.id, state, options);
      } else if (customer.customerType === 'Organization') {
        customer.engagedParty = await fetchOrganization(customer.engagedParty.id, state, options);
      }
    }
    return customer;
  } catch (e) {
    return e;
  }
};
export const processPayment = async payload => {
  const accessToken = await getAccessToken().then(res => res);
  try {
    let res = await fetch(`${apiConfig.paymentRequest.href}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.status >= 200 && res.status <= 299) {
      res = await res.json();
      return res;
    } else if (res.status >= 400 && res.status <= 499) {
      console.log('error', res.status);
    }
    return res;
  } catch (e) {
    return e;
  }
};

export const updateCustomerInfo = async payload => {
  const accessToken = getAccessToken();
  try {
    let res = await fetch(`${apiConfig.customerUpdateRequest.href}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.status >= 200 && res.status <= 299) {
      res = await res.json();
      return res;
    } else if (res.status >= 400 && res.status <= 499) {
      console.log('error', res.status);
    }
    return res;
  } catch (e) {
    return e;
  }
};

export const getRiskCategoryAndCreditLimit = async payload => {
  const response = '';
  return response;
};
export const getUserTask = id => {
  return fetch(`${apiConfig.userTask.href}/tasks/${id}`).then(res => res.json());
};
export const updateUserTask = async (orderId, payload) => {
  const accessToken = getAccessToken();
  try {
    let res = await fetch(`${apiConfig.userTask.href}/task/${orderId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.status >= 200 && res.status <= 299) {
      res = await res.json();
      return res;
    } else if (res.status >= 400 && res.status <= 499) {
      console.log('error', res.status);
    }
    return res;
  } catch (e) {
    return e;
  }
};
export const forgotPasswordUserExists = (userName, customerId) => {
  const { forgotPassword } = apiConfig;
  return fetch(`${forgotPassword.href}${forgotPassword.exists}?userName=${userName}&customerId=${customerId}`)
    .then(res => res.json())
    .then(res => res || {});
};
export const forgotPassword = async payload => {
  const accessToken = getAccessToken();
  payload.password = new Buffer(payload.password).toString('base64');
  const { forgotPassword } = apiConfig;
  try {
    let res = await fetch(`${forgotPassword.href}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.status >= 200 && res.status <= 299) {
      res = await res.json();
      return res;
    } else if (res.status >= 400 && res.status <= 499) {
      console.log('error', res.status);
    }
    return res;
  } catch (e) {
    return e;
  }
};
export const getCompaniesByUser = userName => {
  return fetch(`${apiConfig.companies.href}?userName=${userName}`)
    .then(res => res.json())
    .then(res => res || []);
};
export const fetchPartyRoles = async (type, queryString) => {
  return fetch(`${apiConfig.partyRole.href}/${type}/${queryString}`)
    .then(res => res.json())
    .then(res => res || []);
};
export const restAPI = async (url, method = 'GET', payload) => {
  const accessToken = await getAccessToken();
  let headers = {
    Authorization: `Bearer ${accessToken}`,
    isauthorizationrequired: 'true',
    'Content-Type': 'application/json',
    pragma: 'no-cache',
    'cache-control': 'no-cache'
  };
  const request =
    method === 'GET'
      ? {
          method,
          headers
        }
      : method === 'PATCH'
      ? {
          method,
          headers: {
            ...headers,
            'Content-Type': 'application/merge-patch+json'
          },
          body: JSON.stringify(payload)
        }
      : {
          method,
          headers,
          body: JSON.stringify(payload)
        };

  try {
    let res = await fetch(url, request);
    let response = {};
    // console.log(res);
    if (res.status >= 200 && res.status <= 299) {
      response.data = res.json();
      response.count = res.headers.has('X-Total-Count') ? res.headers.get('X-Total-Count') : 0;
      return response;
    } else {
      return response;
    }
  } catch (e) {
    return response;
  }
};
