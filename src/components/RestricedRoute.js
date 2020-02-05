import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * RestricedRoute() Restriced routes (logged in but redirect from this page)
 */
const RestricedRoute = ({component: Component, ...rest}) => {
    return (
        <Route
          {...rest}
          render={(props) => !localStorage.getItem("jwtToken")
            ? <Component {...props} />
            : <Redirect to={{pathname: '/records', state: {from: props.location}}} />}
        />
      )
}

export default RestricedRoute