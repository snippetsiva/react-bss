import React from 'react';
import Scroll from 'react-scroll';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { Trans } from '@lingui/macro';
import _get from 'lodash/get';
import _find from 'lodash/find';
import _orderBy from 'lodash/orderBy';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import { getItemNameByCode } from 'common/utils/commonUtility';
import RootElement from './RootElement';
import config from 'config';

const styles = theme => ({
  rootClass: {
    padding: '10px 40px',
    marginTop: 20,
    border: `1px solid ${theme.palette.common.grayShadow}`,
    borderRadius: 10
  },
  headerClass: {
    textAlign: 'left'
  },
  subTypeClass: {
    textAlign: 'left'
  }
});
const { Element } = Scroll;

export const getPlaceArray = (data, productPlace, masterData, status) => {
  const getPlace = data => {
    // Returns recent updated orderItem with active installation address
    const order = _find(
      _orderBy(data, 'product.modifiedDate', 'desc'),
      item =>
        _get(item, 'product.productSpecification.@type', '') === 'SiteProductSpec' &&
        (status ? _get(item, 'product.status', '') === status : true)
    );
    return _get(order, 'product.place', []);
  };
  const getCountry = [];
  masterData.map(item => getCountry.push({ code: item.code, name: item.name }));
  const getRegion = [];
  const cities = [];
  masterData
    .map(item => item.province || [])
    .map(childItem =>
      ((!_.isUndefined(childItem) && childItem) || []).map(value => {
        getRegion.push({ code: value.code, name: value.name }),
          _get(value, 'city', []).forEach(city => cities.push(city));
      })
    );
  const place = getPlace(data);
  const siteValue = _get(productPlace, 'siteName', '');
  const siteAbbrValue = _get(productPlace, 'siteAbbreviation', '');
  const gpsCoordinatesValue = _get(productPlace, 'geographicLocation.geometry', '');
  const isOpcoMTNU = _.get(config, 'dev.server.opco') === 'mtnu';

  const installationAddressArray = [
    {
      name: <Trans>ADDRESS LINE 1</Trans>,
      value: _get(place, '[0].addressLine1', '')
    },
    {
      name: <Trans>ADDRESS LINE 2</Trans>,
      value: _get(place, '[0].addressLine2', '')
    },
    {
      name: <Trans>ADDRESS LINE 3</Trans>,
      value: _get(place, '[0].addressLine3', '')
    },
    ...(isOpcoMTNU
      ? [
          {
            name: <Trans>ADDRESS LINE 4</Trans>,
            value: _get(place, '[0].addressLine4', '')
          },
          {
            name: <Trans>ADDRESS LINE 5</Trans>,
            value: _get(place, '[0].streetName', '')
          }
        ]
      : []),
    {
      name: <Trans>COUNTRY</Trans>,
      value: getItemNameByCode(getCountry, _get(place, '[0].country', ''))
    },
    {
      name: <Trans>REGION</Trans>,
      value: getItemNameByCode(getRegion, _get(place, '[0].stateOrProvince', ''))
    },
    {
      name: isOpcoMTNU ? <Trans>DISTRICT</Trans> : <Trans>TOWN</Trans>,
      value: getItemNameByCode(cities, _get(place, '[0].city', ''))
    },
    {
      name: <Trans>POSTAL CODE</Trans>,
      value: _get(place, '[0].postcode', '')
    },
    {
      name: <Trans>LANDMARK</Trans>,
      value: _get(place, '[0].landmark', '')
    },
    {
      name: <Trans>DIGITAL ADDRESS</Trans>,
      value: _get(place, '[0].digitalAddress', '')
    },
    {
      name: <Trans>SITE NAME</Trans>,
      value: siteValue ? siteValue : ''
    },
    {
      name: <Trans>SITE ABBREVIATION </Trans>,
      value: siteAbbrValue ? siteAbbrValue : ''
    },
    {
      name: <Trans>GPS COORDINATES </Trans>,
      value: gpsCoordinatesValue
        ? '(' + _get(gpsCoordinatesValue, 'x', '') + ',' + _get(gpsCoordinatesValue, 'y', '') + ')'
        : ''
    }
  ];
  return !_isEmpty(place) ? installationAddressArray : null;
};

const InstallationAddress = ({ classes, data = [], productPlace, masterData, status }) => {
  const installationAddressArray = getPlaceArray(data, productPlace, masterData, status);
  return installationAddressArray ? (
    <Element name="equipment-details-offering">
      <RootElement title={<Trans>Installation Address</Trans>} icon="documents-offering">
        <div className={classes.rootClass}>
          <Grid container spacing={10}>
            {_map(installationAddressArray, item => (
              <Grid item xs={3}>
                <Typography variant="caption" display="block" className={classes.headerClass}>
                  {item.name}
                </Typography>
                <Typography variant="body1" className={classes.subTypeClass}>
                  {item.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </div>
      </RootElement>
    </Element>
  ) : null;
};

export default withStyles(styles)(InstallationAddress);
