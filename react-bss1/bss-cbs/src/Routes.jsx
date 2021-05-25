import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import appRoutes from 'common/constants/appRoutes';
import OrgHomePage from 'components/OrgHomePage';
import IndHomePage from 'components/IndHomePage';
import LoginPage from 'components/LoginPage';
import FirstPage from 'components/FirstPage';
import HomePage from 'components/HomePage';
import RegistrationWizard from 'components/FirstPage/Component/RegistrationWizard/RegistrationWizard';
// import OfferView from 'srq/views/OfferView';
// import CorporateRegistrationView from 'srq/views/CorporateRegistrationView';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/">
          <Redirect to={"/login"} />
        </Route>
        <Route path={appRoutes.home.onboardingUrl} component={FirstPage} />
        <Route path={appRoutes.home.SELF_REGISTRATION.registrationBaseUrl} component={RegistrationWizard} />
        <Route path="/login" component={LoginPage} />
        <Route path={appRoutes.home.baseurl} component={HomePage} />
        <Route path={appRoutes.home.indUrl} component={IndHomePage} />
        <Route path={appRoutes.home.orgUrl} component={OrgHomePage} />
      </Switch>
    );
  }
}

export default Routes;
