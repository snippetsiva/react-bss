/**
 * NOTE: In case we introduce a new field with format as enum (dropdown option)
 * for corresponding field -> enumData needs to be added in code which will need
 * code changes and deployment
 */
const profileOwnerSchema = (enableUseProfile) => {
  let schema = {
    order: ['name', 'lastName', 'mobile', 'email', 'contactMedium'],
    requiredFields: ['name', 'lastName', 'mobile', 'email', 'contactMedium'],
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
        maxLength: 8,
        pattern: '[0-9]{8}',
        readOnlyFormat: 'mobile'
      },
      email: {
        id: 'email',
        title: 'email',
        type: 'string',
        maxLength: 100,
        pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'
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

export default profileOwnerSchema;
