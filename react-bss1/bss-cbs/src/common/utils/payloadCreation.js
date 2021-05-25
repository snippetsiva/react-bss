/* eslint-disable */
import _ from 'lodash';

export const getRelatedParty = (relatedParty, partyName) => {
  return _.filter(relatedParty, u => u.role === partyName)[0];
};

export const getPreferredContact = contactMedium => {
  return _.filter(contactMedium, c => c.preferred === true);
};
export const getUpdatedPayload = (id, type, name, touchedProp, otherProps) => {
  let partyPatch = [];
  let interactionItem = {};
  interactionItem = {
    href: '',
    itemDate: new Date(),
    resolution: 'DONE',
    item: {
      id: id,
      name: name,
      '@type': type,
      '@referredType': type,
      patch: []
    }
  };
  switch (name) {
    case 'contactInfo': {
      const cIPayload = getContactInfoPayload(touchedProp);
      const tempObj = {
        op: 'replace',
        path: '/contactMedium',
        value: cIPayload
      };
      partyPatch.push(tempObj);
      interactionItem.item.patch = partyPatch;
      return interactionItem;
    }
    case 'externalReference': {
      const ExRef = getexternalReferencePayload(touchedProp);
      const tempObj = {
        op: 'replace',
        path: '/externalReference',
        value: ExRef
      };
      partyPatch.push(tempObj);
      interactionItem.item.patch = partyPatch;
      return interactionItem;
    }
    case 'secondaryContact': {
      const secon = getContactInfoPayload(touchedProp);
      const tempObj = {
        op: 'replace',
        path: '/contactMedium',
        value: secon
      };
      partyPatch.push(tempObj);
      partyPatch.push(otherProps);
      interactionItem.item.patch = partyPatch;
      return interactionItem;
    }
    case 'contacPreferrence': {
      const contact = getPreferrencePayload(touchedProp, otherProps);
      const tempObj = {
        op: 'replace',
        path: '/contactMedium',
        value: contact
      };
      partyPatch.push(tempObj);
      interactionItem.item.patch = partyPatch;
      return interactionItem;
    }

    default: {
      for (var prop in touchedProp) {
        if (touchedProp.hasOwnProperty(prop)) {
          const tempObj = {
            op: 'replace',
            path: `/${prop}`,
            value: touchedProp[prop]
          };
          partyPatch.push(tempObj);
        }
      }
      interactionItem.item.patch = partyPatch;
      return interactionItem;
    }
  }
};

function getContactInfoPayload(touchedProp) {
  let tempPayload = [];
  for (const key of Object.keys(touchedProp)) {
    const contactPayload = {
      type: '',
      medium: {
        preferredTime: '',
        preferredLanguage: ''
      },
      preferred: false
    };
    contactPayload.type =
      key === 'emailAddress' || key === 'alternateEmail'
        ? 'EmailAddress'
        : 'TelephoneNumber';
    contactPayload.medium[
      contactPayload.type === 'TelephoneNumber'
        ? 'number'
        : key === 'alternateEmail'
          ? 'emailAddress'
          : key
    ] = touchedProp[key];
    if (key === 'mobile' || key === 'emailAddress') {
      contactPayload.preferred = true;
      contactPayload.medium.preferredLanguage = 'ENG';
    }
    contactPayload.medium.type = key;
    tempPayload.push(contactPayload);
  }
  tempPayload.push({
    medium: {
      country: 'MU',
      streetTwo: 'swamy vivekananda Road',
      stateOrProvince: 'S1',
      city: 'L94',
      landmark: '',
      postcode: '744101',
      streetOne: '#25, 2nd Cross',
      type: 'MTNSTREET',
      preferredFromTime: '11 AM',
      preferredToTime: '8 PM',
      preferredLanguage: 'ENG'
    },
    type: 'StreetAddress',
    preferred: false
  });
  return tempPayload;
}

function getexternalReferencePayload(touchedProp) {
  let tempMediaPayload = [];
  for (const key of Object.keys(touchedProp)) {
    const mediaPayload = {
      type: '',
      href: ''
    };
    mediaPayload.type = key;
    mediaPayload.href = touchedProp[key];
    tempMediaPayload.push(mediaPayload);
  }
  return tempMediaPayload;
}
function getPreferrencePayload(mediums, contactMedium) {
  let tempPayload;
  for (const key of Object.keys(mediums)) {
    if (key === 'preferredMediums') {
      for (let mObj of mediums['preferredMediums']) {
        for (let cObj of contactMedium) {
          if (cObj.medium.type === mObj) {
            cObj.preferred = true;
            cObj.medium.preferredLanguage = mediums['preferredLanguage'];
            cObj.medium.preferredTime = mediums['preferredTime'];
          }
        }
      }
    }
  }
  tempPayload = contactMedium;
  return tempPayload;
}
