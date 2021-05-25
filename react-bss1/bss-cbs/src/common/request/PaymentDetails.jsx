import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _get from 'lodash/get';
import { Typography, Grid, Box } from '@material-ui/core';
import { Trans } from '@lingui/macro';
import _isArray from 'lodash/isArray';
import _upperFirst from 'lodash/upperFirst';
import _find from 'lodash/find';
import Scroll from 'react-scroll';
import Dayjs from 'dayjs';
import { getItemNameByCode } from 'common/utils/commonUtility';
import Expansion from 'common/components/Expansion/Expansion';
import constants from 'common/constants/constants';

const { Element } = Scroll;

const getFormattedDate = createdDate => {
  return Dayjs(createdDate).format(constants.dateFormat.fullDateMonth);
};

const PaymentDetails = withStyles(theme => ({
  main: {
    padding: '20px 0px',
    color: theme.palette.text.primary
  },
  mainData: {
    marginBottom: '1.5em'
  }
}))(({ classes, payments, productPayments, productOffering, bankList }) => {
  const getArrayData = data => {
    let bankBranchData = {};
    const array = Object.keys(data).map(item => {
      if (item !== 'value') {
        if (item === 'date') {
          return {
            name: item,
            value: Dayjs(data[item]).format(constants.dateFormat.fullDateMonth)
          };
        }
        if (item === 'bank') {
          bankBranchData = _find(bankList, b => {
            return b.code === data[item];
          });
          return {
            name: item,
            value: getItemNameByCode(bankList, data[item], '')
          };
        }
        if (item === 'branch') {
          return {
            name: item,
            value: getItemNameByCode(_get(bankBranchData, 'branch', []), data[item])
          };
        }
        if (item === 'checkId') {
          return {
            name: 'Check ID',
            value: data[item]
          };
        }
        if (item === 'cardNumber') {
          return {
            name: 'Card Number',
            value: data[item]
          };
        }
        return {
          name: item,
          value: data[item]
        };
      }
      return null;
    });
    return array;
  };

  const paymentMethods = _get(payments, 'paymentMethod', []);
  if (!payments) {
    return null;
  }
  return (
    <Element className={classes.main} name="payment-section-request">
      <Expansion
        expansionElements={[
          {
            headerElement: (
              <Grid container direction="column" xs={12}>
                <Grid item>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item align="left">
                      <Typography variant="subtitle1">
                        <Trans>Upfront Charges</Trans>
                      </Typography>
                    </Grid>
                    <Grid item align="right">
                      <Typography variant="subtitle1">
                        {_get(payments, 'totalAmount.unit', '')} {_get(productPayments, '[0]', {}).oneTimeTotal}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item align="left">
                      <Typography variant="body1">
                        <Trans>PAID AMOUNT (tax incl.)</Trans>
                      </Typography>
                    </Grid>
                    <Grid item align="right">
                      <Typography variant="body1">
                        {_get(payments, 'totalAmount.unit', '')} {_get(payments, 'totalAmount.value', 0)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ),
            detailElement: (
              <div>
                <Box mx={15}>
                  <Grid container spacing={2}>
                    {productOffering &&
                      productOffering.map(product => {
                        return (
                          <>
                            <Grid item>
                              <Typography variant="subtitle1" className="bold">
                                {_get(product, 'name', 'NA')}
                              </Typography>
                            </Grid>
                            {_get(productPayments, '[0].priceSummary.oneTimeCharge', []).map(summary => {
                              return (
                                <Grid item container direction="row" alignItems="center" spacing={2}>
                                  <Grid item>
                                    <Typography variant="caption">
                                      <Trans>Installation fee</Trans>
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="body1">
                                      {_get(summary, 'price.taxIncludedAmount.unit', '')}{' '}
                                      {_get(summary, 'price.taxIncludedAmount.value')}{' '}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              );
                            })}
                          </>
                        );
                      })}
                  </Grid>
                </Box>
              </div>
            )
          },
          {
            headerElement: (
              <Grid container direction="column" xs={12}>
                <Grid item>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item align="left">
                      <Typography variant="subtitle1">
                        <Trans>Rentals</Trans>
                      </Typography>
                    </Grid>
                    <Grid item align="right">
                      <Typography variant="subtitle1">
                        {_get(productPayments, '[0]', {}).unit} {_get(productPayments, '[0]', {}).rentalTotal}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {payments.paymentDate && (
                  <Grid item>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                      <Grid item align="left">
                        <Typography variant="body1">
                          <Trans>INVOICE DATE</Trans>
                        </Typography>
                      </Grid>
                      <Grid item align="right">
                        <Typography variant="body1">{getFormattedDate(payments.paymentDate)}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            ),
            detailElement: (
              <Grid container spacing={2} className={classes.mainData}>
                {productOffering &&
                  productOffering.map(product => {
                    return (
                      <Box mx={15}>
                        <Grid item>
                          <Typography variant="subtitle1" className="bold">
                            {_get(product, 'name', 'NA')}
                          </Typography>
                        </Grid>
                        {_get(productPayments, '[0].priceSummary.Rental', []).map(summary => {
                          return (
                            <Grid item container direction="row" alignItems="center" spacing={2}>
                              <Grid item>
                                <Typography variant="caption">
                                  <Trans>Rental</Trans>
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography variant="body1">
                                  {_get(summary, 'price.taxIncludedAmount.unit')}{' '}
                                  {_get(summary, 'price.taxIncludedAmount.value')}{' '}
                                </Typography>
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Box>
                    );
                  })}
              </Grid>
            )
          },
          {
            headerElement: (
              <Grid container direction="row" justify="space-between" alignItems="center">
                <Grid item align="left">
                  <Typography variant="subtitle1">
                    <Trans>Payment Details</Trans>
                  </Typography>
                </Grid>
              </Grid>
            ),
            detailElement: (
              <Grid container direction="row" justify="space-around">
                {_isArray(paymentMethods) &&
                  paymentMethods.map((item, index) => {
                    return (
                      <>
                        <Grid item>
                          <Grid container direction="column" alignItems="baseline">
                            <Grid item>
                              <Typography variant="caption" gutterBottom>
                                <Trans>Payment Mode</Trans>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="body1" gutterBottom>
                                {_get(item, '@type')}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        {_get(item, 'details', {}) &&
                          getArrayData(_get(item, 'details', {})).map((element, index) => {
                            return (
                              element &&
                              element.value !== '' && (
                                <Grid item key={index}>
                                  <Grid container direction="column" alignItems="baseline">
                                    <Grid item>
                                      <Typography variant="caption" gutterBottom>
                                        {_upperFirst(element.name)}
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography variant="body1" gutterBottom>
                                        {element.value}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              )
                            );
                          })}
                        <Grid item>
                          <Grid container direction="column" alignItems="baseline">
                            <Grid item>
                              <Typography variant="caption" gutterBottom>
                                <Trans>Paid Amount</Trans>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="body1" gutterBottom>
                                {_get(item, 'details.value[0].unit', '')} {_get(item, 'details.value[0].value', 0)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    );
                  })}
              </Grid>
            )
          }
        ]}
      />
    </Element>
  );
});

export default PaymentDetails;
