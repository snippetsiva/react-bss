/**
 * NOTE: In case we introduce a new field with format as enum (dropdown option)
 * for corresponding field -> enumData needs to be added in code which will need
 * code changes and deployment
 */
const todayDate = new Date();

export default {
  order: [
    'givenName',
    'middleName',
    'familyName',
    'dob',
    'customerCategory',
    'customerSubCategory',
    'riskCategory',
    'uniqueIdentificationNumber'
  ],
  optionalFields: [
    'nationality',
    'gender',
    'maritalStatus',
    'fathersName',
    'mothersName',
    'title',
    'suffix',
    'vip'
  ],
  requiredFields: ['givenName', 'familyName', 'uniqueIdentificationNumber'],
  otherFields: [
    'middleName',
    'dob',
    'customerCategory',
    'customerSubCategory',
    'riskCategory'
  ],
  properties: {
    givenName: {
      id: 'givenName',
      title: 'First Name',
      type: 'string',
      maxLength: 150,
      pattern:
        '^[a-zA-Z\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u06540-9s#/_\\-]+$'
    },
    middleName: {
      id: 'middleName',
      title: 'Middle Name',
      type: 'string',
      maxLength: 40,
      pattern:
        '^[a-zA-Z\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u06540-9s#/_\\-]+$'
    },
    familyName: {
      id: 'familyName',
      title: 'Last Name',
      type: 'string',
      maxLength: 40,
      pattern:
        '^[a-zA-Z\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u06540-9s#/_\\-]+$'
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
    maritalStatus: {
      id: 'maritalStatus',
      title: 'Marital Status',
      type: 'string',
      format: 'enum'
    },
    uniqueIdentificationNumber: {
      id: 'uniqueIdentificationNumber',
      title: 'ID Number',
      type: 'string'
    },
    fathersName: {
      id: 'fathersName',
      title: `Father's Name`,
      type: 'string'
    },
    mothersName: {
      id: 'mothersName',
      title: `Mother's Name`,
      type: 'string'
    },
    title: {
      id: 'title',
      title: 'Prefix',
      type: 'string',
      format: 'enum'
    },
    suffix: {
      id: 'suffix',
      title: 'Suffix',
      type: 'string',
      format: 'enum'
    },
    vip: {
      id: 'vip',
      title: 'VIP Customer',
      type: 'boolean',
      enum: [true, false]
    }
  }
};
