import SwitchComponent from 'common/components/CardComponent/SwitchComponent';
import DatePickerWrapper from 'common/components/CardComponent/DatePickerWrapper';
import _get from 'lodash/get';
import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';

export const placeHolderValue = '---';

export const placeHolderObject = [{ name: '', label: placeHolderValue, code: '0', id: '0' }];

const getEnumData = enumData => {
  if (!enumData || _get(enumData, 'enum', []).length < 1) {
    return {
      readOnly: true
    };
  }
  return enumData;
};
export const updateCustomFields = customFields => {
  optionalPropertiesKeys.forEach(element => {
    if (!customFields[element]) {
      customFields[element] = undefined;
    }
  });
  return customFields;
};
const requiredFields = [
  'companyName',
  'registrationNumber'
  // 'customerCategory',
  // 'customerSubCategory',
  // 'taxPolicy',
  // 'riskCategory'
];

export const optionalPropertiesKeys = [
  'annualTurnOver',
  'businessType',
  'industry',
  'keyAccountGroup',
  'numberOfEmployees',
  'vip',
  'websiteUrl'
];
const todayDate = new Date();

export const getCustomerSchemaOld = (propertyEnums, isEdit = false, isUpdate = false, customProperties) => {
  const {
    customerCategoryEnums = {},
    subCategoryEnums = {},
    // taxPolicyEnums = {},
    riskCategoryEnums = {},
    incomeRangeEnums = {},
    companyTypeEnums = {},
    keyAccountGroupEnums = {},
    industryEnums = {},
    employeesEnums = {}
  } = propertyEnums || {};
  const lineField = isEdit
    ? {}
    : {
        line: {
          type: 'string',
          variant: 'horizontalLine'
        }
      };

  return {
    uiSchema: {
      taxExemptionDate: { 'ui:widget': DatePickerWrapper },
      registrationExpiryDate: { 'ui:widget': DatePickerWrapper },
      taxExempted: { 'ui:widget': SwitchComponent },
      vip: { 'ui:widget': SwitchComponent },
      'ui:order': [
        'companyName',
        'registrationNumber',
        'registrationExpiryDate',
        'vatNumber',
        'profileAbbreviation',
        'customerCategory',
        'customerSubCategory',
        // 'taxPolicy',
        'riskCategory',
        'vip',
        'taxExempted',
        'taxExemptionDate',
        '*'
      ]
    },
    jsonSchema: {
      required: requiredFields,
      dependencies: {
        taxExempted: {
          oneOf: [
            {
              properties: {
                taxExempted: {
                  enum: [true]
                },
                taxExemptionDate: {
                  id: 'taxExemptionDate',
                  title: 'Exemption date',
                  type: 'string',
                  format: 'date',
                  disableMinDate: !!isUpdate,
                  disabled: !isEdit
                }
              }
            },
            {
              properties: {
                taxExempted: {
                  enum: [false]
                }
              }
            }
          ]
        }
      },
      properties: {
        companyName: {
          id: 'companyName',
          title: 'Company Name',
          // title: <Trans>Company Name</Trans>,
          type: 'string',
          maxLength: 150,
          ..._get(customProperties, 'companyName', {})
        },
        registrationNumber: {
          id: 'registrationNumber',
          title: 'Registration No',
          // title: <Trans>Registration No</Trans>,
          type: 'string',
          maxLength: 40,
          ..._get(customProperties, 'registrationNumber', {})
        },
        registrationExpiryDate: {
          id: 'registrationExpiryDate',
          title: 'Registration Expiry Date',
          // title: <Trans>Registration Expiry Date</Trans>,
          type: 'string',
          format: 'date',
          // disableMinDate: !!isUpdate,
          disabled: !isEdit,
          default: null
        },
        vatNumber: {
          id: 'vatNumber',
          title: 'VAT/TIN Number',
          // title: <Trans>VAT/TIN Number</Trans>,
          type: 'string',
          pattern: '[A-Z][0-9]{10}',
          placeholder: 'A1234567890',
          maxLength: 15,
          ..._get(customProperties, 'vatNumber', {})
        },
        profileAbbreviation: {
          id: 'profileAbbreviation',
          title: 'Profile Abbreviation',
          // title: <Trans>Profile Abbreviation</Trans>,
          type: 'string',
          pattern: '^[A-Z]',
          placeholder: 'ABCD',
          maxLength: 6,
          ..._get(customProperties, 'profileAbbreviation', {})
        }
        // customerCategory: {
        //   id: 'customerCategory',
        //   title: 'Customer Category',
        //   type: 'string',
        //   ...getEnumData(customerCategoryEnums),
        //   ..._get(customProperties, 'customerCategory', {})
        // },
        // customerSubCategory: {
        //   id: 'customerSubCategory',
        //   title: 'Sub Category',
        //   type: 'string',
        //   ...getEnumData(subCategoryEnums),
        //   ..._get(customProperties, 'customerSubCategory', {})
        // },
        // taxPolicy: {
        //   id: 'taxPolicy',
        //   title: 'Tax policy',
        //   type: 'string',
        //   ...getEnumData(taxPolicyEnums),
        //   ..._get(customProperties, 'taxPolicy', {})
        // },
        // riskCategory: {
        //   id: 'riskCategory',
        //   title: 'Risk Category',
        //   type: 'string',
        //   ...getEnumData(riskCategoryEnums),
        //   readOnly: true,
        //   ..._get(customProperties, 'riskCategory', {})
        // },
        // vip: {
        //   id: 'vip',
        //   title: 'VIP Customer',
        //   type: 'boolean',
        //   enum: [true, true]
        // },
        // taxExempted: {
        //   id: 'taxExempted',
        //   title: 'TAX Exempted',
        //   type: 'boolean',
        //   enum: [true, false],
        //   ..._get(customProperties, 'taxExempted', {})
        // }
      },
      optionalProperties: {
        ...lineField,
        heading: {
          type: 'string',
          title: 'Optional Details',
          variant: 'subHeading'
        },
        annualTurnOver: {
          id: 'annualTurnOver',
          title: 'annual turnover',
          type: 'string',
          ...incomeRangeEnums
        },
        businessType: {
          id: 'businessType',
          title: 'business type',
          type: 'string',
          ...companyTypeEnums
        },
        industry: {
          id: 'industry',
          title: 'Industry',
          type: 'string',
          ...industryEnums
        },
        keyAccountGroup: {
          id: 'keyAccountGroup',
          title: 'key account group',
          type: 'string',
          ...keyAccountGroupEnums
        },
        numberOfEmployees: {
          id: 'numberOfEmployees',
          title: 'Number of employee',
          type: 'string',
          ...employeesEnums
        },
        websiteUrl: {
          id: 'websiteUrl',
          title: 'Website url',
          type: 'string',
          pattern:
            '^(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$'
        },
        linkedinUrl: {
          id: 'linkedinUrl',
          title: 'Linkedin url',
          type: 'string'
        }
      }
    }
  };
};

