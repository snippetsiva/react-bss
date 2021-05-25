import config from 'config';
const {
  dev: { server }
} = config;

export default {
  basePath: '/bss-cbs-app-upgrade-ui/',
  sso: {
    opco: server.opco
  },

  dev: {
    apiConfig: {},
    uiConfig: {
      fieldLengths: {
        mobile: 10,
        msisdn: 10,
        simLength: 15
      }
    }
  }
};
