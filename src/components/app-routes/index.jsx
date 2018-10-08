import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { get } from 'lodash';

import UnauthorizedPage from '../unauthorized-page';
import NotFoundPage from '../not-found-page';


const AppRoutes = ({ routes, permissions, onLogin, onLogout }) => {
  const getComponent = (route) => {
    let component = get(route, 'props.component');

    if (component && !permissions.includes(route.name)) {
      component = UnauthorizedPage
    }

    if (!component) {
      return NotFoundPage;
    }

    if (route.name === 'login') {
      return ({ history }) => component({
        onSuccess: () => {
          onLogin();
          history.replace('/');
        }
      });
    } else if (route.name === 'logout') {
      return ({ history }) => component({
        onSuccess: () => {
          onLogout();
          history.replace('/');
        },
        onCancel: () => {
          history.goBack();
        }
      });
    }

    return component;
  };

  return (
    <Switch>
      {routes.map((route, key) => (
        <Route
          key={ key }
          { ...route.props }
          path={ route.path }
          component={ getComponent(route) }
        />
      ))}
      <Route component={ NotFoundPage }/>
    </Switch>
  );
};

export default AppRoutes;