export const getCustomerSchema = (propertyEnums, isEdit = false, isUpdate = false, customProperties, fields) => {
  const jsonSchema = generateJSONSchema(propertyEnums, fields, customProperties, isEdit);
  const { mandatoryFields, optionalFields, requiredFields } = jsonSchema;
  const lineField = isEdit
    ? {}
    : {
        line: {
          type: 'string',
          variant: 'horizontalLine'
        }
      };

  return {
    uiSchema: {
      dateOfBirth: { 'ui:widget': DatePickerWrapper },
      taxExemptionDate: { 'ui:widget': DatePickerWrapper },
      registrationExpiryDate: { 'ui:widget': DatePickerWrapper },
      taxExempted: { 'ui:widget': SwitchComponent },
      vip: { 'ui:widget': SwitchComponent },
      'ui:order': [...requiredFields, '*']
    },
    jsonSchema: {
      required: requiredFields,
      properties: mandatoryFields,
      optionalProperties: {
        ...lineField,
        heading: {
          type: 'string',
          title: 'Optional Details',
          variant: 'subHeading'
        },
        ...optionalFields
      }
    }
  };
};

const generateJSONSchema = (propertyEnums, fields, customProperties, isEdit) => {
  const {
    incomeRangeEnums = {},
    companyTypeEnums = {},
    keyAccountGroupEnums = {},
    industryEnums = {},
    employeesEnums = {},
    genderEnums = {},
    maritalStatusEnums = {},
    titleEnums = {},
    suffixEnums = {},
    nationalityEnums = {}
  } = propertyEnums || {};

  // const activeFields = {
  //   companyName: false,
  //   registrationNumber: false,
  //   registrationExpiryDate: false,
  //   vatNumber: false,
  //   profileAbbreviation: false,
  //   annualTurnOver: false,
  //   businessType: false,
  //   taxPolicy: false,
  //   industry: false,
  //   numberOfEmployees: false,
  //   websiteUrl: false,
  //   linkedinUrl: false,
  //   keyAccountGroup: false,
  //   // for testing ----------
  //   example: {
  //     code: 'example',
  //     isEditable: true,
  //     isMandatory: true,
  //     name: 'Example',
  //     dataType: 'string',
  //     default: 'Hello Example'
  //   }
  // };

  const activeFields = {};
  let isNotMandatory = false;

  _.forEach(_.filter(fields, item => item.isVisible) || [], field => {
    activeFields[field.code] = field;
    if (!isNotMandatory && field.isMandatory === false) isNotMandatory = true;
  });

  const mandatoryFields = [];
  const optionalFields = [];

  const finalMandatoryFields = {};
  const finalOptionalFields = {};

  /**
   * @Test with Example field in activeFields
   * NOTE: If any new field came in future, new if statement for the particular field will be need to created.
   */

  // Organization Properties
  if (activeFields.companyName) {
    (activeFields.companyName.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.companyName.code]: {
        id: activeFields.companyName.code,
        title: activeFields.companyName.name,
        type: activeFields.companyName.dataType,
        maxLength: 150,
        readOnly: !activeFields.companyName.isEditable
        // ..._get(customProperties, 'companyName', {})
      }
    });
  }
  if (activeFields.registrationNumber) {
    (activeFields.registrationNumber.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.registrationNumber.code]: {
        id: activeFields.registrationNumber.code,
        title: activeFields.registrationNumber.name,
        type: activeFields.registrationNumber.dataType,
        maxLength: 40,
        readOnly: !activeFields.registrationNumber.isEditable,
        default: activeFields.registrationNumber.default
        // ..._get(customProperties, 'registrationNumber', {})
      }
    });
  }
  if (activeFields.registrationExpiryDate) {
    (activeFields.registrationExpiryDate.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.registrationExpiryDate.code]: {
        id: activeFields.registrationExpiryDate.code,
        title: activeFields.registrationExpiryDate.name,
        type: 'string',
        format: 'date',
        // disableMinDate: !!isUpdate,
        disabled: !activeFields.registrationExpiryDate.isEditable,
        default: null,
        asterisk: isEdit
      }
    });
  }
  if (activeFields.vatNumber) {
    (activeFields.vatNumber.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.vatNumber.code]: {
        id: activeFields.vatNumber.code,
        title: activeFields.vatNumber.name,
        type: activeFields.vatNumber.dataType,
        pattern: '[A-Z][0-9]{10}',
        placeholder: 'A1234567890',
        maxLength: 15,
        readOnly: !activeFields.vatNumber.isEditable
        // ..._get(customProperties, 'vatNumber', {})
      }
    });
  }
  if (activeFields.profileAbbreviation) {
    (activeFields.profileAbbreviation.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.profileAbbreviation.code]: {
        id: activeFields.profileAbbreviation.code,
        title: activeFields.profileAbbreviation.name,
        type: activeFields.profileAbbreviation.dataType,
        pattern: '^[A-Z]',
        placeholder: 'ABCD',
        maxLength: 6,
        readOnly: !activeFields.profileAbbreviation.isEditable
        // ..._get(customProperties, 'profileAbbreviation', {})
      }
    });
  }
  if (activeFields.annualTurnOver) {
    (activeFields.annualTurnOver.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.annualTurnOver.code]: {
        id: activeFields.annualTurnOver.code,
        title: activeFields.annualTurnOver.name,
        type: 'string',
        ...incomeRangeEnums
      }
    });
  }
  if (activeFields.businessType) {
    (activeFields.businessType.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.businessType.code]: {
        id: activeFields.businessType.code,
        title: activeFields.businessType.name,
        type: 'string',
        ...companyTypeEnums
      }
    });
  }
  if (activeFields.industry) {
    (activeFields.industry.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.industry.code]: {
        id: activeFields.industry.code,
        title: activeFields.industry.name,
        type: 'string',
        ...industryEnums
      }
    });
  }
  if (activeFields.keyAccountGroup) {
    (activeFields.keyAccountGroup.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.keyAccountGroup.code]: {
        id: activeFields.keyAccountGroup.code,
        title: activeFields.keyAccountGroup.name,
        type: 'string',
        ...keyAccountGroupEnums
      }
    });
  }
  if (activeFields.numberOfEmployees) {
    (activeFields.numberOfEmployees.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.numberOfEmployees.code]: {
        id: activeFields.numberOfEmployees.code,
        title: activeFields.numberOfEmployees.name,
        type: 'string',
        ...employeesEnums
      }
    });
  }
  if (activeFields.websiteUrl) {
    (activeFields.websiteUrl.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.websiteUrl.code]: {
        id: activeFields.websiteUrl.code,
        title: activeFields.websiteUrl.name,
        type: activeFields.websiteUrl.dataType,
        pattern:
          '^(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$'
      }
    });
  }
  if (activeFields.linkedinUrl) {
    (activeFields.linkedinUrl.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.linkedinUrl.code]: {
        id: activeFields.linkedinUrl.code,
        title: activeFields.linkedinUrl.name,
        type: activeFields.linkedinUrl.dataType,
        placeholder: activeFields.linkedinUrl.placeholder || 'Enter URL'
      }
    });
  }

  // Individual Properties
  if (activeFields.firstName) {
    (activeFields.firstName.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.firstName.code]: {
        id: activeFields.firstName.code,
        title: activeFields.firstName.name,
        type: activeFields.firstName.dataType,
        readOnly: !activeFields.firstName.isEditable,
        maxLength: 150,
        default: activeFields.firstName.default
      }
    });
  }
  if (activeFields.middleName) {
    (activeFields.middleName.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.middleName.code]: {
        id: activeFields.middleName.code,
        title: activeFields.middleName.name,
        type: activeFields.middleName.dataType,
        readOnly: !activeFields.middleName.isEditable,
        maxLength: 150
      }
    });
  }
  if (activeFields.lastName) {
    (activeFields.lastName.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.lastName.code]: {
        id: activeFields.lastName.code,
        title: activeFields.lastName.name,
        type: activeFields.lastName.dataType,
        readOnly: !activeFields.lastName.isEditable,
        maxLength: 150
      }
    });
  }
  if (activeFields.dateOfBirth) {
    (activeFields.dateOfBirth.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.dateOfBirth.code]: {
        id: activeFields.dateOfBirth.code,
        title: activeFields.dateOfBirth.name,
        type: 'string',
        format: 'date',
        disableMinDate: true,
        maxDate: dayjs(todayDate).subtract(18, 'year'),
        default: null,
        disabled: !activeFields.dateOfBirth.isEditable,
        asterisk: isEdit
      }
    });
  }
  if (activeFields.nationality) {
    (activeFields.nationality.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.nationality.code]: {
        id: activeFields.nationality.code,
        title: activeFields.nationality.name,
        readOnly: !activeFields.nationality.isEditable,
        type: 'string',
        ...nationalityEnums
      }
    });
  }
  if (activeFields.gender) {
    (activeFields.gender.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.gender.code]: {
        id: activeFields.gender.code,
        title: activeFields.gender.name,
        readOnly: !activeFields.gender.isEditable,
        type: 'string',
        ...genderEnums
      }
    });
  }
  if (activeFields.maritalStatus) {
    (activeFields.maritalStatus.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.maritalStatus.code]: {
        id: activeFields.maritalStatus.code,
        title: activeFields.maritalStatus.name,
        readOnly: !activeFields.maritalStatus.isEditable,
        type: 'string',
        ...maritalStatusEnums
      }
    });
  }
  if (activeFields.fatherName) {
    (activeFields.fatherName.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.fatherName.code]: {
        id: activeFields.fatherName.code,
        title: activeFields.fatherName.name,
        readOnly: !activeFields.fatherName.isEditable,
        type: 'string'
      }
    });
  }
  if (activeFields.motherName) {
    (activeFields.motherName.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.motherName.code]: {
        id: activeFields.motherName.code,
        title: activeFields.motherName.name,
        readOnly: !activeFields.motherName.isEditable,
        type: 'string'
      }
    });
  }
  if (activeFields.prefix) {
    (activeFields.prefix.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.prefix.code]: {
        id: activeFields.prefix.code,
        title: activeFields.prefix.name,
        readOnly: !activeFields.prefix.isEditable,
        type: 'string',
        ...titleEnums
      }
    });
  }
  if (activeFields.suffix) {
    (activeFields.suffix.isMandatory ? mandatoryFields : optionalFields).push({
      [activeFields.suffix.code]: {
        id: activeFields.suffix.code,
        title: activeFields.suffix.name,
        readOnly: !activeFields.suffix.isEditable,
        type: 'string',
        ...suffixEnums
      }
    });
  }

  mandatoryFields.forEach(field => {
    finalMandatoryFields[Object.keys(field)] = field[Object.keys(field)];
  });
  optionalFields.forEach(field => {
    finalOptionalFields[Object.keys(field)] = field[Object.keys(field)];
  });

  const requiredFields = Object.keys(finalMandatoryFields);

  return { mandatoryFields: finalMandatoryFields, optionalFields: finalOptionalFields, requiredFields };
};

