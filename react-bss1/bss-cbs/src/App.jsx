import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import config from 'config';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import _ from 'lodash';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme, { defaultThemeColor } from '../public/theme/muiTheme';

import Routes from './components/Routes/Routes'
import { MenuList } from '@material-ui/core';
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter basename={config.basePath}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <MuiThemeProvider theme={theme}>
              <Routes/>
            </MuiThemeProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
