import React from 'react';
import Login from './../LoginPage';
import Home from './../HomePage/Home'
import { Route, Switch, Redirect } from 'react-router-dom';
import LeftNav from '../LeftNav/LeftNav';


export default () => {
        return (
                <Switch>
                        <Route exact path="/">
                                <Redirect to="/login" />
                        </Route>
                        <Route path="/login" component={Login} />
                        <Route path="/home" component={Home} />
                </Switch>
        );
}