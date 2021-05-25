import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _get from 'lodash/get';
import { startCustomerTimer } from 'actions/uiActions';
import CallTimer from './CallTimer';

function mapStateToProps(state) {
  const activeCustomer = _get(state, 'app.activeCustomer', '');
  const callTimer = _get(state, `ui.customerTimer['${activeCustomer}']`);
  return { activeCustomer, callTimer };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      startCustomerTimer
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CallTimer);
