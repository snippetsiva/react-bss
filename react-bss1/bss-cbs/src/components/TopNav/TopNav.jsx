import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={event => {
        event.preventDefault();
        console.log('sdfsdfsdfsdf', props);
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

const mainNav = ['Customer Care', 'Resources', 'Billing', 'collections', 'Mentenance', 'Setup', 'Sales', 'Reports'];

export default function NavTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="nav tabs example" textColor="inherit">
        {/* <LinkTab label="Customer Care" href="/drafts" />
        <LinkTab label="Resources" href="/trash" />
        <LinkTab label="Billing" href="/spam" />
        <LinkTab label="Collections" href="/spam" />
        <LinkTab label="Mentenance" href="/spam" />
        <LinkTab label="Setup" href="/spam" />
        <LinkTab label="Sales" href="/spam" />
        <LinkTab label="Reports" href="/spam" /> */}

        {mainNav.map(item => (
          <LinkTab key={item} label={item} href="/trash" />
        ))}
      </Tabs>
    </div>
  );
}
