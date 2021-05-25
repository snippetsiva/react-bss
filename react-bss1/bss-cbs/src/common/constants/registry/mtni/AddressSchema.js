/**
 * NOTE: AddressSchema : POBox
 */
export default {
  order: [
    'POaddressLine1',
    'POaddressLine2',
    'POaddressLine3',
    'POCountry',
    'POState',
    'POCity',
    'POBox',
    'POlandmark',
    'POdigitalAddress'
  ],
  requiredFields: ['POaddressLine1', 'POCountry', 'POState', 'POCity', 'POBox'],
  dependencies: [],
  otherFields: [
    'POaddressLine2',
    'POaddressLine3',
    'POlandmark',
    'POdigitalAddress'
  ],
  optionalProperties: {},
  dependantProperties: {},
  properties: {
    POaddressLine1: {
      id: 'POaddressLine1',
      title: 'Address Line 1',
      type: 'string',
      maxLength: 150,
      pattern:
      '^([a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654]+[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654\u06F0-\u06F90-9]{1,150})+$'
    },
    POaddressLine2: {
      id: 'POaddressLine2',
      title: 'Address Line 2',
      type: 'string',
      maxLength: 150,
      pattern:
      '^([a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654]+[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654\u06F0-\u06F90-9]{0,150})+$'
    },
    POaddressLine3: {
      id: 'POaddressLine3',
      title: 'Address Line 3',
      type: 'string',
      maxLength: 150,
      pattern:
      '^([a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654]+[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654\u06F0-\u06F90-9]{0,150})+$'
    },
    POCountry: {
      title: 'Country',
      id: 'POCountry',
      type: 'string',
      format: 'enum',
      readOnly: true
    },
    POState: {
      title: 'Region',
      id: 'POState',
      type: 'string',
      format: 'enum'
    },
    POCity: {
      title: 'Town',
      id: 'POCity',
      type: 'string',
      format: 'enum'
    },
    POBox: {
      title: 'Postal Code',
      id: 'POBox',
      type: 'string',
      minLength: 10,
      maxLength: 10,
      pattern: '[0-9\u06F0-\u06F9]{10}'
    },
    POlandmark: {
      id: 'POlandmark',
      title: 'Landmark',
      type: 'string',
      maxLength: 150,
      pattern:
      '^([a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654]+[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654\u06F0-\u06F90-9]{1,150})+$'
    },
    POdigitalAddress: {
      id: 'POdigitalAddress',
      title: 'Digital Address',
      type: 'string',
      maxLength: 150,
      pattern:
      '^([a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654]+[a-zA-Z\u0020\u0621-\u0639\u0641\u0642\u0644\u0645\u0646\u0647\u0648\u062A\u067E\u062B\u062C\u0686\u062D\u062E\u062F\u0698\u063A\u06A9\u06AF\u06CC\u0654\u06F0-\u06F90-9]{1,150})+$'
    }
  }
};
