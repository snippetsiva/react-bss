import React, { useState } from 'react';
import { withStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Trans } from '@lingui/macro';
import constants from 'common/constants/constants';
import DatePickerComponent from 'common/components/DatePicker/DatePickerComponent';
import CustomSelect from 'common/components/CustomSelect';
import dayjs from 'dayjs';

const Styles = theme => ({
  datePickerRoot: {
    marginBottom: theme.spacing(4)
  },
  checkText: {
    width: 125,
    display: 'inline-block',
    verticalAlign: 'middle',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    margin: theme.spacing(3, 0)
  },
  error: {
    color: theme.palette.error.main,
    fontSize: theme.typography.title,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(6)
  },
  formInput: {
    display: 'block',
    minWidth: 260,
    maxWidth: 260
  }
});

// validate the choosen date
const valiDate = (type, newDate, fDate, tDate) => {
  const fromDate = fDate || new Date();
  const toDate = tDate || new Date();
  const today = new Date();

  switch (type) {
    case 'fromDate': {
      if (newDate > toDate) return <Trans>From-Date cannot be greater than To-Date</Trans>;
      if (newDate > today) return <Trans>From-Date cannot be grater than Today</Trans>;
      return false;
    }
    case 'toDate': {
      if (newDate < fromDate) return <Trans>To-Date cannot be less than From-Date</Trans>;
      // if (newDate > today)
      //   return <Trans>To-Date cannot be greater than Today</Trans>;
      return false;
    }
    default:
      return false;
  }
};

const getFormattedDate = (dateVal, setCurrentDate) => {
  return !setCurrentDate ? dayjs(new Date(dateVal)) : dateVal;
};

