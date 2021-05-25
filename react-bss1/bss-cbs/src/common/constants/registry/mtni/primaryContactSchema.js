const primaryContactSchema = (enableUseProfile) => {
const todayDate = new Date();

  let schema = {
    order: [
      'name',
      'lastName',
      'mobile',
      'email',
      'fatherName',
      'type',
      'identificationId',
      'birthCertificateNumber',
      'birthDate',
      'nationality',
      'country',
      'language',
      'contactMedium'
    ],
    requiredFields: [
      'name',
      'lastName',
      'fatherName',
      'mobile',
      'email',
      'type',
      'birthDate',
      'identificationId',
      'birthCertificateNumber',
      'nationality',
      'country',
      'language',
      'contactMedium'
    ],
    properties: {
      type: {
        id: 'type',
        title: 'ID Type',
        type: 'string',
        format: 'enum'
      },
      identificationId: {
        id: 'identificationId',
        title: 'ID Number',
        type: 'string',
        maxLength: 30,
        pattern:
          '^[A-Za-z0-9\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\u06F0-\u06F9]',
        placeholder: '1234567890'
      },
      nationality: {
        id: 'nationality',
        title: 'Nationality',
        type: 'string',
        format: 'enum'
      },
      country: {
        id: 'country',
        title: 'Country',
        type: 'string',
        format: 'enum'
      },
      language: {
        id: 'language',
        title: 'Preferred Language',
        type: 'string',
        format: 'enum'
      },
      name: {
        id: 'name',
        title: 'First Name',
        type: 'string',
        maxLength: 50,
        pattern:
          '[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654s#/_\\-]+$'
      },
      lastName: {
        id: 'lastName',
        title: 'Last Name',
        type: 'string',
        maxLength: 50,
        pattern:
          '[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654s#/_\\-]+$'
      },
      birthDate: {
        id: 'birthDate',
        title: 'Date of Birth',
        type: 'string',
        format: 'date',
        disableMinDate: true,
        maxDate: todayDate.setFullYear(todayDate.getFullYear() - 18),
        default: null
      },
      fatherName: {
        id: 'fatherName',
        title: 'Father Name',
        type: 'string',
        maxLength: 50,
        pattern:
          '[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654s#/_\\-]+$'
      },
      birthCertificateNumber: {
        id: 'birthCertificateNumber',
        title: 'Birth Certificate No',
        type: 'string',
        minLength: 1,
        maxLength: 10,
        pattern: '^([1-9\u06F1-\u06F9]+[0-9\u06F0-\u06F9]{0,9})+$',
        placeholder: '1234567890'
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

export default primaryContactSchema;
