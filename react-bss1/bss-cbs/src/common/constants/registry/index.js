import tecnoCardJson from './core/companySchema';
import tecnoPrimaryContactJson from './core/primaryContactSchema';
import tecnoProfileOwnerJson from './core/profileOwnerSchema';
import tecnoCustomerPersonalInfoJson from './core/customerPersonalInfo';
import tecnoAddressSchemaJson from './core/AddressSchema';

import mtngCardJson from './mtng/companySchema';
import mtngPrimaryContactJson from './mtng/primaryContactSchema';
import mtngProfileOwnerJson from './mtng/profileOwnerSchema';
import mtngCustomerPersonalInfoJson from './mtng/customerPersonalInfo';
import mtngAddressSchemaJson from './mtng/AddressSchema';

import mtniCardJson from './mtni/companySchema';
import mtniPrimaryContactJson from './mtni/primaryContactSchema';
import mtniProfileOwnerJson from './mtni/profileOwnerSchema';
import mtniCustomerPersonalInfoJson from './mtni/customerPersonalInfo';
import mtniAddressSchemaJson from './mtni/AddressSchema';

import mtnuCardJson from './mtnu/companySchema';
import mtnuPrimaryContactJson from './mtnu/primaryContactSchema';
import mtnuProfileOwnerJson from './mtnu/profileOwnerSchema';
import mtnuCustomerPersonalInfoJson from './mtnu/customerPersonalInfo';
import mtnuAddressSchemaJson from './mtnu/AddressSchema';

import stcCardJson from './stc/companySchema';
import stcPrimaryContactJson from './stc/primaryContactSchema';
import stcProfileOwnerJson from './stc/profileOwnerSchema';
import stcCustomerPersonalInfoJson from './stc/customerPersonalInfo';
import stcAddressSchemaJson from './stc/AddressSchema';

export const registry = {
  core: {
    companyDetailsCardJson: tecnoCardJson,
    primaryContactCardJson: tecnoPrimaryContactJson(true),
    primaryContactCard360Json: tecnoPrimaryContactJson(false),
    profileOwnerCardJson: tecnoProfileOwnerJson(true),
    profileOwnerCard360Json: tecnoProfileOwnerJson(false),
    customerPersonalInfoJson: tecnoCustomerPersonalInfoJson,
    addressCardJson: tecnoAddressSchemaJson
  },
  mtng: {
    companyDetailsCardJson: mtngCardJson,
    primaryContactCardJson: mtngPrimaryContactJson(true),
    primaryContactCard360Json: mtngPrimaryContactJson(false),
    profileOwnerCardJson: mtngProfileOwnerJson(true),
    profileOwnerCard360Json: mtngProfileOwnerJson(false),
    customerPersonalInfoJson: mtngCustomerPersonalInfoJson,
    addressCardJson: mtngAddressSchemaJson
  },
  mtni: {
    companyDetailsCardJson: mtniCardJson,
    primaryContactCardJson: mtniPrimaryContactJson(true),
    primaryContactCard360Json: mtniPrimaryContactJson(false),
    profileOwnerCardJson: mtniProfileOwnerJson(true),
    profileOwnerCard360Json: mtniProfileOwnerJson(false),
    customerPersonalInfoJson: mtniCustomerPersonalInfoJson,
    addressCardJson: mtniAddressSchemaJson
  },
  mtnu: {
    companyDetailsCardJson: mtnuCardJson,
    primaryContactCardJson: mtnuPrimaryContactJson(true),
    primaryContactCard360Json: mtnuPrimaryContactJson(false),
    profileOwnerCardJson: mtnuProfileOwnerJson(true),
    profileOwnerCard360Json: mtnuProfileOwnerJson(false),
    customerPersonalInfoJson: mtnuCustomerPersonalInfoJson,
    addressCardJson: mtnuAddressSchemaJson
  },
  stc: {
    companyDetailsCardJson: stcCardJson,
    primaryContactCardJson: stcPrimaryContactJson(true),
    primaryContactCard360Json: stcPrimaryContactJson(false),
    profileOwnerCardJson: stcProfileOwnerJson(true),
    profileOwnerCard360Json: stcProfileOwnerJson(false),
    customerPersonalInfoJson: stcCustomerPersonalInfoJson,
    addressCardJson: stcAddressSchemaJson
  }
};
