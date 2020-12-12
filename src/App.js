import React, { Component } from 'react'
import { Router, Switch, matchPath } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import PrivateRoute from './components/PrivateRoute'
import RestricedRoute from './components/RestricedRoute'
import './App.scss'


// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Create from './pages/records/Create'
import Edit from './pages/records/Edit'

// Components
import HGVNavbar from './components/hgv-navbar'
import SweetAlert from 'react-bootstrap-sweetalert'

// Init Sentry Monitoring
const routes = [{ path: '/records/:recordId' }, { path: '/records/:recordId/edit' }, { path: '/records' }, { path: '/records/create' }, { path: '/register'
 }, { path: '/' }];
const history = createBrowserHistory();
Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    autoSessionTracking: true,
    integrations: [
        new Integrations.BrowserTracing({
          // Can also use reactRouterV4Instrumentation
          routingInstrumentation: Sentry.reactRouterV5Instrumentation(history, routes, matchPath),
        })
    ],
    environment: process.env.NODE_ENV,
  
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});

/**
 * App() Main component used for routing and general layout
 */
class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: localStorage.getItem('UID') ? true : false,
            notification: null
        }

        // Binding this to work in the callback
        this.updateLoggedInStatus = this.updateLoggedInStatus.bind(this)
        this.successNotification = this.successNotification.bind(this)
        this.createNotification = this.createNotification.bind(this)
    }

    /**
     * updateLoggedInStatus() Update logged in status
     */
    updateLoggedInStatus(newStatus) {
        this.setState({
            loggedIn: newStatus
        })

        let message = newStatus ? "Successfully logged in!" : "Successfully logged out!"
        this.successNotification(message)
    }
    
    /**
     * successNotification() Create a successful notification
     */
    successNotification(title) {
        this.createNotification('success', title)
    }

    /**
     * createNotification() Hide alert from screen
     */
    createNotification(type = 'success', title, duration = 2000) {
        let notification = <SweetAlert 
            success 
            title={title}
            showConfirm={false}
            onConfirm={() => this.hideNotification()}
            timeout={duration}
        />

        this.setState({
            notification
        })
    }
    
    /**
     * hideNotification() Hide notification from screen
     */
    hideNotification() {
        this.setState({
            notification: null
        })
    }

    render() {
        return (
            <main>
                <Router history={history}>
                    <HGVNavbar loggedIn={this.state.loggedIn} onLogout={this.updateLoggedInStatus} />
                    {this.state.notification}
                    <Switch>
                        <RestricedRoute path="/" exact component={Login} onLogin={this.updateLoggedInStatus} />
                        <RestricedRoute path="/register" exact component={Register} onLogin={this.updateLoggedInStatus} />
                        <PrivateRoute path="/records/create" exact component={Create} onCreate={this.successNotification} />
                        <PrivateRoute path="/records/:recordId/edit" exact component={Edit} onEdit={this.successNotification} />
                        <PrivateRoute path="/records" component={Home} onDelete={this.successNotification} />
                    </Switch>
                </Router>
            </main>
        );
    }
}

export default App;
