import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import PhoneOutlined from '@material-ui/icons/PhoneOutlined';
import TvOutlined from '@material-ui/icons/TvOutlined';
import WifiOutlined from '@material-ui/icons/WifiOutlined';
import { withStyles } from '@material-ui/core/styles';
import _isEmpty from 'lodash/isEmpty';
import { Trans } from '@lingui/macro';
import classNames from 'classnames';

import { decimalService } from 'common/utils/stringUtil';
import { getItemCodeByName } from 'common/utils/commonUtility';
import constants from 'common/constants/constants';
import UpdatedPrice from 'common/components/UpdatedPrice';

const styles = (theme) => ({
  rowColor: {
    background: theme.palette.background.main
  },
  icon: {
    fontSize: 24,
    color: theme.palette.common.selectedGray, // #585858',
    padding: '5px',
    display: 'inline'
  }
});

const ProductSpecs = (props) => {
  const {
    displayAddToCart,
    addToCart,
    HideOfferingDetails,
    offer,
    productOrderInteractionItem,
    recurringPeriods,
    classes
  } = props;
  const offerId = _.get(offer, 'id', '');
  const specificationList = [];
  const equipments = [];
  const inclusions = [];

  if (offer.isBundle) {
    for (const offering of offer.bundledProductOffering) {
      const specification = offering.productSpecification;
      if (specification) {
        if (specification.bundledProductSpecification) {
          for (const spec of specification.bundledProductSpecification) {
            spec.parentName = offering.name || '';
            specificationList.push(spec);
          }
        } else {
          specificationList.push(specification);
        }
      }
    }
  } else {
    const specification = _.get(offer, 'productSpecification', {});

    if (specification.bundledProductSpecification) {
      for (const spec of specification.bundledProductSpecification) {
        spec.parentName = '';
        specificationList.push(spec);
      }
    } else {
      specificationList.push(specification);
    }
  }

  for (const spec of specificationList) {
    const tempName = spec.name || '';
    let tempValue = '';
    let type = '';
    if (spec.productSpecCharacteristic) {
      for (const characteristic of spec.productSpecCharacteristic) {
        if (characteristic.name === 'Device') {
          type = 'equipment';
          for (const subChar of characteristic.productSpecCharacteristicValue) {
            if (subChar.isDefault) {
              tempValue = subChar.value;
              if (tempValue && tempName) {
                equipments.push({ name: tempName, value: tempValue });
              }
            }
          }
        } else {
          const characteristicName = characteristic.name;
          type = 'inclusion';
          if (
            characteristic.productSpecCharacteristicValue &&
            characteristic.productSpecCharacteristicValue.length > 0
          ) {
            for (const subChar of characteristic.productSpecCharacteristicValue) {
              if (subChar.isDefault) {
                tempValue = subChar.value;
                let alreadyPresent = false;

                for (const item of inclusions) {
                  if (item.parent === spec.parentName) {
                    let shouldPush = true;
                    alreadyPresent = true;
                    for (const spec of item.specs) {
                      if (
                        spec.specName === tempName &&
                        spec.name === characteristicName
                      ) {
                        spec.value += `, ${tempValue}`;
                        shouldPush = false;
                      }
                    }
                    shouldPush &&
                      item.specs.push({
                        specName: tempName,
                        name: characteristicName,
                        value: tempValue
                      });
                  }
                }

                !alreadyPresent &&
                  inclusions.push({
                    parent: spec.parentName || '',
                    specs: [
                      {
                        specName: tempName,
                        name: characteristicName,
                        value: tempValue
                      }
                    ]
                  });
              }
            }
          }
        }
      }
    }
  }

  const offerPrices = [];
  let mainPrice = 0;
  let mainPriceUnit = '';
  let minimumContractPeriod = 0;
  const Equipments = [];
  const tempEquipments = [];
  // Creating the charges array
  if (offer.productOfferingPrice) {
    for (const item of offer.productOfferingPrice) {
      if (
        item['@type'] === constants.productPriceType.UPFRONT ||
        item['@type'] === constants.productPriceType.RECURRING
      ) {
        let tempPrice = 0;
        // tempPrice = item.price.amount ? tempPrice + item.price.amount : tempPrice;
        // tempPrice = item.price.taxRate ? tempPrice + item.price.taxRate : tempPrice;
        tempPrice = item.price.taxIncludedAmount
          ? item.price.taxIncludedAmount
          : tempPrice;
        if (item['@type'] === constants.productPriceType.RECURRING) {
          // mainPrice = item.price.amount ? mainPrice + item.price.amount : mainPrice;
          // mainPrice = item.price.taxRate ? mainPrice + item.price.taxRate : mainPrice;
          mainPrice = item.price.taxIncludedAmount
            ? item.price.taxIncludedAmount
            : tempPrice;
          mainPriceUnit = item.price.unit;
        }
        offerPrices.push({
          name: item.name,
          price: tempPrice,
          validity: item.recurringChargePeriodType
            ? item.recurringChargePeriodType
            : '',
          priceUnit: item.price.unit
        });
      }
    }
  }
  // Calculating the minimumContractPeriod
  if (offer.productOfferingTerm) {
    const offering = offer.productOfferingTerm ? offer.productOfferingTerm : [];
    if (offering[0]) {
      if (offering[0].duration.units === constants.year) {
        minimumContractPeriod = offering[0].duration.amount * 12;
      } else minimumContractPeriod = offering[0].duration.amount;
    }
    for (let i = 0; i < offering.length - 1; i++) {
      let tempDuration;
      if (offering[i].duration.units === constants.year) {
        tempDuration = offering[i].duration.amount * 12;
      } else tempDuration = offering[i].duration.amount;
      if (minimumContractPeriod > tempDuration) {
        minimumContractPeriod = tempDuration;
      }
    }
  }
  if (offer.bundledProductOffering) {
    // If something need to be done
  } else if (offer.productSpecification) {
    tempEquipments.push({
      name: offer.productSpecification.name,
      description: offer.productSpecification.description
    });
  }

  return (
    <div className="drawerPaper maintainPadding">
      <Grid container alignItems="baseline">
        <Grid item xs={2}>
          <IconButton
            aria-label={<Trans>Close</Trans>}
            onClick={() => HideOfferingDetails()}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid item xs={10} align="right">
          {/* <Button color="secondary">
                          ADD TO COMPARE
                      </Button> */}
        </Grid>
      </Grid>
      <Grid container>
        {Object.keys(offer).length === 0 && (
          <Grid item xs={12} align="center">
            <Typography variant="body1">
              <Trans>Error in getting the Product Details</Trans>
            </Typography>
          </Grid>
        )}
      </Grid>
      {displayAddToCart && (
        <Grid container>
          <Grid item xs={4} align="right" className="">
            {/* <Button color="secondary">
                            Show Details
                        </Button> */}
          </Grid>
          <Grid item xs={8} className="">
            <Button
              onClick={() => addToCart(offer)}
              color="primary"
              variant="contained"
              className="br0"
              fullWidth
              size="large"
            >
              {/* TODO: Need to handle This  */}
              {/* <Trans>
                {productOrderInteractionItem &&
                this.isProductInCart(productOrderInteractionItem, offer.id)
                  ? 'Added'
                  : 'Add to Cart'}

              </Trans> */}
              <Trans>Add to Cart</Trans>
            </Button>
          </Grid>
        </Grid>
      )}
      {/* Product Name Row */}
      <Grid container>
        <Grid item xs={4} align="right" className="maintainRowPadding">
          <Typography variant="body1" className="semiBold">
            <Trans>Product Name</Trans>
          </Typography>
        </Grid>
        <Grid
          item
          xs={8}
          className={classNames('maintainRowPadding', classes.rowColor)}
        >
          <Typography variant="body1" className="semiBold">
            {offer.name}
          </Typography>
        </Grid>
      </Grid>
      {/* Charges Row */}
      <Grid container>
        <Grid item xs={4} align="right" className="maintainRowPadding">
          <Typography variant="body1" className="semiBold">
            <Trans>Total first Invoice</Trans>
          </Typography>
        </Grid>
        <Grid
          item
          xs={8}
          className={classNames('maintainRowPadding', classes.rowColor)}
        >
          <UpdatedPrice
            className="labelHead"
            amount={{
              originalPrice: decimalService(mainPrice, 2)
            }}
            semiBold
          />
        </Grid>
      </Grid>
      {offerPrices.map((item) => {
        return (
          <Grid container key={item.name}>
            <Grid item xs={4} align="right" className="maintainRowPadding">
              <Typography variant="body1" className="semiBold">
                {item.name}
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              className={classNames('maintainRowPadding', classes.rowColor)}
            >
              <Typography>
                {item.priceUnit ? item.priceUnit : ''}{' '}
                {decimalService(parseFloat(item.price), 2)}{' '}
                {item.validity &&
                  getItemCodeByName(recurringPeriods, item.validity)
                  ? `/${getItemCodeByName(recurringPeriods, item.validity)}`
                  : ''}
              </Typography>
            </Grid>
          </Grid>
        );
      })}
      <Grid container>
        <Grid item xs={4} align="right" className="maintainRowPadding">
          <Divider />
        </Grid>
        <Grid
          item
          xs={8}
          className={classNames('maintainRowPadding', classes.rowColor)}
        >
          <Divider />
        </Grid>
      </Grid>

      {/* Contract Row */}
      {minimumContractPeriod !== 0 && (
        <>
          <Grid container>
            <Grid item xs={4} align="right" className="maintainRowPadding">
              <Typography variant="body1" className="semiBold">
                <Trans>Contracts Details</Trans>
              </Typography>
            </Grid>

            <Grid
              item
              xs={8}
              className={classNames('maintainRowPadding', classes.rowColor)}
            />
          </Grid>

          <Grid container>
            <Grid item xs={4} align="right" className="maintainRowPadding">
              <Typography>
                <Trans>Minimum Term Contract</Trans>
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              className={classNames('maintainRowPadding', classes.rowColor)}
            >
              <Typography>{minimumContractPeriod} Months</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4} align="right" className="maintainRowPadding">
              <Divider />
            </Grid>
            <Grid
              item
              xs={8}
              className={classNames('maintainRowPadding', classes.rowColor)}
            >
              <Divider />
            </Grid>
          </Grid>
        </>
      )}
      {/* Description Row */}
      <Grid container>
        <Grid item xs={4} align="right" className="maintainRowPadding">
          <Typography variant="body1" className="semiBold">
            <Trans>Description</Trans>
          </Typography>
        </Grid>
        <Grid
          item
          xs={8}
          className={classNames('maintainRowPadding', classes.rowColor)}
        >
          <Typography>{offer.description}</Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={4} align="right" className="maintainRowPadding">
          <Divider />
        </Grid>
        <Grid
          item
          xs={8}
          className={classNames('maintainRowPadding', classes.rowColor)}
        >
          <Divider />
        </Grid>
      </Grid>
      {/* Inclusions and allowances Row */}
      <Grid container>
        <Grid item xs={4} align="right" className="maintainRowPadding">
          <Typography variant="body1" className="semiBold">
            <Trans>Inclusions & Allowance</Trans>
          </Typography>
        </Grid>
        <Grid
          item
          xs={8}
          className={classNames('maintainRowPadding', classes.rowColor)}
        />
      </Grid>
      <Grid container>
        {inclusions.map((item) => (
          <>
            <Grid item xs={4} align="right" className="maintainRowPadding">
              <div>
                <Typography className="inline verticalMiddle">
                  {item.parent.includes('Fixed') && (
                    <PhoneOutlined className={classes.icon} />
                  )}
                  {item.parent.includes('Broadband') && (
                    <WifiOutlined className={classes.icon} />
                  )}
                  {item.parent.includes('IPTV') && (
                    <TvOutlined className={classes.icon} />
                  )}
                </Typography>
                <Typography className={classNames('inline')}>
                  {item.parent}
                </Typography>
              </div>
            </Grid>
            <Grid
              item
              xs={8}
              className={classNames('maintainRowPadding', classes.rowColor)}
            >
              {item.specs.map((spec) => (
                <Typography key={spec.name}>
                  <li>
                    {spec.specName} - {spec.name} - {spec.value}
                  </li>
                </Typography>
              ))}
            </Grid>
          </>
        ))}
      </Grid>
      {/* Equipments Row */}
      {equipments.length > 0 && (
        <>
          <Grid container>
            <Grid item xs={4} align="right" className="maintainRowPadding">
              <Typography variant="body1" className="semiBold">
                <Trans>Equipments</Trans>
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              className={classNames('maintainRowPadding', classes.rowColor)}
            />
          </Grid>
          <Grid container>
            {equipments.map((item) => (
              <>
                <Grid item xs={4} align="right" className="maintainRowPadding">
                  <Typography>{item.name}</Typography>
                </Grid>
                <Grid
                  item
                  xs={8}
                  className={classNames('maintainRowPadding', classes.rowColor)}
                >
                  <Typography>{item.value}</Typography>
                </Grid>
              </>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

// TODO: Pending is addToCart & productOrderInteractionItem (see Drawer.jsx + ProductSpecs.jsx)
const OfferDetails = (props) => {
  const {
    displayAddToCart,
    addToCart,
    isVisible,
    offeringDetails,
    HideOfferingDetails,
    recurringPeriods,
    classes
  } = props;
  return (
    <Drawer
      anchor="right"
      open={isVisible}
      onClose={() => HideOfferingDetails()}
    >
      {!_isEmpty(offeringDetails) && (
        <ProductSpecs
          displayAddToCart={displayAddToCart}
          addToCart={addToCart}
          HideOfferingDetails={HideOfferingDetails}
          offer={offeringDetails}
          // productOrderInteractionItem={productOrderInteractionItem}
          recurringPeriods={recurringPeriods}
          classes={classes}
        />
      )}
    </Drawer>
  );
};

OfferDetails.propTypes = {
  displayAddToCart: PropTypes.bool,
  addToCart: PropTypes.func,
  isVisible: PropTypes.bool.isRequired,
  offeringDetails: PropTypes.object.isRequired,
  HideOfferingDetails: PropTypes.func.isRequired,
  recurringPeriods: PropTypes.array.isRequired
};

OfferDetails.defaultProps = {
  displayAddToCart: true,
  addToCart: () => { }
};

export default withStyles(styles)(OfferDetails);
