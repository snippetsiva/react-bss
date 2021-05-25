import constants from 'common/constants/constants';

export function getAccountUpdatePayload() {
  return {
    '@type': 'BillingAccountUpdateRequest',
    status: constants.status.CAPTURED,
    direction: 'inbounds',
    interactionItem: [],
    note: [],
    attachment: [{}],
    channel: [
      {
        id: 'DMLD',
        name: 'DMLD',
        role: 'interaction creation',
        '@type': 'DMLD'
      }
    ],
    relatedParty: []
  };
}