const FilterModal = ({
  classes,
  fromDate = new Date(),
  toDate = new Date(),
  checkBoxValues = [],
  approvalTypes = [],
  onCancel,
  onApply,
  isCheckbox = true,
  isInteractionTable = false,
  isStatusCheckBox = true,
  setCurrentDate,
  requestType = <Trans>Request Type</Trans>,
  isTransactionType = false,
  transactionValues = [],
  selectedTransactionTypeValues = {},
  documentTypeList = [],
  documentPurposeList = [],
  isDateTypeSelection = false,
  isDocumentTypeList = false,
  isDocumentPurposeList = false
}) => {
  const [fDate, setFromDate] = useState(fromDate);
  const [sDate, setToDate] = useState(toDate);
  const [checkboxes, setCheckBoxValue] = useState(checkBoxValues);
  const [selectedTransactionType, setSelectedTransactionType] = useState();
  const [selectedDocumentType, setSelectedDocumentType] = useState();
  const [selectedPurpose, setSelectedPurpose] = useState();
  const [statuses, setStatus] = useState(approvalTypes);
  const [selectedDateType, setSelectedDateType] = useState('0');

  const [error, setError] = useState('');
  const [isCleared, setCleared] = useState(false);
  const [searchText, setSearchText] = useState((currentCheckValue && currentCheckValue[0]) || '');
  const [searchStatus, setSearchStatus] = useState((currentStatus && currentStatus[0]) || '');

  const onCancelAction = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setCleared(true);
    setSearchText('');
    setSearchStatus('');
    checkboxes.map(c => {
      c.checked = false;
    });
    statuses.map(s => {
      s.checked = false;
    });
    setSelectedTransactionType({});
    setSelectedDocumentType({});
    setSelectedPurpose({});
    onCancel();
  };
  const currentCheckValue = checkboxes.filter(c => c.checked);
  const currentStatus = statuses.filter(s => s.checked);
  const onApplyAction = () => {
    if (isCleared) {
      onCancel();
    } else {
      onApply({
        fromDate: fDate,
        toDate: sDate,
        selectedValues: [...checkboxes.filter(c => c.checked)],
        selectedStatus: [...statuses.filter(s => s.checked)],
        selectedDocumentType,
        selectedTransactionType,
        selectedPurpose,
        selectedDateType
      });
    }
  };
  const handleDate = (id, newDate) => {
    setCleared(false);
    const errorText = valiDate(id, newDate, fDate, sDate);
    if (!errorText) {
      if (id === 'fromDate') {
        setFromDate(newDate);
      } else {
        setToDate(newDate);
      }
      setError('');
    } else {
      setError(errorText);
    }
  };
  const handleSelectedDateTypeChange = event => {
    setSelectedDateType(event.target.value);
  };
  const today = new Date();
  const status = <Trans>Status</Trans>;
  return (
    <Box px={12} py={8}>
      <Grid container spacing={10} direction="row" className={classes.datePickerRoot}>
        <Grid item xs={12}>
          <DatePickerComponent
            label={<Trans>From</Trans>}
            id="fromDate"
            value={fDate}
            maxDate={today}
            onChange={newDate => {
              handleDate('fromDate', newDate);
            }}
            dateFormat={constants.dateFormat.dob}
          />
        </Grid>
        <Grid item xs={12}>
          <DatePickerComponent
            label={<Trans>To</Trans>}
            id="toDate"
            value={sDate}
            minDate={fDate}
            // maxDate={today}

            maxDate={dayjs(fDate).add(60, 'days')}
            // disabled={true}
            onChange={newDate => {
              handleDate('toDate', getFormattedDate(newDate, setCurrentDate));
            }}
            dateFormat={constants.dateFormat.dob}
          />
        </Grid>
        {error && <Typography className={classes.error}>{error}</Typography>}
      </Grid>
      {isDateTypeSelection ? (
        <Grid container>
          <FormControl component="fieldset">
            <RadioGroup row value={selectedDateType} onChange={handleSelectedDateTypeChange}>
              <FormControlLabel value="0" control={<Radio />} label={<Trans>Created Date</Trans>} />
              <FormControlLabel value="1" control={<Radio />} label={<Trans>Expiry Date</Trans>} />
            </RadioGroup>
          </FormControl>
        </Grid>
      ) : null}

      {isCheckbox ? (
        <Grid container>
          {checkboxes.map((check, index) => (
            <Grid item xs={4} key={index}>
              <Checkbox
                color="primary"
                checked={check.checked}
                value={check.checked}
                name="priorities"
                onChange={e => {
                  setCleared(false);
                  checkboxes[index].checked = e.target.checked;
                  setCheckBoxValue([...checkboxes]);
                }}
              />
              <Typography variant="body1" display="inline-block" className={classes.checkText}>
                {check.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container>
          <CustomSelect
            options={checkboxes}
            onChange={({ index }) => {
              setCleared(false);
              setCheckBoxValue([
                ...checkboxes.map((c, i) => {
                  c.checked = i === index;
                  return c;
                })
              ]);
            }}
            onInputChange={(e, value) => {
              setSearchText(value);
            }}
            value={searchText}
            isReadOnly={false}
            placeholder={requestType.props.id}
          />
        </Grid>
      )}
      {/* TransactionType Filter only for All Tab */}
      {isTransactionType && (
        <Grid container>
          <CustomSelect
            options={transactionValues}
            onChange={e => {
              setSelectedTransactionType(e);
            }}
            isReadOnly={false}
            placeholder={'Transaction Type'}
          />
        </Grid>
      )}
      {isDocumentPurposeList && (
        <Grid container>
          <CustomSelect
            options={documentPurposeList}
            onChange={e => {
              setSelectedPurpose(e);
            }}
            isReadOnly={false}
            placeholder={'Document Purpose'}
          />
        </Grid>
      )}
      {/* documentTypeList Filter only for Document Tab */}
      {isDocumentTypeList && (
        <Grid container>
          <CustomSelect
            options={documentTypeList}
            onChange={e => {
              setSelectedDocumentType(e);
            }}
            isReadOnly={false}
            placeholder={'Document Type'}
          />
        </Grid>
      )}

      {isInteractionTable &&
        (isStatusCheckBox ? (
          <Grid container>
            {statuses.map((check, index) => (
              <Grid item xs={4} key={index}>
                <Checkbox
                  color="primary"
                  checked={check.checked}
                  value={check.checked}
                  name="statusPriority"
                  onChange={e => {
                    setCleared(false);
                    statuses[index].checked = e.target.checked;
                    setStatus([...statuses]);
                  }}
                />
                <Typography variant="body1" display="inline-block" className={classes.checkText}>
                  {check.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box mt={5}>
            <Grid container>
              <CustomSelect
                options={statuses}
                onChange={({ index }) => {
                  setCleared(false);
                  setStatus([
                    ...statuses.map((c, i) => {
                      c.checked = i === index;
                      return c;
                    })
                  ]);
                }}
                onInputChange={(e, value) => {
                  setSearchStatus(value);
                }}
                value={searchStatus}
                isReadOnly={false}
                placeholder={status.props.id}
              />
            </Grid>
          </Box>
        ))}
      <Box mt={5}>
        <Grid container direction="row" justify="flex-end">
          <Grid item>
            <Button
              onClick={() => {
                const check = checkboxes.map(c => {
                  return {
                    ...c,
                    checked: false
                  };
                });
                const statusCheck = statuses.map(s => {
                  return { ...s, checked: false };
                });
                setFromDate(null);
                setToDate(null);
                setCheckBoxValue([...check]);
                setStatus([...statusCheck]);
                onCancelAction();
              }}
            >
              <Trans>Clear</Trans>
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" className="ml30" color="primary" onClick={onApplyAction}>
              <Trans>Apply</Trans>
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default withStyles(Styles)(FilterModal);
