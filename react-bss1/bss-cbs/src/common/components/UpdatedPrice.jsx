import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _isNumber from 'lodash/isNumber';

class UpdatedPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { updatedPrice, originalPrice, priceUnit } = this.props.amount;
    return (
      <Box>
        <Typography
          variant={this.props.variant ? this.props.variant : 'body2'}
          className={classNames(
            this.props.className,
            // this.props.semiBold && 'semiBold',
            this.props.grayText && 'grayText'
          )}
        >
          {priceUnit}{' '}
          {updatedPrice || updatedPrice === 0
            ? _isNumber(updatedPrice)
              ? updatedPrice.toFixed(2)
              : updatedPrice
            : _isNumber(originalPrice)
            ? originalPrice.toFixed(2)
            : originalPrice}
        </Typography>
        {(updatedPrice || updatedPrice === 0) &&
          originalPrice &&
          updatedPrice !== originalPrice && (
            <Typography
              color="error"
              variant={
                this.props.subVariant
                  ? this.props.subVariant
                  : this.props.variant
              }
              className={classNames(
                'strikeThrough'
                // this.props.semiBold && 'semiBold'
              )}
            >
              {priceUnit}{' '}
              {_isNumber(originalPrice)
                ? originalPrice.toFixed(2)
                : originalPrice}
            </Typography>
          )}
      </Box>
    );
  }
}
UpdatedPrice.propTypes = {
  amount: PropTypes.shape({
    updatedPrice: PropTypes.number,
    originalPrice: PropTypes.number,
    priceUnit: PropTypes.string
  })
};
UpdatedPrice.defaultProps = {
  amount: {
    updatedPrice: 0,
    originalPrice: 0,
    priceUnit: ''
  }
};

export default UpdatedPrice;
