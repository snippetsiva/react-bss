import React, { useState, useEffect } from 'react';
import {
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Typography,
  ClickAwayListener,
  TextField
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Trans } from '@lingui/macro';
import DatePickerComponent from 'common/components/DatePicker/DatePickerComponent';
import constants from 'common/constants/constants';

const useStyles = makeStyles(theme => ({
  searchBar: {
    border: `${theme.spacing(0.2)} solid ${theme.palette.background.light}`,
    borderRadius: theme.spacing(5)
  },
  root: {
    position: 'relative'
  },
  paper: {
    padding: theme.spacing(4, 6),
    minWidth: 110,
    borderRadius: 16
  },
  dropdown: {
    position: 'absolute',
    zIndex: 10,
    right: 0,
    padding: theme.spacing(1),
    top: theme.spacing(14)
  },
  menuItem: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  searchContainer: {
    flex: 1
  },
  rootBar: {
    cursor: 'pointer',
    display: 'inline-flex',
    padding: theme.spacing(3)
  },
  searchBarTextField: {
    flex: 1,
    '& .MuiInputBase-root': {
      width: '100%'
    }
  },
  fullWidth: {
    width: '100%'
  }
}));

function SearchBarComponent({
  options,
  onSearch,
  filterApplied,
  placeholder = 'Search',
  noBorder = false,
  isDateRequired = false,
  dateName,
  isDropdownRequired = false,
  dropdownData = [],
  dropdownName
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [searchBy, setSearchBy] = useState('');
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date());
  const [dateField, setDateField] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('');
  const [dropdownField, setDropdownField] = useState(false);

  const handleClick = () => {
    setOpen(prev => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  useEffect(() => {
    setSearchBy('');
    setText('');
  }, [filterApplied]);

  const handleSelect = id => {
    if (isDateRequired && _.lowerCase(id) === _.lowerCase(dateName)) {
      setDropdownField(false);
      setDateField(true);
    } else if (isDropdownRequired && _.lowerCase(id) === _.lowerCase(dropdownName)) {
      setDateField(false);
      setDropdownField(true);
    } else {
      setDateField(false);
      setDropdownField(false);
    }
    setSearchBy(id);
    handleClickAway();
  };

  const onSearchAction = event => {
    event.preventDefault();
    if (isDateRequired && _.lowerCase(searchByName) === _.lowerCase(dateName)) {
      onSearch({
        value: date,
        type: searchBy
      });
    } else if (isDropdownRequired && _.lowerCase(searchByName) === _.lowerCase(dropdownName)) {
      onSearch({
        value: dropdownValue,
        type: searchBy
      });
    } else {
      onSearch({
        value: text,
        type: searchBy
      });
    }
  };

  const searchByName = searchBy ? options.filter(item => item.id === searchBy)[0].name : '';

  const handleKeypress = keyEvent => {
    //it triggers by pressing the enter key
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
      onSearchAction(keyEvent);
    }
  };

  return (
    <Grid container alignItems="center" className={`${!noBorder && classes.searchBar}`}>
      {options ? (
        <Grid item>
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className={classes.root}>
              <div className={classes.rootBar} type="button" onClick={handleClick}>
                <Typography variant="body1">{searchByName || <Trans>Search By</Trans>}</Typography>
                <ArrowDropDownIcon />
              </div>
              {open ? (
                <Grid item className={classes.dropdown}>
                  <Paper className={classes.paper}>
                    {options.map(item => (
                      <MenuItem
                        onClick={() => handleSelect(item.id)}
                        key={item.id}
                        selected={item.id === searchBy}
                        className={classes.menuItem}
                      >
                        <Typography variant="body1">{item.name}</Typography>
                      </MenuItem>
                    ))}
                  </Paper>
                </Grid>
              ) : null}
            </div>
          </ClickAwayListener>
        </Grid>
      ) : null}
      <Grid item className={classes.searchContainer}>
        <Grid container alignItems="center">
          <Grid item className={classes.searchBarTextField}>
            {dateField ? (
              <DatePickerComponent
                customClasses={classes.fullWidth}
                label={placeholder}
                id="date"
                labelVariant="caption"
                value={date}
                className={classes.fullWidth}
                onChange={e => setDate(e)}
                dateFormat={constants.dateFormat.dob}
                maxDate={new Date()}
              />
            ) : dropdownField ? (
              <TextField
                label="Select"
                fullWidth
                select
                inputProps={{
                  onChange: val => setDropdownValue(val.target.value)
                }}
              >
                {dropdownData &&
                  dropdownData.map(item => (
                    <MenuItem key={item.code} value={item.code}>
                      <Typography variant="body1">{_.get(item, 'name', '')}</Typography>
                    </MenuItem>
                  ))}
              </TextField>
            ) : (
              <TextField
                placeholder={placeholder}
                inputProps={{ 'aria-label': 'search bar' }}
                value={text}
                className={classes.fullWidth}
                onChange={e => {
                  setText(e.currentTarget.value);
                }}
                inputProps={{
                  onKeyDown: e => handleKeypress(e)
                }}
              />
            )}
          </Grid>
          <Grid item>
            <IconButton type="submit" aria-label="search" onClick={onSearchAction}>
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default SearchBarComponent;
