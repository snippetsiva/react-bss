const config = {
  basePath: '/bss-cbs-app-upgrade-ui/',
  dev: {
    server: {
      base_url: '/api',
      dclm_base_url: 'https://dclm-mmp.cluster1.devtestlab2.tecnotree.com',
      queryParams: '?offset=1&limit=10&sort=-name',
      sso: 'https://sso2.tecnotree.com',
      opco: 'mtng'
    },
    graphQLConfig: {
      base_url: 'https://bssmobile.tecnotree.com/dclm-service',
      server: {
        LOCAL: 'http://localhost:4000',
        LOCAL_IOS: 'http://172.20.10.4:4000', //change the ip address with the IP of your laptop
        LOCAL_DEMO: 'http://kaushiknamtoar-149c66bb.localhost.run', // Pointing to Local environment through internet
        MMP: 'http://dclm-mmp1.cluster1.devtestlab2.tecnotree.com/dclm-service',
        MMP_SSL: 'https://bssmobile.tecnotree.com/dclm-service', //E2E environment
        SD: 'http://dclm-apps.192.168.229.171.xip.io/dclm-service' // Pointing to SD environment
      }
    },
    apiConfig: {
      clickStream: {
        href: '/api/publish'
      },
      customer: {
        href: '/middleware/customer-service/customerManagement/v1/customer',
        strategy: 'reduxFirst'
      },
      customerManagement: {
        href: '/middleware/customer-service/customerManagement/v1/customer'
      },
      productManagement: {
        href: '/middleware/productInventoryManagement/v1/product'
      },
      validateUserName: {
        href: '/middleware/auth/',
        queryString: 'validateUserName'
      },
      partyManagement: {
        href: '/middleware/customer-service/partyManagement/v1'
      },
      organization: {
        href: '/middleware/customer-service/partyManagement/v1/organization'
      },
      masterData: {
        href: '/middleware/v1/masterData'
      },
      bssCbsMasterData: {
        href: '/middleware/v1/web-ui-service/v1/masterData'
      },
      userInfo: {
        href: '/middleware/auth/login'
      },
      accountManagement: {
        href: '/middleware/accountManagement/v1'
      },
      ruleService: {
        href: '/middleware/rules-service/1/CLM/1/'
      },
      usageApi: {
        href: '/middleware/usageApi/v1'
      },
      partyInteraction: {
        href: '/middleware/partyInteractionManagement/v1/partyInteraction'
      },
      invoiceDownload: {
        href: '/middleware/customerBillManagement/v1/invoices/bills-view'
        // href: '/middleware/invoices/bills-view'
      },
      downloadInvoice: {
        // href: '/middleware/customerBillManagement/v1/invoices/bills-view'
        href: '/middleware/invoices/bills-view'
      },
      resourceInventoryManagement: {
        href: '/middleware/resourceInventoryManagement/v1'
      },
      paymentTransaction: {
        href: '/middleware/paymentManagement/v1/paymentTransaction'
      },
      rechargeTransaction: {
        href: '/middleware/balanceManagement/v1/balanceActivity'
      },
      troubleTicket: {
        href: '/middleware/troubleTicketManagement/v1',
        ticket: 'troubleTicket',
        category: 'category',
        generateId: 'troubleTicket/generateId'
      },
      troubleTicketCustomerRequest: {
        href: '/middleware/v1/customerInteractionService/v1/troubleTicketRequest'
      },
      deactivate: {
        href: '/middleware/auth/users/deactivate'
      },
      changePassword: {
        href: '/middleware/auth/changePassword'
      },
      verifyUsername: {
        href: '/middleware/auth', // {userName}
        queryString: '/exists'
      },
      enrollment: {
        href: '/middleware/auth/users/enroll'
      },
      deEnrollment: {
        href: '/middleware/auth/users/deEnroll'
      },
      otp: {
        href: '/middleware/auth/otp'
      },
      verifyOTP: {
        href: '/middleware/auth/otp/verify'
      },
      customerBillManagement: {
        href: '/middleware/customerBillManagement/v1'
      },
      loyalty: {
        href: '/middleware/loyaltyManagement/programMember',
        balance: 'loyaltyBalance'
      },
      wallet: {
        href: '/middleware/v1/vk-syndicateIOS/rest/getbalane'
      },
      assets: {
        href: '/middleware/v1/assets'
      },
      changePlanProductRequest: {
        href: '/middleware/partyInteractionManagement/v1/changePlanProductRequest'
      },
      serviceRequest: {
        href: '/middleware/partyInteractionManagement/v1'
      },
      productOffering: {
        href: '/middleware/product-catalog'
      },
      dclmProductOffering: {
        href: '/middleware/product-catalog/productOffering'
      },
      paymentRequest: {
        href: '/middleware/v1/customerInteractionService/v1/paymentAgainstInvoiceRequest'
      },
      documentManagement: {
        href: '/middleware/documentManagement/v1'
      },
      userTask: {
        href: '/middleware/dom/user-tasks/apis',
        strategy: 'networkFirst'
      },
      accountUpdateRequest: {
        href: '/middleware/v1/customerInteractionService/v1/billingAccountUpdateRequest'
      },
      customerUpdateRequest: {
        href: '/middleware/v1/customerInteractionService/v1/customerInformationUpdateRequest'
      },
      forgotPassword: {
        href: '/middleware/auth/forgotPassword',
        exists: '/exists',
        verify: '/otp/verify'
      },
      companies: {
        href: '/middleware/v1/companies'
      },
      partyRole: {
        href: '/middleware/customer-service/partyRoleManagement/v1'
      },
      equipmentDetails: {
        href: '/middleware/integration-service/v1/deviceDetails'
      },
      partyInteractionSave: {
        href: '/middleware/partyInteractionSave'
      }
    },
    uiConfig: {
      fieldLengths: {
        mobile: 9
      },
      labels: {
        customerUATAcceptance: 'Customer UAT Acceptance',
        searchTitle: 'MTN',
        displayChatBot: 'false'
      },
      subscriptionHistoryDays: 180,
      defaultThemecolor: 'azureBlue',
      defaultThemeTextColor: 'black'
    }
  }
};
var window;
if (window) {
  window.DMLD_CONFIG = config;
}
var module;
if (module) {
  module.exports = config;
}
