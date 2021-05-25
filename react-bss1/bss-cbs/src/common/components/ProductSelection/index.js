import ProductSelection from './ProductSelection';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { handleSetActiveProduct } from 'actions/app';
import { handleShowToast } from 'actions/uiActions';

function mapStateToProps(state) {
  const activeMenu = _.get(state, 'app.activeMenu', {});
  const activeCustomer = _.get(state, 'app.activeCustomer', {});
  const selectedServiceRequest = _.get(state, 'entities.serviceRequests.selectedServiceRequest', {});

  return {
    activeMenu,
    selectedServiceRequest,
    activeCustomer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      handleSetActiveProduct,
      handleShowToast
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelection);