const requiredFieldForSelfReg = [
  'companyName',
  'registrationNumber',
  'vatNumber',
  'customerCategory',
  'customerSubCategory'
];

export const getSelfRegistrationCustomerSchema = (propertyEnums, customProperties) => {
  const { customerCategoryEnums = {}, subCategoryEnums = {} } = propertyEnums || {};

  return {
    uiSchema: {
      'ui:order': ['companyName', 'registrationNumber', 'vatNumber', 'customerCategory', 'customerSubCategory', '*']
    },
    jsonSchema: {
      required: requiredFieldForSelfReg,
      properties: {
        companyName: {
          id: 'companyName',
          title: 'Company Name',
          type: 'string',
          maxLength: 150,
          ..._get(customProperties, 'companyName', {})
        },
        registrationNumber: {
          id: 'registrationNumber',
          title: 'Registration No',
          type: 'string',
          maxLength: 40,
          ..._get(customProperties, 'registrationNumber', {})
        },
        vatNumber: {
          id: 'vatNumber',
          title: 'VAT/TIN Number',
          type: 'string',
          pattern: '[A-Z][0-9]{10}',
          placeholder: 'A1234567890',
          maxLength: 15,
          ..._get(customProperties, 'vatNumber', {})
        },
        customerCategory: {
          id: 'customerCategory',
          title: 'Customer Category',
          type: 'string',
          ...getEnumData(customerCategoryEnums),
          ..._get(customProperties, 'customerCategory', {})
        },
        customerSubCategory: {
          id: 'customerSubCategory',
          title: 'Sub Category',
          type: 'string',
          ...getEnumData(subCategoryEnums),
          ..._get(customProperties, 'customerSubCategory', {})
        }
      }
    }
  };
};

