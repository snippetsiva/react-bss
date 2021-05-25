import constants from 'common/constants/constants';

export function getCustomerUpdatePayload() {
  
  return {
    // '@type': 'CustomerInformationUpdateRequest',

    // "@baseType":"PartyInteraction",
    // "direction": "inbound",
    // status: constants.status.CAPTURED,
    // interactionItem: [],
    "@baseType": "PartyInteraction",
    '@type': 'CustomerInformationUpdateRequest',
    status: constants.status.CAPTURED,
    interactionItem: [],
    note: [{}],
    attachment: [{}],
    "direction": "inbound",
    channel: [
      {
        id: 'DMLD',
        name: 'DMLD',
        role: 'interaction creation',
        "@referredType": "Channel",
        "@type": 'DMLD'
      }
    ],
    relatedParty: []
  };
}
