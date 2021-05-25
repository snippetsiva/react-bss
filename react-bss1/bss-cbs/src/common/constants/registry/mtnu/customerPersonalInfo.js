/**
 * NOTE: In case we introduce a new field with format as enum (dropdown option)
 * for corresponding field -> enumData needs to be added in code which will need
 * code changes and deployment
 */
const todayDate = new Date();

export default {
  order: [
    'title',
    'givenName',
    'middleName',
    'familyName',
    'dob',
    'customerCategory',
    'customerSubCategory',
    'riskCategory',
    'gender',
    'vip',
    'country',
    'nationality',
    'documentType',
    'uniqueIdentificationNumber',
    'visaExpiryDate'
  ],
  requiredFields: [
    'givenName',
    'familyName',
    'gender',
    'dob',
    'uniqueIdentificationNumber',
    'country',
    'nationality',
    'documentType',
    'customerCategory',
    'customerSubCategory',
    'riskCategory'
  ],
  otherFields: ['middleName', 'title', 'vip', 'visaExpiryDate'],
  // dependencies: [
  //   {
  //     parent: 'documentType',
  //     condition: { enum: ['passport'] },
  //     falseCondition: { enum: [] },
  //     child: 'visaExpiryDate'
  //   }
  // ],
  properties: {
    givenName: {
      id: 'givenName',
      title: 'First Name',
      type: 'string',
      maxLength: 150
    },
    middleName: {
      id: 'middleName',
      title: 'Middle Name',
      type: 'string',
      maxLength: 40
    },
    familyName: {
      id: 'familyName',
      title: 'Last Name',
      type: 'string',
      maxLength: 40
    },
    dob: {
      id: 'dob',
      title: 'Date of Birth',
      type: 'string',
      format: 'date',
      disableMinDate: true,
      maxDate: todayDate.setFullYear(todayDate.getFullYear() - 18),
      default: null
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
    nationality: {
      id: 'nationality',
      title: 'Nationality',
      type: 'string',
      format: 'enum'
    },
    gender: {
      id: 'gender',
      title: 'Gender',
      type: 'string',
      format: 'enum'
    },
    uniqueIdentificationNumber: {
      id: 'uniqueIdentificationNumber',
      title: 'ID Number',
      type: 'string',
      maxLength: 100
    },
    title: {
      id: 'title',
      title: 'Title',
      type: 'string',
      format: 'enum'
    },
    vip: {
      id: 'vip',
      title: 'VIP Customer',
      type: 'boolean',
      enum: [true, false]
    },
    country: {
      id: 'country',
      title: 'Country',
      type: 'string',
      format: 'enum'
    },
    documentType: {
      id: 'documentType',
      title: 'ID Type',
      type: 'string',
      format: 'enum'
    }
  }
  // dependantProperties: {
  //   visaExpiryDate: {
  //     id: 'visaExpiryDate',
  //     title: 'Visa Expiry Date',
  //     type: 'string',
  //     format: 'date',
  //     disableFeatureOnUpdate: 'disableMinDate',
  //     disableOnEdit: true,
  //     default: null
  //   }
  // }
};
