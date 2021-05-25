import { getSessionData } from '../../utils/utilService';
import { PREVALIDATION_REQUEST } from '../../queries/prevalidationQueries';
import gql from 'graphql-tag';
import constants from 'common/constants/constants';

class PreValidationCheck {
  constructor() {}

  /**
   * @description Validates the selected service request against the selected product/service
   *
   * @param {serviceObj} serviceObj
   * @param {activeCustomerId} activeCustomerId
   * @param {activeProduct} activeProduct
   * @param {apolloClient} apolloClient
   * @returns Error message if any else will return 'true' as string
   */
  getPrivilege = async (serviceObj, activeCustomerId, activeProduct, apolloClient) => {
    /**
     * First check for product status, which must be one of 'active', 'suspended' and 'terminated'.
     */
    if (_.get(serviceObj, 'code') === constants.serviceRequestType.REVOKE_SUSPENSION) {
      switch (activeProduct.status) {
        case 'suspended': {
          break;
        }
        case 'terminated': {
          break;
        }
        default: {
          return `Cannot ${_.get(serviceObj, 'name', '')} because service is ${activeProduct.status}`;
        }
      }
    } else {
      switch (activeProduct.status) {
        case 'active': {
          break;
        }
        default: {
          return `Cannot ${_.get(serviceObj, 'name', '')} because service is ${activeProduct.status}`;
        }
      }
    }

    /**
     * Check for Pin Puk Query SRQ, product's technology must be 'GSM'.
     */
    if (_.get(serviceObj, 'code') === constants.serviceRequestType.PIN_PUK && activeProduct.technology !== 'GSM') {
      return `${_.get(serviceObj, 'name')} is only available for GSM products`;
    }

    /**
     * Check for Change of Plan SRQ, product's businessType must be 'Postpaid'.
     */
    if (
      _.get(serviceObj, 'code') === constants.serviceRequestType.CHANGE_OF_PLAN &&
      activeProduct.businessType !== 'Postpaid'
    ) {
      return `${_.get(serviceObj, 'name')} Service is only available for Postpaid products`;
    }

    const userInfo = getSessionData('userInfo') || {};
    const customerType = _.get(userInfo, 'assets.customer[0].customerType');
    const preValValue = `validate${_.get(serviceObj, 'code')}`;

    const { data, errors } = await apolloClient.query({
      query: gql(PREVALIDATION_REQUEST),
      variables: {
        customerType: customerType,
        customerId: activeCustomerId,
        productId: activeProduct.id,
        preValidation: preValValue
      }
    });
    const { preValidationRequest } = data;
    const failedData = (preValidationRequest || []).filter(item => item.result !== 'PASSED');

    if (errors) {
      return 'Failed to validate request, please try again';
    }

    if (failedData.length) {
      return _.get(failedData, '[0].message', 'Failed to validate request, please try again');
    }
    return 'PASSED';
  };
}

export default PreValidationCheck;
