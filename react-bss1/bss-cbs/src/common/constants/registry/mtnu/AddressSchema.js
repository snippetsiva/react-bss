/**
 * NOTE: AddressSchema : POBox
 */
export default {
  order: [
    'POaddressLine1',
    'POaddressLine2',
    'POaddressLine3',
    'POaddressLine4',
    'POstreetName',
    'POCountry',
    'POState',
    'POCity',
    'POBox',
    'POlandmark',
    'POdigitalAddress'
  ],
  requiredFields: ['POaddressLine1', 'POCountry', 'POState', 'POCity'],
  dependencies: [],
  otherFields: [
    'POaddressLine2',
    'POaddressLine3',
    'POaddressLine4',
    'POstreetName',
    'POBox',
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
      maxLength: 100
    },
    POaddressLine2: {
      id: 'POaddressLine2',
      title: 'Address Line 2',
      type: 'string',
      maxLength: 100
    },
    POaddressLine3: {
      id: 'POaddressLine3',
      title: 'Address Line 3',
      type: 'string',
      maxLength: 100
    },
    POaddressLine4: {
      id: 'POaddressLine4',
      title: 'Address Line 4',
      type: 'string',
      maxLength: 100
    },
    POstreetName: {
      id: 'POstreetName',
      title: 'Address Line 5',
      type: 'string',
      maxLength: 100
    },
    POCountry: {
      title: 'Country',
      id: 'POCountry',
      type: 'string',
      format: 'enum'
    },
    POState: {
      title: 'Region',
      id: 'POState',
      type: 'string',
      format: 'enum'
    },
    POCity: {
      title: 'District',
      id: 'POCity',
      type: 'string',
      format: 'enum'
    },
    POBox: {
      title: 'Postal Code',
      id: 'POBox',
      type: 'string',
      minLength: 6,
      maxLength: 10,
      pattern: '^[0-9]'
    },
    POlandmark: {
      id: 'POlandmark',
      title: 'Landmark',
      type: 'string',
      maxLength: 100
    },
    POdigitalAddress: {
      id: 'POdigitalAddress',
      title: 'Digital Address',
      type: 'string',
      maxLength: 100
    }
  }
};
