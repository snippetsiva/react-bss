import config from 'config';
import _get from 'lodash/get';

const constants = {
  LOCAL_STORAGE_LANG_KEY: 'appLanguage',
  userInfo: 'userInfo',
  oAuth: {
    ACCESS_TOKEN: 'access_token',
    ID_TOKEN: 'id_token',
    EXPIRES_AT: 'expires_at',
    REFRESH_TOKEN: 'refresh_token'
  },
  dateFormat: {
    full: 'DD MMM YYYY hh:mm A',
    fullWithSec: 'DD-MMM-YYYY hh:mm:ss A',
    date: 'DD MMM YYYY',
    reverseDate: 'YYYY-MM-DD',
    time: 'hh:mm A',
    timeWithSec: 'hh:mm:ss A',
    fullDateMonthWithTime: 'DD MMM YYYY HH:mm',
    fullDateMonth: 'DD MMM YYYY',
    fullDateMonthWithForwardSlash: 'DD/MM/YYYY',
    dob: 'DD-MM-YYYY',
    dateMonth: 'DD MMMM',
    fullMonth: 'MMM',
    fullDay: 'dddd',
    dateYear: 'YYYY',
    shortData: 'DD-MMM, YYYY',
    invoiceDate: 'DD MMM.YYYY',
    onlyTime: 'hh:mm:ss',
    documentDate:'DD-MM-YYYY',
    yearmonthdate: 'YYYYMMDD'

  },
  NOTES: 'Maximum 250 characters are allowed',
  iconNames: {
    account: 'User-Account',
    mobile: 'GSM',
    broadband: 'Broadband-1',
    iptv: 'Play',
    fixedline: 'LandLine',
    notes: 'Notes',
    wallet: 'Wallet',
    error: 'ohno',
    unpaidinv: 'Unpaid-Inv',
    gsm: 'GSM'
  },
  customerStages: {
    customerCapture: 'customerCapture',
    accountCapture: 'accountCapture'
  },
  regex: {
    mobile: new RegExp(
      '^(\\+91-|\\+91|0)?\\d{' +
      _get(config, 'dev.uiConfig.fieldLengths.mobile', 10) +
      '}$'
    ),
    // /^(\+91-|\+91|0)?\d{9}$/
    password: /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*]).*$/,
    numbers: /^[0-9]*$/,
    amount: /^[0-9]*\.?([0-9]{1,2})$/,
    shortName: /^[a-zA-Z ,-.'&]*$/,
    text: /^[a-zA-Z0-9,-.'&\/# ]*$/,
    email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/,
    emailWithMaxLength: /^(?=.{1,100}$)[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/,
    alphabetsAndNumbers: /^[a-zA-Z0-9]*$/,
    socialHandle: /^[a-zA-Z0-9,-._#:/]*$/,
    alphabetsOnly: /^[a-zA-Z]*$/,
    idRegex: /^[a-zA-Z0-9,-.'&\/# ]*$/,
    url: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
    commaSeparatedEmails: /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/,
    phoneWithHyphens: /^(1?(-?\d{3})-?)?(\d{3})(-?\d{4})$/,
    phone: /^(\+91-|\+91|0)?\d{10}$/
  },
  status: {
    DRAFT: 'draft',
    CAPTURED: 'captured',
    CREATED: 'created',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ACKNOWLEDGED: 'acknowledged',
    PARTIAL: 'partial',
    FAILED: 'failed',
    INPROGRESS: 'inProgress',
    PENDING: 'pending',
    UPLOADED: 'uploaded',
    COMPLETED: 'completed',
    FULFILLED: 'fulfilled',
    SUSPENDED: 'suspended',
    SOFT_SUSPENDED: 'softSuspended',
    TERMINATED: 'terminated',
    PENDINGACTIVE: 'pendingActive',
    PENDINGTERMINATE: 'pendingTerminate',
    ABORTED: 'aborted',
    RECEIVED: 'received',
    VERIFIED: 'verified',
    VALIDATED: 'validated',
    INITIALIZED: 'initialized',
    DECEASED: 'deceased',
    ASSESSINGCANCELLATION: 'assessingCancellation',
    REJECTED: 'rejected',
    RESOLVED: 'resolved',
    CANCELLED: 'cancelled',
    CLOSED: 'closed',
    HELD: 'held',
    OPEN: 'open',
    INPROGRESSESCALATED: 'inProgressEscalated',
    INPROGRESSREOPENED: 'inProgressReopened',
    RECENT: 'Recent',
    PAYMENTPENDING: 'paymentPending'
  },
  productPriceBaseType: {
    CHARGE: 'ProdOfferPriceCharge',
    ALTERATION: 'ProdOfferPriceChargeAlteration'
  },
  ALLOWANCES_CARDS: ['broadband', 'iptv', 'mobile', 'fixedline'],
  businessType: {
    PREPAID: 'Prepaid',
    POSTPAID: 'Postpaid',
    HYBRID: 'Hybrid'
  },
  productPriceType: {
    UPFRONT: 'OneTimeChargeProdOfferPriceCharge',
    RECURRING: 'RecurringChargeProdOfferPriceCharge',
    USAGE: 'SimpleUsageProdOfferPriceCharge',
    TARRIF: 'TariffUsageProdOfferPriceCharge',
    DISCOUNT: 'DiscountProdOfferPriceChargeAlteration',
    ALLOWANCE: 'AllownaceProdOfferPriceChargeAlteration',
    REPLACEMENT: 'ReplacementProdOfferPriceChargeAlteration'
  },
  actionPriceTypes: {
    UPFRONT: {
      add: ['OneTimeCharge', 'Charge', 'Deposit'],
      modify: ['OneTimeCharge', 'Fee', 'Penalty', 'Charge', 'Deposit'],
      delete: ['OneTimeCharge', 'Fee', 'Penalty', 'Charge']
    },
    RECURRING: {
      add: ['Recurring', 'Rental', 'AdvancedRental', 'Installment'],
      modify: ['Recurring', 'Rental', 'AdvancedRental', 'Installment'],
      delete: []
    }
  },
  technologies: {
    ALL: 'All',
    GSM: 'GSM',
    NONGSM: 'Non GSM',
    Bundle: 'BUNDLE'
  },
  allowedProductStatusList: ['active', 'suspended'],
  productInventoryManagementProductSize: 30,
  troubleTicket: {
    // ticketType: 'complaint',
    status: 'open',
    direction: 'inbound',
    '@type': 'TroubleTicketRequest',
    '@baseType': 'PartyInteraction',
    channel: [
      {
        '@type': 'DMLD',
        id: 'DMLD',
        name: 'DMLD',
        role: 'interaction creation',
        '@referredType': 'Channel'
      }
    ],
    interactionItem: [],
    relatedParty: [],
    status: 'captured',
    subStatus: 'draft'
  },
  PARTY_INTERACTION_TYPES: {
    PRODUCT_ORDER: 'ProductOrder',
    SERVICE_ORDER: 'ServiceOrderIntegration',
    BILLING_ACCOUNT: 'BillingAccount',
    CUSTOMER: 'Customer',
    INDIVIDUAL: 'Individual',
    ORGANIZATION: 'Organization',
    PAYMENT: 'Payment',
    DOCUMENT: 'Document',
    PUSHGPRS: 'GprsSettingsIntegration',
    DUNNING: 'Dunning'
  },
  serviceRequestType: {
    CUSTOMER_UPDATE: 'CustomerInformationUpdateRequest',
    BILLING_ACCOUNT_UPDATE: 'BillingAccountUpdateRequest',
    REGISTRATION: 'RegistrationRequest',
    ADD_VAS: 'AddVasProductRequest',
    ADD_SERVICE: 'AddPlanProductRequest',
    CHANGE_OF_PLAN: 'ChangePlanProductRequest',
    CREDIT_LIMIT: 'ChangeCreditLimitRequest',
    REVOKE_SUSPENSION: 'RevokeSuspendProductRequest',
    SUSPENSION: 'SuspendProductRequest',
    SIM_CHANGE: 'SimChangeRequest',
    TERMINATION: 'TerminatePlanProductRequest',
    MANAGE_VAS: {
      TERMINATE: 'TerminateVASProductRequest'
    },
    PROMISE_TO_PAY: 'PromiseToPayRequest',
    PORT_IN_REQUEST: 'PortInRequest',
    PAY_BILL: 'PaymentAgainstInvoiceRequest',
    TRANSFER_OF_OWNERSHIP: 'TransferOfOwnershipRequest',
    CORPORATE_REGISTRATION: 'CorporateRegistrationRequest',
    CHANGE_OF_LANGUAGE: 'ChangeLanguageRequest',
    CHANGE_OF_SERVICE_ID: 'ChangeOfServiceIdRequest',
    SOFT_SUSPENSION: 'SoftSuspendProductRequest',
    RESET_PASSWORD: 'ResetPasswordRequest',
    PRE_TO_POST_REQUEST: 'PreToPostRequest',
    POST_TO_PRE_REQUEST: 'PostToPreRequest',
    BAR_UNBAR: 'BarUnbarRequest',
    SERVICE_CLASS_CHANGE: 'ServiceClassChangeRequest',
    PUSH_GPRRS: 'PushGprsRequest',
    DUNNING: 'HoldUnholdDunningRequest',
    TROUBLE_TICKET: 'TroubleTicketRequest',
    PIN_PUK: 'PinPukRequest'
  },
  serviceRequestPrevalidationType: {
    addVas: 'validateAddVasProductRequest',
    suspensionAndRevokeSuspension: 'validateSuspendProductRequest'
  },
  notificationStatus: {
    SUCCESS: 'success',
    ERROR: 'error'
  },
  customerTypes: {
    individual: 'I',
    retail: 'Retail',
    corporate: 'B',
    organization: 'Organization'
  },
  customerType: {
    individual: 'Individual',
    corporate: 'Organization'
  },
  nonLeftNavPaths: [
    '/home/product/home',
    '/home/product/profile',
    '/home/product/needHelp',
    // '/home/product/payments',
    '/home/product/orgCustomerDetails',
    '/home/product/orderHistory',
    '/home/product/document',
    '/home/product/account'
  ],
  billStatus: {
    paid: 'Settled',
    unPaid: 'New',
    receipt: 'DebitNote,CreditNote,Receipt,Refund',
    draft: 'draft',
    payBill: 'PaymentAgainstInvoiceRequest',
    completed: 'completed'
  },
  paymentOptions: {
    payNow: { name: 'Pay Now', code: 'payNow' },
    payLater: { name: 'Charge in Invoice', code: 'payLater' }
  },
  invoicePaymentOptions: {
    payNow: { name: 'Pay Now', code: 'payNow' }
  },
  fieldLengths: {
    companyRegistrationNumber: 100,
    name: 120,
    middleAndLastName: 100,
    branchName: 30,
    mobile: _get(config, 'dev.uiConfig.fieldLengths.mobile', 10),
    fixedLine: 10,
    email: 100,
    landmark: 100,
    pincode: 10,
    address: 100,
    idNumber: 30,
    cheque: 6,
    amount: 14,
    relation: 30,
    issuePlace: 30,
    fbId: 100,
    twitterHandle: 100,
    description: 30,
    commentNote: 250,
    OTP: 6,
    creditCard: 5,
    debitCard: 5,
    phoneWithHyphens: 12
  },
  paymentRequest: {
    description: '',
    reason: '',
    status: 'captured',
    subStatus: 'draft',
    direction: 'inbound',
    relatedParty: [],
    interactionItem: [],
    channel: [
      {
        name: 'DMLD',
        role: 'interaction creation',
        id: 'DMLD',
        '@referredType': 'Channel',
        '@type': 'DMLD'
        // '@schemaLocation': '',
        // href: ''
      }
    ],
    '@baseType': 'PartyInteraction',
    '@type': 'PaymentAgainstInvoiceRequest',
    '@schemaLocation':
      'http://dclm.cluster1.devtestlab2.tecnotree.com/partyInteractionManagement/v1/partyInteraction/schema'
  },
  characteristicsNames: {
    SIM_TYPE: 'SIMType',
    SIM_NUMBER: 'SIMNumber',
    MSISDN: 'MSISDN',
    FXL_NUMBER: 'FXLNumber',
    ON_NET_MSSIDN: 'OnNetMSISDN',
    OFF_NET_MSSIDN: 'OffNetMSISDN',
    OLD_SIM_NUMBER: 'oldSIMNumber',
    OLD_SERVICE_ID: 'oldServiceId',
    SITE: 'Site Count'
  },
  configType: {
    USER_TASKS: 'userTask',
    PARTY_ROLE: 'partyRole',
    REGISTRATION_REQUEST: 'registrationRequest',
    REPORT_GENERATOR: 'reportGenerator',
    PRODUCT_OFFERING: 'productOffering',
    PRODUCT_INVENTORY_MANAGEMENT: 'productInventoryManagement'
  },
  corporateRegistration: {
    // In EB, the backend is asking for Organization instead of Organisation
    organization: 'Organization',
    profileManager: 'ProfileManager',
    contactPerson: 'ContactPerson',
    accountManager: 'AccountManager',
    profileOwner: 'ProfileOwner',
    company: 'company',
    corporate: 'Corporate',
    keyAccountManager: 'KeyAccountManager',
    accountOwner: 'AccountOwner'
  },
  requestTextMapping: {
    CorporateRegistrationRequest: 'Corporate Registration',
    TransferOfOwnershipRequest: 'Transfer Of Ownership',
    AddVasProductRequest: 'Add Vas Product',
    RegistrationRequest: 'Registration Request',
    BillingAccountUpdateRequest: 'Billing Account Update',
    AddPlanProductRequest: 'Add Service'
  },
  contactMediumTypes: {
    PHONE: 'Phone',
    EMAILADDRESS: 'EmailAddress',
    ADDRESS: 'Address',
    MOBILE: 'mobile',
    WHATSAPP: 'whatsapp',
    TELEGRAM: 'telegram'
  },
  relationshipTypes: {
    DEPENDENCY: 'dependency',
    ADDON: 'addon'
  },
  channel: [
    {
      role: 'interaction creation',
      name: 'DMLD',
      id: 'DMLD',
      '@type': 'DMLD',
      '@referredType': 'Channel'
    }
  ],
  documentTypes: {
    NATIONALID: 'nationalId',
    PASSPORT: 'passport',
    COMPANYREGISTRATION: 'companyRegistration'
  },
  priceTypes: ['oneTimeCharge', 'Fee', 'Penalty', 'Charge', 'Deposit'],
  waiveOffAllowedTypes: ['OneTimeCharge', 'Deposit'],
  rowsPerPage: [5, 10, 15, 20, 25],
  fileSpecs: {
    maxSize: 2048000,
    type: ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'],
    allowedTypes: ['image/*', '.xls', '.xlsx', '.doc', '.docx', '.pdf', '.txt'],
    allowedTypesRegex: /(\.jpg|\.jpeg|\.png|\.gif|\.xls|\.xlsx|\.doc|\.docx|\.pdf|\.txt)$/i
  },
  searchTags: [
    {
      title: 'Line of Business',
      id: 'lineOfBusiness',
      show: true,
      path: ''
    },
    {
      title: 'Technology',
      id: 'technology',
      show: true,
      path: ''
    },
    {
      title: 'Business Type',
      id: 'businessType',
      show: false,
      path: ''
    },
    {
      title: 'Category',
      id: 'category',
      show: false,
      path: ''
    },
    {
      title: 'Sub Category',
      id: 'subCategory',
      show: false,
      path: ''
    }
  ],
  productsWithAddressSpec: ['SiteProductSpec'],
  placeHolderValue: '---',
  vasFilterOptions: [
    // {
    //   id: 'clear',
    //   name: 'Clear'
    // }, {
    //   id: 'code',
    //   name: 'Code'
    // },
    {
      id: 'name',
      name: 'Name'
    }
    // {
    //   id: 'speed',
    //   name: 'Speed'
    // }, {
    //   id: 'data',
    //   name: 'Data'
    // }, {
    //   id: 'tps',
    //   name: 'TPS'
    // }
  ],
  vasTypeList: [
    {
      id: 'VAS',
      name: 'VAS'
    },
    {
      id: 'FNF',
      name: 'FRIENDS AND FAMILY'
    }
  ],
  LOB: {
    MOBILE: 'Mobile',
    FIXED_LINE: 'FixedLine'
  },
  resourceCharacteristics: {
    imsiNumber: 'imsiNumber',
    pin1Number: 'pin1Number',
    pin2Number: 'pin2Number',
    kiNumber: 'kiNumber',
    imeinumber: 'imeinumber',
    PUK1: 'PUK1',
    PUK2: 'PUK2'
  },
  productKeyAtributes: [
    'MSISDNProductSpec',
    'FXLNumProductSpec',
    'UserAccessProductSpec',
    'GoodsProductSpec',
    'UsageVolumeProductSpec'
  ],
  userPermissions: {
    changePassword: 'bss-cbs.fe.changePassword.allow',
    deactivate: 'bss-cbs.fe.deactivate.allow'
  },
  minAge: 18,
  chequeValidDate: 3,
};

export default constants;
