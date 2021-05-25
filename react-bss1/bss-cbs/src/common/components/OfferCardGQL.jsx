import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import ErrorOutlineOutlined from '@material-ui/icons/ErrorOutlineOutlined';
import classNames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import { Trans } from '@lingui/macro';
import _get from 'lodash/get';
import config from 'config';
import { SvgIcon } from '@tt-dclm/dclm-web-ui';
import constants from 'common/constants/constants';
import { getItemCodeByName, isOneTimePrice, isRecurringPrice } from 'common/utils/commonUtility';
import { decimalService } from 'common/utils/stringUtil';
import { calculateTotalCharges, getOrderItemPrices } from 'common/utils/chargesUtil';

const styles = theme => ({
  root: {
    color: theme.palette.primary.main,
    padding: theme.spacing(8, 6),
    minHeight: '100%',
    boxShadow: 'none',
    position: 'relative',
    border: '1px solid #EAEAE5'
  },
  itemRoot: {
    width: 240
  },
  topOffersButtonColor: {
    color: theme.palette.primary.main
  },
  topOffersButtonBackground: {
    color: theme.palette.primary.main,
    padding: theme.spacing(0),
    borderRadius: theme.spacing(3),
    borderColor: theme.palette.primary.main,
    '&:hover': {
      background: 'transparent'
    }
  },
  addedToCartBtn: {
    padding: theme.spacing(0, 2),
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 8,
    '&:hover': {
      background: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  },
  incBtn: {
    background: theme.palette.primary.main,
    minWidth: theme.spacing(10.7),
    padding: theme.spacing(0),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(0, 50, 50, 0),
    '&:hover': {
      background: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  },
  decBtn: {
    background: theme.palette.primary.main,
    minWidth: theme.spacing(10.7),
    padding: theme.spacing(0),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(50, 0, 0, 50),
    '&:hover': {
      background: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  },
  cartCount: {
    background: theme.palette.primary.main,
    borderRadius: 0
  },
  quickText: {
    marginTop: theme.spacing(2),
    height: 24
  },
  secondaryButton: {
    color: theme.palette.text.primary
  },
  icon: {
    fontSize: 22,
    color: theme.palette.text.primary,
    marginRight: theme.spacing(3),
    '&:hover': {
      color: theme.palette.text.primary
    }
  },
  captionText: {
    letterSpacing: 0,
    fontWeight: 'bold',
    color: theme.palette.text.secondary
  },
  prodSpec: {
    letterSpacing: 0,
    color: theme.palette.common.doveGray,
    paddingBottom: theme.spacing(4)
  },
  startsFrom: {
    // to chnge
    textAlign: 'left',
    letterSpacing: 0,
    opacity: 1,
    textDecoration: 'line-through',
    color: theme.palette.error.main
  },
  topHeader: {
    height: 90
  },
  topOffersPrice: {
    fontWeight: 500,
    color: theme.palette.text.primary
  },
  sidePrice: {
    fontWeight: 100,
    color: theme.palette.text.primary,
    marginRight: theme.spacing(1)
  },
  contractIcon: {
    marginRight: 0,
    marginLeft: 18,
    marginTop: 10,
    '&.isvg svg': {
      fill: theme.palette.common.black
    }
  },
  hidden: {
    visibility: 'hidden'
  },
  category: {
    height: 18
  },
  perMonth: {
    color: theme.palette.text.secondary
  },
  cardFooter: {
    paddingTop: theme.spacing(4)
  },
  sectionWrapper: {
    minHeight: '100%'
  },
  bottomSpacing: {
    marginBottom: theme.spacing(2)
  },
  ribbon: {
    position: 'absolute',
    overflow: 'hidden',
    width: 135,
    height: 135,
    '&::before': {
      content: 'close-quote',
      position: 'absolute',
      display: 'block',
      border: `5px solid ${theme.palette.error.main}`
    },
    '&::after': {
      content: 'close-quote',
      position: 'absolute',
      display: 'block',
      border: `5px solid ${theme.palette.error.main}`
    }
  },
  ribbonTopRight: {
    top: -10,
    right: -10,
    '&::before': {
      content: 'close-quote',
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      top: 0,
      left: 30
    },
    '&::after': {
      content: 'close-quote',
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      bottom: 30,
      right: 0
    }
  },
  ribbonText: {
    position: 'absolute',
    display: 'block',
    padding: theme.spacing(1, 0),
    margin: theme.spacing(2),
    width: 225,
    fontSize: 12,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.primary.contrastText,
    textTransform: 'uppercase',
    textAlign: 'center',
    left: -25,
    top: 30,
    transform: 'rotate(45deg)'
  },
  visibilityOff: {
    visibility: 'hidden'
  }
});

class OfferCardGQL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offer: null,
      cardInfo: null
    };
  }

  componentDidMount = async () => {
    const { offer } = this.props;
    let category = '';
    offer.category > 0 &&
      offer.category.forEach((cat, index) => {
        if (cat && cat.name) {
          if (index < offer.category.length - 1) {
            category += cat.name ? `${cat.name} - ` : '';
          }

          if (index === offer.category.length - 1) {
            category += cat.name ? cat.name : '';
          }
        }
      });

    let startPrice = 0;
    let priceUnit = '';

    offer.productOfferingPrice.forEach(offerPrice => {
      if (offerPrice) {
        const { price } = offerPrice;
        if (
          offerPrice['baseType'] === constants.productPriceBaseType.CHARGE &&
          offerPrice['type'] === constants.productPriceType.RECURRING
        ) {
          startPrice += price.value;
          priceUnit = price.unit;
        }
      }
    });

    this.setState({
      offer,
      cardInfo: {
        category,
        startPrice,
        priceUnit
      }
    });
  };

  returnIcon = (name, classes) => {
    let iconName = '';
    if (name.toLowerCase().includes('fxl')) {
      iconName = 'fixedline_offercard';
    } else if (name.toLowerCase().includes('iptv')) {
      iconName = 'iptv_offercard';
    } else if (name.toLowerCase().includes('broadband')) {
      iconName = 'Broadband_offercard';
    } else if (name.toLowerCase().includes('mobile')) {
      iconName = 'call_inactive';
    } else if (name.toLowerCase().includes('cloud')) {
      iconName = 'sms';
    }

    return (
      <Tooltip title={name} key={name}>
        <div>
          {iconName ? (
            <SvgIcon iconWidth={20} iconName={iconName} className={classes.icon} />
          ) : (
            <ErrorOutlineOutlined className={classes.icon} />
          )}
        </div>
      </Tooltip>
    );
  };

  printIcons = (offer, classes) => {
    const icons = [];
    if (!offer.isBundle) {
      const { name } = offer;
      const icon = this.returnIcon(name, classes);
      icons.push(icon);
    } else if (offer.isBundle && offer.bundledProductOffering && offer.bundledProductOffering.length > 0) {
      const { bundledProductOffering } = offer;
      for (let i = 0; i < bundledProductOffering.length; i++) {
        if (i > 3) break;
        const { name } = bundledProductOffering[i];
        const icon = this.returnIcon(name, classes);
        icons.push(icon);
      }
    } else {
      return (
        <Tooltip title={offer.name}>
          <div>
            <ErrorOutlineOutlined className={classes.icon} />
          </div>
        </Tooltip>
      );
    }
    return icons.slice(0, 4);
  };

  // Check whether the product is in cart
  isProductInCart = (cartProduct, productId) => {
    return _.find(
      _.get(cartProduct.item, 'orderItem'),
      orderItem => orderItem && orderItem.productOffering.id === productId
    );
  };

  getPriceValue = offer => {
    const dataValue = getOrderItemPrices(offer, 'add', '');
    const returnValue = {
      Rental: {
        taxIncludedAmount: 0,
        unit: ''
      },
      OneTimeCharge: {
        taxIncludedAmount: 0,
        unit: ''
      }
    };
    dataValue.map((priceObj, index) => {
      const { price } = priceObj;
      if (isOneTimePrice(priceObj)) {
        // returnValue.OneTimeCharge.taxIncludedAmount += price.taxIncludedAmount || price.value || 0;

        returnValue.OneTimeCharge.unit = price.unit;
      }
      if (isRecurringPrice(priceObj)) {
        // returnValue.Rental.taxIncludedAmount += price.taxIncludedAmount || price.value || 0;
        returnValue.Rental.unit = price.unit;
      }
    });
    const allRentalPrices = (offer.productOfferingPrice || []).filter(item => isRecurringPrice(item));
    const allUpFrontPrices = (offer.productOfferingPrice || []).filter(item => isOneTimePrice(item));

    const { totalUpfrontPricing, totalRentalPricing } = calculateTotalCharges(allUpFrontPrices, allRentalPrices);

    returnValue.OneTimeCharge.taxIncludedAmount += totalUpfrontPricing;
    returnValue.Rental.taxIncludedAmount += totalRentalPricing;

    return returnValue;
  };

  handleAddToCart = offer => {
    const priceValue = this.getPriceValue(offer);
    this.props.handleCartItemPrice(priceValue);
    this.props.addToCart(offer);
  };

  handleDecreaseCart = offer => {
    const priceValue = this.getPriceValue(offer);
    this.props.handleCartItemPrice(priceValue);
    this.props.decreaseQuantity(offer);
  };

  render() {
    const {
      classes,
      diwaliRibbon,
      addToCart,
      isHomePage,
      onClickItem,
      onClickCompareItem,
      showNotificatonIcon = true,
      enableQuickText = true,
      cta = 'Add to Cart'
    } = this.props;
    const { offer, cardInfo } = this.state;

    if (!offer) return null;

    const { attachment } = offer;
    let imgUrl = `${config.basePath}assets/images/ImageNotFound.png`;
    for (const a of attachment) {
      if (a && a['type'] === 'ProductImage') {
        imgUrl = a.url;
      }
    }

    const productSpecification = _.compact([
      offer.productSpecification && offer.productSpecification.technology[0],
      offer.productSpecification && offer.productSpecification.LoB,
      offer.businessType[0]
    ]).join('-');
    const isVisible = offer.productOfferingTerm && offer.productOfferingTerm.length > 0;
    let productOfferingTermDuration = isVisible
      ? `${offer.productOfferingTerm[0].duration.amount} ${offer.productOfferingTerm[0].duration.units}`
      : '';
    let productOfferingTermDurationList = '';
    if (offer.productOfferingTerm.length > 1) {
      productOfferingTermDuration = `${productOfferingTermDuration}...`;
      productOfferingTermDurationList = offer.productOfferingTerm
        .map(term => `${term.duration.amount} ${term.duration.units}`)
        .join(', ');
    }
    const strikedPrice = 'Starts From';
    const priceValue = this.getPriceValue(offer);

    return (
      <Grid className={classes.itemRoot}>
        <Paper className={classes.root} elevation={1}>
          {diwaliRibbon && (
            <div className={`${classes.ribbon} ${classes.ribbonTopRight}`}>
              <Typography variant="label2" className={classes.ribbonText}>
                {' '}
                <Trans>Diwali Offer</Trans>
              </Typography>
            </div>
          )}

          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Grid container alignItems="center" justify="space-between">
                <Grid item xs={12}>
                  <Tooltip title={offer.name}>
                    <Typography variant="subtitle1" noWrap className={classes.captionText} align="center">
                      {offer.name.length > 17 ? `${offer.name.slice(0, 17)}...` : offer.name}
                    </Typography>
                  </Tooltip>
                  {productSpecification.length ? (
                    <Tooltip title={productSpecification}>
                      <Typography noWrap variant="body1" component="div" className={classes.prodSpec} align="center">
                        {productSpecification.length > 20
                          ? `${productSpecification.slice(0, 20)}...`
                          : productSpecification}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography
                      variant="body1"
                      component="div"
                      className={classNames(classes.visibilityOff, classes.prodSpec)}
                    >
                      NO PC
                    </Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  className={classes.topHeader}
                  onClick={() => {
                    onClickItem && onClickItem(offer);
                  }}
                >
                  {offer.productOfferingPrice && offer.productOfferingPrice.length > 0 ? (
                    <Grid item container xs={12} justify="center" alignItems="center" direction="column">
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          alignItems="baseline"
                          className={classes.bottomSpacing}
                        >
                          <Grid item>
                            <Typography className={classes.sidePrice} variant="h5">
                              {_get(priceValue, 'Rental.unit', '')}{' '}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography className={classes.topOffersPrice} variant="h1">
                              {decimalService(
                                parseFloat(
                                  _get(priceValue, 'Rental.unit', '')
                                    ? _get(priceValue, 'Rental.taxIncludedAmount', 0)
                                    : 0
                                ),
                                2
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          alignItems="baseline"
                          className={classes.bottomSpacing}
                        >
                          <Grid item>
                            <Typography className={classes.sidePrice} variant="subtitle1">
                              {_get(priceValue, 'OneTimeCharge.unit', _get(priceValue, 'Rental.unit', ''))}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography className={classes.topOffersPrice} variant="h5">
                              {decimalService(parseFloat(_get(priceValue, 'OneTimeCharge.taxIncludedAmount', 0)), 2)}{' '}
                            </Typography>
                          </Grid>
                          <Grid item>
                            {decimalService(parseFloat(_get(priceValue, 'OneTimeCharge.taxIncludedAmount', 0)), 2) >
                              0 && (
                              <Typography className={classes.perMonth} variant="button">
                                &nbsp;<Trans>/ upfront</Trans>
                              </Typography>
                            )}
                          </Grid>
                        </Grid>{' '}
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>

                {showNotificatonIcon ? (
                  <Grid item xs={12}>
                    <Grid container direction="row" justify="center" alignItems="center">
                      {this.printIcons(offer, classes)}
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>

              {enableQuickText ? (
                <Grid item xs={12} className={classes.quickText}>
                  <Grid container direction="row" justify="center" alignItems="baseline">
                    <Grid item align="right">
                      {isVisible && !_.isEmpty(productOfferingTermDuration) ? (
                        <Tooltip title={productOfferingTermDurationList}>
                          <Typography className={classes.perMonth} variant="button" noWrap>
                            <Trans>Contract</Trans> {productOfferingTermDuration}
                          </Typography>
                        </Tooltip>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="flex-end"
                className={classes.cardFooter}
              >
                <Grid item>
                  <Button
                    data-cy="compare"
                    onClick={e => {
                      e && e.stopPropagation() && e.stopImmediatePropagation();
                      onClickCompareItem && onClickCompareItem(offer);
                    }}
                    className={classNames(classes.topOffersButtonBackground, classes.secondaryButton)}
                  >
                    + &nbsp;
                    <Typography variant="button">
                      {' '}
                      <Trans>Compare</Trans>
                    </Typography>
                  </Button>
                </Grid>
                <Grid item>
                  {offer.feasibilityCheck ? (
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      variant="outlined"
                      className={classes.topOffersButtonBackground}
                    >
                      <Typography variant="button">
                        {' '}
                        <Trans>Feasibility Check</Trans>
                      </Typography>
                    </Button>
                  ) : offer.quantity && offer.quantity > 0 ? (
                    <Grid container>
                      <Box px={-10}>
                        <Button className={classes.decBtn} onClick={() => this.handleDecreaseCart(offer)}>
                          <Trans>-</Trans>
                        </Button>
                      </Box>
                      <Typography className={classes.cartCount}>{offer.quantity}</Typography>
                      <Box px={-10}>
                        <Button className={classes.incBtn} onClick={() => this.handleAddToCart(offer)}>
                          <Trans>+</Trans>
                        </Button>
                      </Box>
                    </Grid>
                  ) : (
                    <Button
                      data-cy="addToCart"
                      onClick={e => {
                        e && e.stopPropagation() && e.stopImmediatePropagation();
                        isHomePage ? this.handleAddToCart(offer) : addToCart(offer);
                      }}
                      variant="outlined"
                      className={classNames(classes.addedToCartBtn)}
                    >
                      <Typography variant="button"> {cta}</Typography>
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(OfferCardGQL);
