/**
 * NOTE: In case we introduce a new field with format as enum (dropdown option)
 * for corresponding field -> enumData needs to be added in code which will need
 * code changes and deployment
 */
export default {
  order: [
    'companyName',
    'registrationNumber',
    'registrationExpiryDate',
    'vatNumber',
    'profileAbbreviation',
    'customerCategory',
    'customerSubCategory',
    'riskCategory',
    'vip',
    'taxExempted',
    'taxExemptionDate',
    'tax'
  ],
  dependencies: [
    {
      parent: 'taxExempted',
      condition: { enum: [true] },
      falseCondition: { enum: [false] },
      child: 'taxExemptionDate'
    }
  ],
  requiredFields: [
    'companyName',
    'registrationNumber',
    'vatNumber',
    'registrationExpiryDate',
    'profileAbbreviation',
    'customerCategory',
    'customerSubCategory',
    'riskCategory',
    'vip'
  ],
  otherFields: ['taxExempted'],
  optionalFields: [
    'annualTurnOver',
    'businessType',
    'industry',
    'keyAccountGroup',
    'numberOfEmployees',
    'websiteUrl',
    'linkedinUrl'
  ],
  properties: {
    companyName: {
      id: 'companyName',
      title: 'Company Name',
      type: 'string',
      maxLength: 150
    },
    registrationNumber: {
      id: 'registrationNumber',
      title: 'Registration No',
      type: 'string',
      maxLength: 40
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
      pattern: '^[A-Z]',
      placeholder: 'ABCD',
      maxLength: 6
    },
    customerCategory: {
      id: 'customerCategory',
      title: 'Customer Category',
      type: 'string',
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
    vip: {
      id: 'vip',
      title: 'VIP Customer',
      type: 'boolean'
    },
    taxExempted: {
      id: 'taxExempted',
      title: 'TAX Exempted',
      type: 'boolean'
    },
    OptionalDetails: {
      id: 'OptionalDetails',
      type: 'string',
      title: 'Optional Details',
      variant: 'subHeading'
    },
    annualTurnOver: {
      id: 'annualTurnOver',
      title: 'annual turnover',
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
      maxLength: 100,
      pattern:
        '^(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$'
    },
    linkedinUrl: {
      id: 'linkedinUrl',
      title: 'Linkedin url',
      type: 'string',
      maxLength: 100
    }
  },
  dependantProperties: {
    taxExemptionDate: {
      id: 'taxExemptionDate',
      title: 'Exemption date',
      type: 'string',
      format: 'date',
      disableFeatureOnUpdate: 'disableMinDate',
      disableOnEdit: true
    }
  }
};