export const sanitizeFormData = (formData, isEdit) => {
  (requiredFields || []).forEach(keyName => {
    if (formData[keyName] === '') {
      if (isEdit) {
        delete formData[keyName];
      } else {
        formData[keyName] = placeHolderValue;
      }
    }
  });
  (optionalPropertiesKeys || []).forEach(keyName => {
    if (formData[keyName] === undefined || formData[keyName] === '') {
      if (!isEdit) {
        formData[keyName] = placeHolderValue;
      }
    }
  });
  return formData;
};

export const getIndividualCustomerSchema = (propertyEnums, isEdit = false, isUpdate = false, customProperties) => {
  const {
    customerCategoryEnums = {},
    subCategoryEnums = {},
    riskCategoryEnums = {},
    genderEnums = {},
    maritalStatusEnums = {},
    titleEnums = {},
    suffixEnums = {},
    nationalityEnums = {}
  } = propertyEnums || {};
  const lineField = isEdit
    ? {}
    : {
        line: {
          type: 'string',
          variant: 'horizontalLine'
        }
      };

  return {
    uiSchema: {
      dateOfBirth: { 'ui:widget': DatePickerWrapper },
      'ui:order': [
        'firstName',
        'middleName',
        'lastName',
        'dateOfBirth',
        // 'customerCategory',
        // 'customerSubCategory',
        // 'riskCategory',
        // 'idNumber',
        '*'
      ]
    },
    jsonSchema: {
      // required: {},
      // dependencies: {},

      properties: {
        firstName: {
          id: 'firstName',
          title: 'FIRST NAME',
          type: 'string',
          maxLength: 150,
          ..._get(customProperties, 'firstName', {})
        },
        middleName: {
          id: 'middleName',
          title: 'MIDDLE NAME',
          type: 'string',
          maxLength: 150,
          ..._get(customProperties, 'middleName', {})
        },
        lastName: {
          id: 'lastName',
          title: 'LAST NAME',
          type: 'string',
          maxLength: 150
        },
        dateOfBirth: {
          id: 'dateOfBirth',
          title: 'DATE OF BIRTH',
          type: 'string',
          format: 'date',
          disableMinDate: true,
          maxDate: dayjs(todayDate).subtract(18, 'year'),
          default: null
        }
        // customerCategory: {
        //   id: 'customerCategory',
        //   title: 'CUSTOMER CATEGORY',
        //   type: 'string'
        //   // ...getEnumData(customerCategoryEnums)
        // },
        // customerSubCategory: {
        //   id: 'customerSubCategory',
        //   title: 'CUSTOMER SUBCATEGORY',
        //   type: 'string'
        //   // ...getEnumData(subCategoryEnums)
        // },
        // riskCategory: {
        //   id: 'riskCategory',
        //   title: 'RISK CATEGORY',
        //   type: 'string',
        //   ...getEnumData(riskCategoryEnums),
        //   readOnly: true,
        //   ..._get(customProperties, 'riskCategory', {})
        // },
        // idNumber: {
        //   id: 'idNumber',
        //   title: 'ID NUMBER',
        //   type: 'string',
        //   maxLength: 150
        // }
      },
      optionalProperties: {
        ...lineField,
        heading: {
          type: 'string',
          title: 'Optional Details',
          variant: 'subHeading'
        },
        nationality: {
          id: 'nationality',
          title: 'NATIONALITY',
          type: 'string',
          ...nationalityEnums
        },
        gender: {
          id: 'gender',
          title: 'GENDER',
          type: 'string',
          ...genderEnums
        },
        maritalStatus: {
          id: 'maritalStatus',
          title: 'MARITAL STATUS',
          type: 'string',
          ...maritalStatusEnums
        },
        fatherName: {
          id: 'fatherName',
          title: 'FATHER NAME',
          type: 'string'
        },
        motherName: {
          id: 'motherName',
          title: 'MOTHER NAME',
          type: 'string'
        },
        prefix: {
          id: 'prefix',
          title: 'PREFIX',
          type: 'string',
          ...titleEnums
        },
        suffix: {
          id: 'suffix',
          title: 'SUFFIX',
          type: 'string',
          ...suffixEnums
        }
      }
    }
  };
};
