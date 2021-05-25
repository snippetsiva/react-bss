/**
 * NOTE: In case we introduce a new field with format as enum (dropdown option)
 * for corresponding field -> enumData needs to be added in code which will need
 * code changes and deployment
 */
const todayDate = new Date();
export default {
  order: [
    'companyName',
    'registrationNumber',
    'nationalId',
    'profileAbbreviation',
    'customerCategory',
    'customerSubCategory',
    'riskCategory',
    'registrationDate',
    'nationality',
    'country',
    'numberOfEmployees',
    'telephone',
    'industry',
    'businessType',
    'taxExempted',
    // 'taxExemptionDate', // TODO: remove after it's tested
    'vip',
    'registrationExpiryDate'
  ],
  dependencies: [
    // { // TODO: remove after it's tested
    //   parent: 'taxExempted',
    //   condition: { enum: [true] },
    //   falseCondition: { enum: [false] },
    //   child: 'taxExemptionDate'
    // }
  ],
  requiredFields: [
    'profileAbbreviation',
    'companyName',
    'registrationNumber',
    'registrationDate',
    'nationalId',
    'customerCategory',
    'customerSubCategory',
    'nationality',
    'country',
    'businessType',
    'industry',
    'telephone',
    'numberOfEmployees',
    'riskCategory',
    'vip'
  ],
  otherFields: [],
  optionalFields: [
    'companyFaxNumber',
    'applicationMode',
    'annualTurnOver',
    'keyAccountGroup',
    'websiteUrl',
    'linkedinUrl'
  ],
  properties: {
    companyName: {
      id: 'companyName',
      title: 'Company Name',
      type: 'string',
      maxLength: 500,
      pattern:
      '^([a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654]+[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654\u06F0-\u06F90-9]{1,500})+$'
    },
    registrationNumber: {
      id: 'registrationNumber',
      title: 'Registration Number',
      type: 'string',
      minLength: 6,
      maxLength: 12,
      pattern: '^([0-9\u06F0-\u06F9]{6,12})+$',
      placeholder: '123456789012'
    },
    registrationDate: {
      id: 'registrationDate',
      title: 'Registration Date',
      type: 'string',
      format: 'date',
      disableMinDate: true,
      maxDate: todayDate,
      disableOnEdit: true,
      default: null
    },
    nationalId: {
      id: 'nationalId',
      title: 'Company National ID',
      type: 'string',
      minLength: 10,
      maxLength: 12,
      pattern: '^([0-9\u06F0-\u06F9]{10,12})+$',
      placeholder: '12345678901'
    },
    registrationExpiryDate: {
      id: 'registrationExpiryDate',
      title: 'Registration Expiry date',
      type: 'string',
      format: 'date',
      disableFeatureOnUpdate: 'disableMinDate',
      disableOnEdit: true,
      default: null
    },
    vatNumber: {
      id: 'vatNumber',
      title: 'VAT/TIN Number',
      type: 'string',
      pattern: '[A-Z][0-9]{10}',
      placeholder: 'A1234567890',
      maxLength: 15
    },
    profileAbbreviation: {
      id: 'profileAbbreviation',
      title: 'Profile Abbreviation',
      type: 'string',
      pattern: '[a-zA-Z0-9]{4,6}',
      placeholder: 'Abcd25',
      maxLength: 4,
      maxLength: 6
    },
    customerCategory: {
      id: 'customerCategory',
      title: 'Customer Category',
      type: 'string',
      readOnly: true,
      format: 'enum'
    },
    customerSubCategory: {
      id: 'customerSubCategory',
      title: 'Sub Category',
      type: 'string',
      format: 'enum'
    },
    riskCategory: {
      id: 'riskCategory',
      title: 'Risk Category',
      type: 'string',
      readOnly: true,
      format: 'enum'
    },
    nationality: {
      id: 'nationality',
      title: 'Nationality',
      type: 'string',
      readOnly: true,
      format: 'enum'
    },
    country: {
      id: 'country',
      title: 'Country',
      type: 'string',
      readOnly: true,
      format: 'enum'
    },
    vip: {
      id: 'vip',
      title: 'VIP Customer',
      type: 'boolean'
    },
    taxExempted: {
      id: 'taxExempted',
      title: 'TAX Exempted',
      type: 'boolean',
      default: false
    },
    telephone: {
      id: 'telephone',
      title: 'Telephone (Office)',
      type: 'string',
      minLength: 7,
      maxLength: 13,
      pattern: '^([0\u06F0]+[\u06F0-\u06F90-9]{6,12})+$',
      placeholder: '0211234567890'
    },
    annualTurnOver: {
      id: 'annualTurnOver',
      title: 'annual turnover',
      type: 'string',
      format: 'enum'
    },
    companyFaxNumber: {
      id: 'companyFaxNumber',
      title: 'Company Fax Number',
      type: 'string',
      minLength: 7,
      maxLength: 13,
      pattern: '^([0\u06F0]+[\u06F0-\u06F90-9]{6,12})+$',
      placeholder: '0211234567890'
    },
    applicationMode: {
      id: 'applicationMode',
      title: 'Application Mode',
      type: 'string',
      format: 'enum'
    },
    businessType: {
      id: 'businessType',
      title: 'business type',
      type: 'string',
      format: 'enum'
    },
    industry: {
      id: 'industry',
      title: 'Industry',
      type: 'string',
      format: 'enum'
    },
    keyAccountGroup: {
      id: 'keyAccountGroup',
      title: 'key account group',
      type: 'string',
      format: 'enum'
    },
    numberOfEmployees: {
      id: 'numberOfEmployees',
      title: 'Number of employee',
      type: 'string',
      format: 'enum'
    },
    websiteUrl: {
      id: 'websiteUrl',
      title: 'Website url',
      type: 'string',
      placeholder: 'www.mtnirancell.ir',
      pattern:
        '^(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$'
    },
    linkedinUrl: {
      id: 'linkedinUrl',
      title: 'Linkedin url',
      type: 'string'
    }
  },
  dependantProperties: {
    // taxExemptionDate: { // TODO: remove after it's tested
    //   id: 'taxExemptionDate',
    //   title: 'Exemption date',
    //   type: 'string',
    //   format: 'date',
    //   disableFeatureOnUpdate: 'disableMinDate',
    //   disableOnEdit: true
    // }
  }
};
