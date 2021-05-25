import config from 'config';
import constants from '../constants/constants';
import qs from 'qs';
import { getSessionData } from 'utils/utilService';
import { getId } from 'common/utils/commonUtility';
import * as _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
const { apiConfig } = config.dev;
function getAccessToken(options) {
  return _.get(options, 'accessToken', _.get(getSessionData(constants.userInfo), constants.oAuth.ACCESS_TOKEN));
}

export const commonFetch = async (type, method = 'GET', payload, params, queryString) => {
  const accessToken = getAccessToken();
  let entityCount = [];
  let entityURL = apiConfig[type].href;
  if (entityURL) {
    if (!_.isEmpty(params)) {
      entityURL += '/' + params;
    }
    if (!_.isEmpty(queryString)) {
      if (queryString[0] !== '?')
        entityURL += '?' + queryString;
      else
        entityURL += queryString;
    }
  }
  const content =
    method === 'GET'
      ? {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          pragma: 'no-cache',
          'cache-control': 'no-cache'
        }
      }
      : method === 'PATCH'
        ? {
          method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/merge-patch+json',
            pragma: 'no-cache',
            'cache-control': 'no-cache'
          },
          body: JSON.stringify(payload)
        }
        : {
          method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            pragma: 'no-cache',
            'cache-control': 'no-cache'
          },
          body: JSON.stringify(payload)
        };

  try {
    let entity = await fetch(entityURL, content);
    if (entity.status >= 200 && entity.status <= 299) {
      entityCount = await entity.json();
      entityCount.count = +entity.headers.get('X-Total-Count');
      return entityCount;
    } else {
      // throw entity;
      // await handleError(entity);
      return {}
    }
  } catch (e) {
    throw e;
  }
};

export const queryEntityByNetwork = async (
  type,
  queryParams,
  offset,
  sort,
  options
) => {
  const accessToken = getAccessToken(options);
  //  const queryString= getQueryParams(params);
  const limit = !_isEmpty(options) ? options.limit : '5';
  const queryStringParams = queryParams ? queryParams : '';
  const queryStringOffset =
    offset !== undefined ? `&offset=${offset}` : '&offset=0';
  const queryStringSort = sort !== undefined ? `&sort=${sort}` : '';
  const queryStringLimit = queryParams === '' ? 'limit=10' : `&limit=${limit}`;
  let entityCount = [];
  var queryString = '';
  if (
    type === 'billingAccount' ||
    type === 'serviceRequests' ||
    type === 'troubleTicketManagement'
  ) {
    queryString = queryStringParams;
  } else if (type === 'productOffering') {
    queryString =
      '?' + queryStringParams + queryStringLimit + queryStringOffset;
  } else {
    queryString =
      '?' +
      queryStringParams +
      queryStringLimit +
      queryStringOffset +
      queryStringSort;
  }
  return await commonFetch(type, 'GET', undefined, undefined, queryString);
};

//Fetch Product Offerings
export const fetchProductOfferingList = async (queryParams, offset, sort, options, nameString) => {
  try {
    if (nameString) {
      queryParams.q = nameString;
    }
    const depth = 1;
    let params = qs.stringify({ ...queryParams, depth }, { allowDots: true });
    let productOfferingList = await queryEntityByNetwork('dclmProductOffering', params, offset, sort, {
      ...options,
      accessToken: getAccessToken()
    });

    //For Retreiving offers based on Filters
    const nonBundledOffers = productOfferingList;

    let productOfferings = {};
    let metadata = {};

    productOfferingList.forEach(productOffering => {
      productOfferings[getId(productOffering)] = productOffering;
      metadata[getId(productOffering)] = { depth };
    });

    return {
      productOfferings,
      nonBundledOffers,
      metadata
    };
  } catch (e) {
    return e;
  }
};
// Submit Party Interaction
export const submitPartyInteraction = async (payload, type) => {
  try {
    return await commonFetch(type, 'POST', payload);
  } catch (e) {
    return e;
  }
};

export const downloadReceipt = async (requestId, downloadBlob, type) => {
  return commonFetch(
    constants.configType.REPORT_GENERATOR,
    'GET',
    null,
    `${type}/${requestId}`,
    null,
    downloadBlob
  );
};

export const fetchProductOfferingDetails = async (id, depth, target) => {
  let queryParams = `${id}?depth=${depth}`;
  if (target) {
    queryParams += `&target=${target}`;
  }
  let productOfferingDetails = await commonFetch(
    constants.configType.PRODUCT_OFFERING,
    'GET',
    undefined,
    queryParams
  );
  return productOfferingDetails;
};

export const fetchProducts = async (queryParams, offset, sort, limit) => {
  let options = {};
  options.limit = limit ? limit : 10;
  try {
    let products = await queryEntityByNetwork(
      constants.configType.PRODUCT_INVENTORY_MANAGEMENT,
      queryParams,
      offset,
      sort,
      options
    );
    return products;
  } catch (e) {
    return e;
  }
};

export const fetchDocumentUploads = async (payload) => {
  return await commonFetch(
    constants.configType.DOCUMENT_UPLOAD_REQUEST,
    'POST',
    payload
  );
};

export const manageDocuments = async (requestMethod, id, payload) => {
  return await commonFetch(
    constants.configType.DOCUMENT_MANAGEMENT,
    requestMethod,
    payload,
    id
  );
};