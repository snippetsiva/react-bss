import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FadeModalComponent from '../FadeModal';
import { Box, Typography, Grid } from '@material-ui/core';
import MuiPaper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import WizardFooter from 'wizard/components/Footer';
import ProductCard from 'common/components/ProductCard';
import NoDataFound from '../NoDataFound/NoDataFound';
import { Trans } from '@lingui/macro';
import PreValidationCheck from '../../services/preValidateServiceRequest';
import { withApollo } from 'react-apollo';

const Paper = withStyles(theme => ({
  root: {
    background: theme.palette.background.default
  }
}))(MuiPaper);

const preValidationCheck = new PreValidationCheck();

function ProductSelection(props) {
  const {
    isModalRequired,
    isModalOpen,
    onClose,
    history,
    match,
    activeMenu,
    activeCustomer,
    selectedServiceRequest,
    handleSetActiveProduct,
    client
  } = props;

  const [selectedProduct, setSelectedProduct] = useState('');
  const [loader, setLoader] = useState(false);

  const serviceName = _.get(selectedServiceRequest, 'name', '');
  const serviceCode = _.get(selectedServiceRequest, 'code', '');
  const products = _.get(activeMenu, 'account.product', []).filter(p => {
    if (serviceName.toLowerCase().includes('revoke')) {
      return !['active', 'created', 'initialized', 'inProgress'].includes(p.status);
    } else {
      return p.status === 'active';
    }
  });

  const onSelect = async product => {
    setLoader(true);
    const isValidationPassedMsg = await preValidationCheck.getPrivilege(
      selectedServiceRequest,
      activeCustomer,
      product,
      client
    );

    if (isValidationPassedMsg !== 'PASSED') {
      setLoader(false);
      props.handleShowToast({
        type: 'error',
        message: isValidationPassedMsg
      });
      return;
    }
    setLoader(false);
    setSelectedProduct(_.get(product, 'id'));
    handleSetActiveProduct(product);
  };

  const children = (
    <Paper elevation={0}>
      <Grid container direction="column" spacing={6}>
        <Grid item>
          <Typography variant="h4" color="textPrimary">
            {`Select a Product for ${serviceName} Request`}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={3}>
            {products.length > 0 ? (
              _.map(products, product => (
                <Grid item>
                  <ProductCard
                    product={product}
                    key={_.get(product, 'id', '')}
                    onUnselect={() => {
                      setSelectedProduct('');
                      handleSetActiveProduct({});
                    }}
                    onSelect={() => onSelect(product)}
                    selected={selectedProduct === _.get(product, 'id')}
                    buttonsRequired={true}
                    disableButtons={loader}
                  />
                </Grid>
              ))
            ) : (
              <Box my={8}>
                <NoDataFound ctaTitle={<Trans>No Products Available</Trans>} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );

  if (isModalRequired) {
    return (
      <FadeModalComponent isOpen={isModalOpen} onCloseAction={onClose}>
        {children}
      </FadeModalComponent>
    );
  } else {
    return (
      <>
        {children}
        <WizardFooter
          proceedAction={() => history.push(`${match.path}/${_.camelCase(serviceCode)}`)}
          cartRequired={false}
          buttonText={'Confirm'}
          loader={loader}
          disableProceedButton={selectedProduct === '' ? true : false}
          enableCloseIcon={false}
        />
      </>
    );
  }
}

ProductSelection.defaultProps = {
  isModalRequired: false,
  isModalOpen: false,
  children: null
};

ProductSelection.propTypes = {
  children: PropTypes.any,
  isModalRequired: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  onClose: PropTypes.func,
  classes: PropTypes.object,
  activeMenu: PropTypes.object,
  activeAccount: PropTypes.string,
  selectedServiceRequest: PropTypes.object
};

export default withApollo(ProductSelection);
