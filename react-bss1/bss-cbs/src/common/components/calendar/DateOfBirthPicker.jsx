import React, { Component } from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
// below line is added because in DMLD can not understand react-date without it
// in dclm we have same in rootview - please dont remove it
import 'react-dates/initialize';
import constants from '../../constants/constants';

const generateYears = (yearEndRange, yearStartRange) => {
  const yearArray = [];
  for (let i = yearStartRange; i <= yearEndRange; i++) {
    yearArray.push(
      <option value={moment().year() - i}>{moment().year() - i}</option>
    );
  }
  return yearArray;
};

class DateOfBirthPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      date: null
    };
  }

  componentDidMount() {
    const temp = this.props.field.value || this.props.value || null;
    this.setState({
      date: temp
    });
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.field.value !== this.props.field.value ||
        prevProps.value !== this.props.value) &&
      this.props.value
    ) {
      this.setState({
        date: this.props.value
      });
    } else if (
      prevProps.field.value !== this.props.field.value ||
      prevProps.value !== this.props.value
    ) {
      this.setState({
        date: this.props.field.value || this.props.value
      });
    }

    // Update end date value when ever there is change in start date value.
    // End date cannot be lesser then start date
    if (
      this.props.hasStartDate &&
      prevProps.hasStartDate !== this.props.hasStartDate &&
      this.props.hasStartDate.isSameOrAfter(this.state.date)
    ) {
      const {
        form: { setFieldValue },
        path
      } = this.props;
      const dateStr = moment(this.props.hasStartDate, constants.dateFormat.dob);
      setFieldValue(path, dateStr);
      this.setState({
        date: dateStr
      });
    }
  }

  onDateChange = (date) => {
    this.setState({ date });
    if (this.props.onChange) {
      this.props.onChange(date);
    }
  };

  onFocusChange = ({ focused }) => {
    this.setState({ focused });
  };

  getMinAgeDate = () => {
    let temp = new Date();

    if (this.props.isExpiryDate) {
      temp = moment().add('day', 1).toDate();
    }
    if (this.props.isDob) {
      const tempDate = new Date();
      temp = new Date(
        tempDate.getFullYear() - constants.minAge,
        tempDate.getMonth(),
        tempDate.getDate()
      );
    }

    return temp.toISOString();
  };

  getDates = (day, hasStartDate) => {
    let dateRange;
    if (this.props.isDob) {
      //  Block all dates where user is less then minAge
      dateRange = day >= moment().subtract(constants.minAge, 'years');
    } else if (this.props.isExpiryDate) {
      //  Block all dates less then CURRENT DATE/IF IT HAS START DATE
      if (hasStartDate) {
        dateRange = day < moment(hasStartDate).add(0, 'days');
      } else {
        //  Block all dates less then CURRENT DATE
        dateRange = day < moment().add(0, 'days');
      }
    } else if (this.props.isIssueDate) {
      //  Block all dates greater then CURRENT DATE
      dateRange = day > moment().add(0, 'days');
    } else if (this.props.isStartDate) {
      //  Block all dates less then CURRENT DATE
      dateRange = day < moment().add(-1, 'days');
    } else if (this.props.isCheque) {
      // Only last 3 months are valid, before that or after that are invalid date
      const startDate = moment().subtract(constants.chequeValidDate, 'months');
      const endDate = moment();
      dateRange = !moment(day).isBetween(startDate, endDate);
    } else if (this.props.isPromiseToPay) {
      // only 45 days from the current date are valid
      const endDate = moment(moment()).add(
        constants.promisingDateValidity,
        'days'
      );
      dateRange = !moment(day).isBetween(moment(), endDate);
    }
    return dateRange;
  };

  render() {
    let yearStartRange;
    let yearEndRange;
    if (this.props.isDob) {
      yearStartRange = constants.minAge;
      yearEndRange = 115;
    } else if (this.props.isExpiryDate) {
      yearStartRange = -100;
      yearEndRange = 0;
    } else if (this.props.isIssueDate) {
      yearStartRange = 0;
      yearEndRange = 100;
    } else if (this.props.terminationDate) {
      yearStartRange = -100;
      yearEndRange = 0;
    } else if (this.props.isStartDate) {
      yearStartRange = -100;
      yearEndRange = 0;
    }
    const {
      form: { setFieldValue, setFieldTouched, values },
      field,
      path,
      classes,
      disabled,
      showDefaultInputIcon = true,
      isLabel,
      ...rest
    } = this.props;
    const { focused, date } = this.state;
    if (date === '') {
      this.setState({ date: new Date() });
    }
    const selectedDate = date !== null ? moment(date) : null;
    return (
      <SingleDatePicker
        date={selectedDate}
        numberOfMonths={1}
        noBorder={isLabel}
        // initialDate={moment().add(3, "days")}
        onDateChange={(changedDate) => {
          // Check if date is valid
          if (
            changedDate !== null &&
            changedDate._isAMomentObject &&
            !this.getDates(changedDate, this.props.hasStartDate)
          ) {
            this.setState({ changedDate });
            this.onDateChange(changedDate);
            const dateStr = moment(changedDate, constants.dateFormat.dob);
            setFieldValue(path, dateStr);
          } else {
            // If changed date in invalid making focused true
            // Fix for mannual date typing
            this.onFocusChange({ focused: true });
          }
        }}
        focused={focused}
        onFocusChange={(focused) => {
          this.onFocusChange(focused);
          if (focused) {
            this.setState({
              date:
                this.props.field.value ||
                this.props.value ||
                this.getMinAgeDate()
            });
          }
        }} // PropTypes.func.isRequired
        isOutsideRange={() => false}
        hideKeyboardShortcutsPanel
        displayFormat={constants.dateFormat.dob}
        placeholder="DD-MM-YYYY"
        showDefaultInputIcon={showDefaultInputIcon}
        disabled={disabled}
        block
        isDayBlocked={(day) => this.getDates(day, this.props.hasStartDate)}
        renderMonthElement={({ month, onMonthSelect, onYearSelect }) => {
          if (selectedDate === null) {
            onYearSelect(month, moment().year() - (yearStartRange - 2));
          }
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div>
                <select
                  value={month.month()}
                  onChange={(e) => {
                    onMonthSelect(month, e.target.value);
                  }}
                >
                  {moment.months().map((label, value) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={month.year()}
                  onChange={(e) => {
                    onYearSelect(month, e.target.value);
                  }}
                >
                  {generateYears(yearEndRange, yearStartRange)}
                </select>
              </div>
            </div>
          );
        }}
      />
    );
  }
}

export default DateOfBirthPicker;
