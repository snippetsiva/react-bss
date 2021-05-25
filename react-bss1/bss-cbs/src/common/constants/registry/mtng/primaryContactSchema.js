/**
 * NOTE: In case we introduce a new field with format as enum (dropdown option)
 * for corresponding field -> enumData needs to be added in code which will need
 * code changes and deployment
 */
const primaryContactSchema = (enableUseProfile) => {
  const todayDate = new Date();
  let schema = {
    order: ['name', 'lastName', 'mobile', 'email', 'gender', 'birthDate', 'contactMedium'],
    requiredFields: ['name', 'lastName', 'mobile', 'email', 'contactMedium', 'gender', 'birthDate'],
    optionalFields: ['alternateMobile', 'alternateEmail'],
    properties: {
      name: {
        id: 'name',
        title: 'First Name',
        type: 'string',
        maxLength: 150,
        pattern: '^[a-zA-Z ]+$'
      },
      lastName: {
        id: 'lastName',
        title: 'Last Name',
        type: 'string',
        maxLength: 40,
        pattern: '^[a-zA-Z ]+$'
      },
      mobile: {
        id: 'mobile',
        title: 'mobile number',
        type: 'string',
        maxLength: 10,
        pattern: '[0-9]{10}',
        readOnlyFormat: 'mobile'
        // maxLength: constants.fieldLengths.mobile,
        // pattern: constants.regex.regexAsString.mobile
      },
      email: {
        id: 'email',
        title: 'email',
        type: 'string',
        maxLength: 100,
        pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'
      },
      alternateMobile: {
        id: 'alternateMobile',
        title: 'Alternate mobile number',
        type: 'string',
        maxLength: 10,
        pattern: '[0-9]{10}'
      },
      alternateEmail : {
        id: 'alternateEmail',
        title: 'Alternate email',
        type: 'string',
        maxLength: 100,
        pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'
      },
      birthDate: {
        id: 'birthDate',
        title: 'Date of Birth',
        type: 'string',
        format: 'date',
        disableMinDate: true,
        maxDate: new Date(todayDate.setFullYear(todayDate.getFullYear() - 18)),
        default: null
      },
      gender: {
        id: 'gender',
        title: 'Gender',
        type: 'string',
        format: 'enum'
      },
      contactMedium: {
        title: 'Contact Medium',
        id: 'contactMedium',
        type: 'array',
        items: {
          type: 'string',
          enum: ['email', 'SMS', 'whatsapp', 'telegram'],
          enumNames: ['Email', 'SMS', 'Whatsapp', 'Telegram']
        },
        uniqueItems: true,
        layout: { rootSpacing: 12, xl: 12, lg: 12, md: 12, sm: 12, xs: 12 }
      }
    }
  };

  if (enableUseProfile) {
    schema = {
      order: ['useProfile', ...schema.order],
      requiredFields: [...schema.requiredFields],
      otherFields: ['useProfile'],
      optionalFields: [...schema.optionalFields],
      properties: {
        useProfile: {
          id: 'useProfile',
          title: 'Same as Profile Owner',
          type: 'boolean',
          layout: { rootSpacing: 12, xl: 12, lg: 12, md: 12, sm: 12, xs: 12 }
        },
        ...schema.properties
      }
    };
  }

  return schema;
};

export default primaryContactSchema;
