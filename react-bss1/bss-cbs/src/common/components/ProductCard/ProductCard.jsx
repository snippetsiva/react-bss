import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Trans } from '@lingui/macro';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { STATUS_COLOR_VALUES } from 'common/utils/timelineUtils';
import toUpper from 'lodash/toUpper';

const styles = theme => ({
  root: {
    padding: theme.spacing(4),
    borderRadius: theme.spacing(4),
    // marginBottom: theme.spacing(6),
    border: `1px solid ${theme.palette.custom.mercury}`,
    backgroundColor: theme.palette.background.paper
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 500,
    marginRight: theme.spacing(4)
  },
  separatedList: {
    display: 'flex',
    marginLeft: theme.spacing(2)
  },
  ...STATUS_COLOR_VALUES(theme, 'background', {
    color: theme.palette.primary.white,
    padding: theme.spacing(1, 6),
    borderRadius: theme.spacing(2)
  }),
  active: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.primary.white,
    padding: theme.spacing(1, 6),
    borderRadius: theme.spacing(2)
  }
});

const Card = props => {
  const { classes, product, selected, onSelect, onUnselect, buttonsRequired, disableButtons } = props;
  const { name, status, technology, businessType, billingAccount, publicIdentifier } = product;

  const separatedList = [{ value: businessType }];
  if (technology) {
    separatedList.push({
      value: technology
    });
  }
  if (billingAccount && billingAccount.id) {
    separatedList.push({
      label: <Trans>Account</Trans>,
      accountId: billingAccount.id
    });
  }

  return (
    <Grid container className={classes.root} justify="space-between">
      <Grid item xs={5}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="h5" className={classes.title}>
              {`${name} - ${publicIdentifier}`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="caption" className={classNames(classes.status, classes[status])}>
              {toUpper(status)}
            </Typography>
          </Grid>
          <Grid item className={classes.separatedList}>
            {separatedList.map((item, index) => (
              <Box px={4} key={index}>
                {item.accountId && (
                  <Typography variant="body1">
                    {item.label} - {item.accountId}
                  </Typography>
                )}
                <Typography component="span" variant="body1">
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Grid>
      {buttonsRequired && (
        <Grid item xs={1} align="right">
          {selected ? (
            <Button disabled={disableButtons} onClick={onUnselect} variant="contained" color="primary">
              <Trans>Unselect</Trans>
            </Button>
          ) : (
            <Button disabled={disableButtons} onClick={onSelect} variant="outlined" color="primary">
              <Trans>Select</Trans>
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export const ProductCard = withStyles(styles)(Card);

ProductCard.defaultProps = {
  selected: false
};

ProductCard.propTypes = {
  selected: PropTypes.bool,
  accountID: PropTypes.number,
  onSelect: PropTypes.func,
  onUnselect: PropTypes.func,
  classes: PropTypes.object,
  product: PropTypes.object.isRequried
};

export default ProductCard;
