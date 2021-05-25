import constants from 'common/constants/constants';

export const getFormattedAddress = (address, type) => {
  const formattedAddress = {
    medium: {
      country: _.get(address, 'POCountry', ''),
      stateOrProvince: _.get(address, 'POState', ''),
      city: _.get(address, 'POCity', ''),
      landmark: _.get(address, 'POlandmark', ''),
      postcode: _.get(address, 'POBox', ''),
      streetOne: _.get(address, 'POaddressLine1', ''),
      type: _.get(address, 'addressFormat', '')
    },
    type
  };
  return formattedAddress;
};

export const generateCustomerUpdatePayload = (
  customerDetails,
  relatedParty,
  type
) => {
  const today = new Date();
  // const customerOldData = _.get(customerDetails, 'customer', {});
  const customerOldData =
    customerDetails.customer ||
    _.get(customerDetails, 'props.customer', null) ||
    {};
  const payload = {
    interactionDate: {
      startDateTime: today.toISOString()
    },
    description: '',
    reason: '',
    status: 'captured',
    direction: 'inbound',
    relatedParty,
    interactionItem: [
      {
        item: {
          relatedParty: [],
          ...customerOldData
        }
      }
    ],
    channel: [
      {
        role: 'interaction creation',
        name: 'DCLM',
        id: 'DCLM',
        '@type': 'DCLM'
      }
    ],
    customerId: [_.get(customerOldData, 'id', '')],
    '@type': 'CustomerInformationUpdateRequest',
    '@baseType': 'PartyInteraction'
  };
  const interactionItem = _.get(
    payload,
    'interactionItem[0].item.engagedParty',
    {}
  );
  const mainInteractionItem = _.get(payload, 'interactionItem[0].item', {});
  switch (type) {
    case 'basicDetails':
      const familyName = _.get(customerDetails, 'familyName', '');
      const givenName = _.get(customerDetails, 'givenName', '');
      const middleName = _.get(customerDetails, 'middleName', '');
      interactionItem.familyName = familyName;
      interactionItem.givenName = givenName;
      interactionItem.middleName = middleName;
      interactionItem.fullName = `${givenName} ${middleName} ${familyName}`;
      interactionItem.birthDate = _.get(customerDetails, 'birthDate', '');
      mainInteractionItem.customerCategory = _.get(
        customerDetails,
        'customerCategory',
        ''
      );
      mainInteractionItem.customerSubCategory = _.get(
        customerDetails,
        'customerSubCategory',
        ''
      );
      mainInteractionItem.name = `${givenName} ${middleName} ${familyName}`;
      interactionItem.nationality = _.get(customerDetails, 'nationality', '');
      interactionItem.gender = _.get(customerDetails, 'gender', '');
      interactionItem.maritalStatus = _.get(
        customerDetails,
        'maritalStatus',
        ''
      );
      break;
    case 'demographicDetails':
      interactionItem.incomeRange = _.get(
        customerDetails,
        'demographicDetails.incomeRange',
        ''
      );
      interactionItem.highestQualification = _.get(
        customerDetails,
        'demographicDetails.highestQualification',
        ''
      );
      interactionItem.occupation = [
        {
          type: _.get(customerDetails, 'demographicDetails.occupation', ''),
          industry: _.get(customerDetails, 'demographicDetails.industry', '')
        }
      ];
      const areasOfInterest = _.get(
        customerDetails,
        'demographicDetails.areaOfInterest',
        ''
      );
      interactionItem.areaOfInterest =
        typeof areasOfInterest === 'string'
          ? areasOfInterest.split(',')
          : areasOfInterest;
      break;
    case 'personalInformation':
      interactionItem.suffix = _.get(customerDetails, 'suffix', '');
      interactionItem.title = _.get(customerDetails, 'title', '');
      interactionItem.vip = _.get(customerDetails, 'vip', '');
      const fatherParty = {
        '@referredType': constants.PARTY_INTERACTION_TYPES.INDIVIDUAL,
        '@schemaLocation': '',
        href: '',
        name: _.get(customerDetails, 'fathersName', ''),
        role: 'father'
      };
      let fatherPartyExists = false;
      const motherParty = {
        '@referredType': constants.PARTY_INTERACTION_TYPES.INDIVIDUAL,
        '@schemaLocation': '',
        href: '',
        name: _.get(customerDetails, 'mothersName', ''),
        role: 'mother'
      };
      let motherPartyExists = false;
      const relatedParty = _.get(interactionItem, 'relatedParty', []);
      if (relatedParty.length > 0) {
        for (const item of relatedParty) {
          if (item.role === 'father') {
            item.name = fatherParty.name;
            fatherPartyExists = true;
          } else if (item.role === 'mother') {
            item.name = motherParty.name;
            motherPartyExists = true;
          }
          if (fatherPartyExists && motherPartyExists) break;
        }
      } else interactionItem.relatedParty = [];
      if (!fatherPartyExists) relatedParty.push(fatherParty);
      if (!motherPartyExists) relatedParty.push(motherParty);
      const documentDetails = {};
      for (const item of interactionItem.individualIdentification || []) {
        if (item.documentPurpose === 'POID') {
          item.identificationId = _.get(
            customerDetails,
            'identificationId',
            ''
          );
          item.type = _.get(customerDetails, 'documentType', '');
          break;
        }
      }
      break;
    case 'referral':
      let referrer = { role: 'referrer' };
      for (const item of _.get(customerOldData, 'relatedParty', [])) {
        if (item.role === 'referrer') {
          referrer = item;
          break;
        }
      }
      referrer.id = _.get(customerDetails, 'customerId', '');
      referrer.name = _.get(customerDetails, 'referralName', '');
      const outerRelatedParty = _.get(
        payload,
        'interactionItem[0].item.relatedParty',
        []
      );
      let referrerExists = false;
      if (outerRelatedParty.length > 0) {
        for (const item of outerRelatedParty) {
          if (item.role === 'referrer') {
            item.id = referrer.id;
            item.name = referrer.name;
            referrerExists = true;
            break;
          }
        }
      } else {
        const interactionItemPayload = _.get(
          payload,
          'interactionItem[0].item',
          {}
        );
        interactionItem.relatedParty = [];
        interactionItem.relatedParty.push(referrer);
        payload.interactionItem[0].item.relatedParty = [referrer];
        referrerExists = true;
      }
      if (!referrerExists) outerRelatedParty.push(referrer);
      break;
    case 'relatedManager':
      const relationshipManager = _.find(
        _.get(interactionItem, 'relatedParty'),
        {
          role: 'relationshipManager'
        }
      );
      if (relationshipManager) {
        relationshipManager.name = _.get(
          customerDetails,
          'relationshipManager',
          ''
        );
      } else {
        const relatedManager = {
          '@referredType': constants.PARTY_INTERACTION_TYPES.INDIVIDUAL,
          '@schemaLocation': '',
          href: '',
          name: _.get(customerDetails, 'relationshipManager', ''),
          role: 'relationshipManager'
        };
        interactionItem.relatedParty.push(relatedManager);
      }
      break;
    case 'secondaryContact':
      const mainRelatedParty = _.get(interactionItem, 'relatedParty', []);
      const secondaryContact = {
        role: 'secondaryContact',
        '@schemaLocation': '',
        '@referredType': constants.PARTY_INTERACTION_TYPES.INDIVIDUAL,
        href: '',
        name: _.get(customerDetails, 'name', ''),
        emailAddress: _.get(customerDetails, 'personEmailAddress', ''),
        phoneNumber: _.get(customerDetails, 'personPhoneNumber', ''),
        relation: _.get(customerDetails, 'relation', '')
      };
      let seconaryContactExists = false;
      for (const item of mainRelatedParty) {
        if (item.role === 'secondaryContact') {
          seconaryContactExists = true;
          item.name = secondaryContact.name;
          item.emailAddress = secondaryContact.emailAddress;
          item.phoneNumber = secondaryContact.phoneNumber;
          item.relation = secondaryContact.relation;
        }
      }
      if (!seconaryContactExists) {
        mainRelatedParty.push(secondaryContact);
      }
      break;
    case 'contactPreferences':
      const contactMedium = _.get(interactionItem, 'contactMedium', []);
      const preferredMediums = _.get(customerDetails, 'preferredMediums', []);
      for (const item of contactMedium) {
        if (item.type === 'EmailAddress' || item.type === 'Mobile') {
          item.medium.preferredTime = _.get(
            customerDetails,
            'preferredTime',
            ''
          );
          item.medium.preferredLanguage = _.get(
            customerDetails,
            'preferredLanguage',
            ''
          );
        }
        if (preferredMediums.includes(item.type)) item.preferred = true;
        // Remove this after correcting masterdata
        if (item.type === 'EmailAddress')
          preferredMediums.includes('Email') ? (item.preferred = true) : '';
        if (item.type === 'Mobile') {
          preferredMediums.includes('Phone') || preferredMediums.includes('SMS')
            ? (item.preferred = true)
            : '';
        }
      }
      break;
    case 'contactInfo':
      const contactMediums = _.get(interactionItem, 'contactMedium', []);
      const externalReferences = _.get(
        interactionItem,
        'externalReference',
        []
      );
      let emailExists = false;
      let mobileExists = false;
      let alternateMobileExists = false;
      let facebookExists = false;
      let twitterExists = false;
      let residentialAddressExists = false;
      let installationAddressExists = false;
      let billingAddressExists = false;
      for (const item of contactMediums) {
        switch (item.medium.type) {
          case 'emailAddress':
            item.medium.emailAddress = _.get(
              customerDetails,
              'emailAddress',
              ''
            );
            emailExists = true;
            break;
          case 'mobile':
            item.medium.number = _.get(customerDetails, 'mobile', '');
            mobileExists = true;
            break;
          case 'fixed':
            item.medium.number = _.get(customerDetails, 'fixed', '');
            alternateMobileExists = true;
            break;
          default:
            break;
        }
        switch (item.type) {
          case 'residentialAddress':
            const residentialAddress = getFormattedAddress(
              _.get(customerDetails, 'residentialAddress', {}),
              'residentialAddress'
            );
            item.medium = residentialAddress.medium;
            residentialAddressExists = true;
            break;
          case 'installationAddress':
            const address = getFormattedAddress(
              _.get(customerDetails, 'installationAddress', {}),
              'installationAddress'
            );
            item.medium = address.medium;
            installationAddressExists = true;
            break;
          case 'billingAddress':
            const billingAddress = getFormattedAddress(
              _.get(customerDetails, 'billingAddress', {}),
              'billingAddress'
            );
            item.medium = billingAddress.medium;
            billingAddressExists = true;
            break;
          default:
            break;
        }
      }
      for (const item of externalReferences) {
        if (facebookExists && twitterExists) break;
        switch (item.type) {
          case 'faceBook':
            item.href = `https://www.facebook.com/${_.get(
              customerDetails,
              'faceBook',
              ''
            )}`;
            facebookExists = true;
            break;
          case 'twitter':
            item.href = `https://twitter.com/${_.get(
              customerDetails,
              'twitter',
              ''
            )}`;
            twitterExists = true;
            break;
          default:
            break;
        }
      }
      if (!emailExists) {
        contactMediums.push({
          medium: {
            emailAddress: _.get(customerDetails, 'emailAddress', ''),
            type: 'emailAddress',
            preferredTime: '',
            preferredLanguage: 'ENG'
          },
          type: 'EmailAddress',
          preferred: true
        });
      }
      if (!mobileExists) {
        contactMediums.push({
          medium: {
            number: _.get(customerDetails, 'mobile', ''),
            type: 'mobile',
            preferredTime: '',
            preferredLanguage: 'ENG'
          },
          type: 'TelephoneNumber',
          preferred: false
        });
      }
      if (!alternateMobileExists) {
        contactMediums.push({
          medium: {
            number: _.get(customerDetails, 'fixed', ''),
            type: 'fixed',
            preferredTime: '',
            preferredLanguage: ''
          },
          type: 'TelephoneNumber',
          preferred: false
        });
      }
      if (!residentialAddressExists)
        contactMediums.push(
          getFormattedAddress(
            _.get(customerDetails, 'residentialAddress', {}),
            'residentialAddress'
          )
        );
      if (!installationAddressExists)
        contactMediums.push(
          getFormattedAddress(
            _.get(customerDetails, 'installationAddress', {}),
            'installationAddress'
          )
        );
      if (!billingAddressExists)
        contactMediums.push(
          getFormattedAddress(
            _.get(customerDetails, 'billingAddress', {}),
            'billingAddress'
          )
        );
      break;
    // case 'blacklist':
    //   if (!interactionItem.blacklist) {
    //     interactionItem.blacklist = [];
    //     interactionItem.blacklist[0] = {
    //       blacklisted: _.get(customerDetails, 'blacklisted', false),
    //       reason: _.get(customerDetails, 'reason', '')
    //     };
    //   } else {
    //     interactionItem.blacklist[0] = {
    //       blacklisted: _.get(customerDetails, 'blacklisted', false),
    //       reason: _.get(customerDetails, 'reason', '')
    //     };
    //   }
    //   break;
    default:
      break;
  }
  return payload;
};
