import React, { Fragment } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnKey from '@material-ui/icons/VpnKey';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import MuiAlert from '@material-ui/lab/Alert';

import _ from 'lodash';
import * as Yup from 'yup';
import config from 'config';
import appRoutes from 'common/constants/appRoutes';
import { Trans } from '@lingui/macro';
import AppLoader from 'components/AppLoader/AppLoader';
import { Formik, Form, Field } from 'formik';
import FormikTextField from 'components/Common/FormikTextField';
// import jwt from 'jsonwebtoken';
const defaultThemeName = _.get(config, 'dev.uiConfig.defaultThemecolor', 'azureBlue');

const validationSchema = Yup.object().shape({
  username: Yup.string().required('User name is required'),
  // .min(8, 'User name length should be minimum 8')
  // .max(10, 'User name length should be maximum 10'),
  // company: Yup.string().required('Company name is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password length should be minimum 8')
});
const styles = theme => ({
  loader: {
    position: 'absolute',
    height: '100vh'
  },
  textWhite: {
    color: '#fff !important'
  },
  textYellow: {
    color: theme.palette.primary.active
  },
  center: {
    textAlign: 'center'
  },
  loginContainer: {
    height: '100vh',
    color: theme.palette.text.darkBlack,
    background:
      defaultThemeName === 'azureBlue'
        ? 'url(./assets/images/login-banner.png) 50% center / cover no-repeat fixed'
        : 'url(./assets/images/lauch_bg.png) 50% center / cover no-repeat fixed'
  },
  loginPanel: {
    backgroundColor: theme.palette.background.opacityBlack,
    borderRadius: 0,
    height: '100%',
    textAlign: 'center'
  },
  logo: {
    width: '60%',
    height: 'auto',
    marginBottom: '10px'
  },
  leftPanel: {
    margin: '30% 30%'
  },
  loginButton: {
    background: theme.palette.primary.active,
    color: defaultThemeName === 'azureBlue' ? `${theme.palette.text.white} !important` : theme.palette.text.black,
    padding: '5px 30px',
    borderRadius: 15,
    '&:hover': {
      background: theme.palette.text.white,
      color: `${theme.palette.primary.inActive} !important`
    }
  },
  registerBtn: {
    color: theme.palette.primary.white,
    borderColor: theme.palette.primary.active,
    padding: '5px 30px',
    borderRadius: 15
  },
  backBtn: {
    color: theme.palette.primary.white,
    borderColor: theme.palette.primary.active,
    borderRadius: 20,
    marginRight: 10
  },
  whiteText: {
    color: theme.palette.primary.white
  },
  enrollFormContrl: {
    '& .MuiInput-underline:before': {
      borderBottom: `1px solid ${theme.palette.primary.white}`
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: '2px solid #fffffa'
    },
    '& .MuiInput-underline.Mui-error:after': {
      borderBottomColor: '#FF99BC'
    },
    '& .MuiInputBase-input': {
      color: 'white'
    },
    '& .MuiFormLabel-root': {
      color: theme.palette.primary.white,
      fontSize: '14px',
      fontWeight: 'normal'
    }
  },
  alignTextStart: {
    display: 'flex',
    justifyContent: 'flex-start'
  }
});
class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      showLoader: false,
      isLogin: true,
      successBlk: false,
      snackMessage: '',
      isSnackMsgReceived: true,
      showPassword: false,
      errMsg: '',
      usernameErr: '',
      selectedUsername: ''
    };
    this.passwordInputRef = React.createRef();
  }

  onSubmit = async (user, { setSubmitting }) => {
    // this.setState({ showLoader: true });
    this.props.history.push(`${appRoutes.home.baseurl}`);
    setSubmitting(false);
  };
  handleClickShowPassword = value => {
    this.setState({
      [value]: !this.state[value]
    });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ successBlk: false, isSnackMsgReceived: false });
    // this.props.history.replace('', null);
  };

  render() {
    const { classes } = this.props;
    const {
      isLogin,
      isForgotPassword,
      successBlk,
      snackMessage,
      showPassword,
      isSnackMsgReceived,
      errMsg,
      usernameErr,
      companies,
      selectedUsername,
      showCompanies,
    } = this.state;
    let intitialUsername = selectedUsername;
    const defaultThemeName = _.get(config, 'dev.uiConfig.defaultThemecolor', 'azureBlue');
    const mql = window.matchMedia('(max-width: 700px)');
    let mobileView = mql.matches;
    return (
      <Grid container className={classes.loginContainer}>
        {!mobileView && (
          <Grid item xs={8}>
            {/* {defaultThemeName === 'azureBlue' && ( */}
              <Grid item className={classes.leftPanel} align="center">
                <Typography variant="h1">
                  <Trans>BSS-CBS</Trans>
                </Typography>
                <Typography variant="body2">
                  <Trans>Your Digital Lifestyle Partner</Trans>
                </Typography>
              </Grid>
            {/* )} */}
          </Grid>
        )}
        <Grid item xs={mobileView ? 12 : 4}>
          <Paper className={classes.loginPanel}>
            <Grid container spacing={4} direction="column">
              <Grid item xs={12} align="center">
                <Avatar
                  className={classes.logo}
                  variant="square"
                  alt="MTN Logo"
                  src={`./assets/images/${defaultThemeName === 'azureBlue' ? 'logo-bmobile.png' : 'ttlogo.png'}`}
                />
              </Grid>
              <Fragment>
                <Grid item xs={12}>
                  <Typography variant="h4" className={classes.textWhite}>
                    <Trans>Login to BMobile BSS Switch</Trans>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography className={classes.textWhite}>
                    <Trans>
                      Convergent Billing System
                      </Trans>
                  </Typography>
                </Grid>
                <Formik
                  initialValues={{ username: intitialUsername, password: '' }}
                  validationSchema={validationSchema}
                  enableReinitialize={true}
                  onSubmit={this.onSubmit}
                >
                  {({ submitForm, isValid }) => (
                    <Form>
                      <Grid item xs={12} className={classes.enrollFormContrl} align="center">
                        <Box maxWidth="75%" p={2}>
                          <Field
                            component={FormikTextField}
                            fullWidth
                            data-cy="userName"
                            id="userName"
                            placeholder="Enter Username"
                            title="Enter Username"
                            type="text"
                            name="username"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AccountCircle className={classes.whiteText} />
                                </InputAdornment>
                              )
                            }}
                            autoComplete="off"
                          />
                        </Box>
                        <Box>
                          <Typography color="error" variant="caption">
                            {usernameErr}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} className={classes.enrollFormContrl} align="center">
                        <Box maxWidth="75%" p={2}>
                          <Field
                            component={FormikTextField}
                            id="password"
                            data-cy="password"
                            placeholder="Enter Password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            fullWidth
                            autoComplete="off"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <VpnKey className={classes.whiteText} />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => this.handleClickShowPassword('showPassword')}
                                  >
                                    {showPassword ? (
                                      <Visibility
                                        className={
                                          defaultThemeName !== 'mtnYellow' ? classes.textWhite : classes.textYellow
                                        }
                                      />
                                    ) : (
                                      <VisibilityOff
                                        className={
                                          defaultThemeName !== 'mtnYellow' ? classes.textWhite : classes.textYellow
                                        }
                                      />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            inputProps={{
                              ref: this.passwordInputRef,
                              onKeyDown: e => {
                                if ((e.charCode || e.keyCode) === 13) {
                                  e.preventDefault();
                                  submitForm(this.onSubmit);
                                }
                              }
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography color="error" variant="caption">
                            {errMsg}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} align="center">
                        <Box maxWidth="75%" m={4}>
                          <Button
                            variant="outlined"
                            // disabled={!isValid}
                            className={classes.loginButton}
                            onClick={submitForm}
                          >
                            <Trans>Sign-in</Trans>
                          </Button>
                        </Box>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Fragment>
            </Grid>
            <Snackbar
              open={successBlk}
              autoHideDuration={6000}
              onClose={this.handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <MuiAlert elevation={6} variant="filled" onClose={this.handleClose} severity="success">
                {snackMessage}
              </MuiAlert>
            </Snackbar>
          </Paper>
        </Grid>

        

        {this.state.showLoader ? (
          <Grid container className={classes.loader}>
            <Grid item xs={12}>
              <AppLoader />
            </Grid>
          </Grid>
        ) : null}

        {this.props.location.state ? (
          <Snackbar
            open={this.props.location.state.msg && isSnackMsgReceived}
            autoHideDuration={6000}
            onClose={this.handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={this.handleClose}
              severity={this.props.location.state.type}
            >
              {this.props.location.state.msg}
            </MuiAlert>
          </Snackbar>
        ) : null}
      </Grid>
    );
  }
}
export default withStyles(styles)(LoginPage);
