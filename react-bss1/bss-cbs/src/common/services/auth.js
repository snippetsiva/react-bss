import { stringify } from 'querystring';
import config from 'config';
import constants from 'common/constants/constants';
import * as _ from 'lodash';
import { setSessionData, getSessionData } from 'utils/utilService';

const { apiConfig } = config.dev;

export const getUserInfo = payload => {
  const password = new Buffer(payload.password).toString('base64');
  return fetch(`${apiConfig.userInfo.href}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({...payload, password})
  })
    .then(response => {
      if (response.status >= 200) {
        return response;
      }
      return response;
    })
    .then(response => response.json())
    .then(data => {
      const userInfo = getSessionData(constants.userInfo);
      if (_.isEmpty(userInfo)) {
        const userInfo = _.pick(data, [constants.oAuth.ACCESS_TOKEN, 'customerId', 'accountId', 'engagedPartyId', 'clm_servicenumber']);
        setSessionData(constants.userInfo, userInfo);
      }
      return data;
    })
    .catch(error => {
      return error;
    });
};
