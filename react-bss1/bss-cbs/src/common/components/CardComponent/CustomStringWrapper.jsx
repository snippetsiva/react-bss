import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import config from 'config';
import _get from 'lodash/get';
import { convertFarsiDigits } from 'common/utils/commonUtility';
const isMtni = _get(config, 'dev.server.opco', '') === 'mtni';
class CustomStringWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: props.value,
      value: props.value
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.currentValue) {
      return {
        currentValue: nextProps.value,
        value: nextProps.value
      };
    }
    return null;
  }

  onChangeAction = e => {
    let value = e.currentTarget.value;
    if (isMtni) {
      value = convertFarsiDigits(value);
    }
    this.setState(
      {
        value: value
      },
      () => {
        if ((this.props.rawErrors || []).length) {
          this.onBlurAction();
        }
      }
    );
  };

  onBlurAction = () => {
    this.props.onChange(this.state.value);
    if (this.props.schema.onBlurAction) {
      this.props.schema.onBlurAction(this.state.value);
    }
  };

  render() {
    const { required, disabled, schema, name, readonly, label } = this.props;

    return (
      <TextField
        value={this.state.value}
        onChange={this.onChangeAction}
        onBlur={this.onBlurAction}
        disabled={disabled || readonly}
        readOnly={readonly}
        label={label}
        name={name}
        required={required}
        {...schema}
        placeholder={schema.placeholder}
        inputProps={{
          'data-cy': schema.id
        }}
      />
    );
  }
}

export default CustomStringWrapper;
