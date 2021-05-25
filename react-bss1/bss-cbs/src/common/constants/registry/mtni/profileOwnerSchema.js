const profileOwnerSchema = (enableUseProfile) => {
const todayDate = new Date();

  let schema = {
    order: [
      'name',
      'lastName',
      'mobile',
      'email',
      'contactMedium'
    ],
    requiredFields: [
      'name',
      'lastName',
      'mobile',
      'email',
      'contactMedium'
    ],
    properties: {
      name: {
        id: 'name',
        title: 'First Name',
        type: 'string',
        maxLength: 50,
        pattern:
          '[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654]+$'
      },
      lastName: {
        id: 'lastName',
        title: 'Last Name',
        type: 'string',
        maxLength: 50,
        pattern:
          '[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654]+$'
      },
      mobile: {
        id: 'mobile',
        title: 'mobile number',
        type: 'string',
        minLength: 11,
        maxLength: 11,
        placeholder: '09339902222',
        pattern: '^([0\u06F0]+[0-9\u06F0-\u06F9]{10})+$',
        readOnlyFormat: 'mobile'
      },
      email: {
        id: 'email',
        title: 'email',
        type: 'string',
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
