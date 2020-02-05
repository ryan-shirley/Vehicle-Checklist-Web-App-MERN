import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * PrivateRoute() All private routes
 */
const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route
          {...rest}
          render={(props) => localStorage.getItem("jwtToken")
            ? <Component {...props} />
            : <Redirect to={{pathname: '/', state: {from: props.location}, redirect_message: 'You are not authorised to access that! Please login first.'}} />}
        />
      )
}

export default PrivateRoute