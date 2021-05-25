const appRoutes = {
  home: {
    baseurl: '/home',
    indUrl: '/individual',
    orgUrl: '/organization',
    onboardingUrl: '/offers',
    CUSTOMERDETAILS: '/customerDetails',
    ORGANIZATION: {
      ORGCUSTOMERDETAILS: '/orgCustomerDetails',
      ORDERHISTORY: '/orderHistory'
    },
    ACCOUNT: {
      ACCOUNTVIEW: '/accountView'
    },
    PRODUCT: {
      BASE_URL: '/product',
      PARAM: '/:accountId/:productId',
      USAGE: '/usage',
      HOME: '/home',
      SERVICEOVERVIEW: '/serviceOverview',
      PAYMENTS: '/payments',
      VASDETAILS: '/vasDetails',
      REQUESTS: '/requests',
      LOYALITYPOINTS: '/loyalityPoints',
      DOCUMENT: '/document',
      NEEDHELP: '/needHelp',
      PROFILE: '/profile',
      ADD_VAS: '/addVas',
      REST_VAS: '/addVas/*',
      VAS_CONFIG: '/vasConfig',
      VAS_PAYMENT: '/vasPayment',
      CHANGE_OF_PLAN: '/changePlanProductRequest',
      CHANGE_OF_PLAN_CONFIG: '/productConfiguration',
      CHANGE_OF_PLAN_PAYMENT: '/payment',
      PINPUK: '/pinpuk',
      PRODUCT_SELECTION: '/productSelection'
    },
    SELF_REGISTRATION: {
      registrationBaseUrl: '/registration',
      PRODUCT_CONFIGURATION: '/productConfiguration',
      CUSTOMER_CAPTURE: '/customerCapture',
      SUMMARY: '/summary'
    }
  }
};

export default appRoutes;
