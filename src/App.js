import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"
import { createBrowserHistory } from "history"
import { Component } from "react"
import { matchPath, Router, Switch } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute"
import RestricedRoute from "./components/RestricedRoute"
import "./App.scss"

import SweetAlert from "react-bootstrap-sweetalert"
import ErrorBoundary from "./components/ErrorBoundary"
// Components
import HeaderRouter from "./components/HeaderRouter"
import { APP_ROUTES, STORAGE_KEYS } from "./constants"
import Checklists from "./pages/Checklists"
import Home from "./pages/Home"
// Pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import Create from "./pages/records/Create"
import Edit from "./pages/records/Edit"
import Show from "./pages/records/Show"
import Settings from "./pages/Settings"

// Init Sentry Monitoring
const routes = [
    { path: "/records/:recordId" },
    { path: "/records/:recordId/edit" },
    { path: "/records" },
    { path: "/records/create" },
    { path: "/checklists" },
    { path: "/settings" },
    { path: "/register" },
    { path: "/" }
]
const history = createBrowserHistory()
Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    autoSessionTracking: true,
    integrations: [
        new Integrations.BrowserTracing({
            // Can also use reactRouterV4Instrumentation
            routingInstrumentation: Sentry.reactRouterV5Instrumentation(history, routes, matchPath)
        })
    ],
    environment: process.env.NODE_ENV,

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
})

/**
 * App() Main component used for routing and general layout
 */
class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: !!localStorage.getItem(STORAGE_KEYS.UID),
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

        const message = newStatus ? "Successfully logged in!" : "Successfully logged out!"
        this.successNotification(message)
    }

    /**
     * successNotification() Create a successful notification
     */
    successNotification(title) {
        this.createNotification("success", title)
    }

    /**
     * createNotification() Hide alert from screen
     */
    createNotification(_type = "success", title, duration = 2000) {
        const notification = (
            <SweetAlert
                success
                title={title}
                showConfirm={false}
                onConfirm={() => this.hideNotification()}
                timeout={duration}
            />
        )

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
            <ErrorBoundary>
                <main>
                    <Router history={history}>
                        <HeaderRouter loggedIn={this.state.loggedIn} onLogout={this.updateLoggedInStatus} />
                        {this.state.notification}
                        <Switch>
                            <RestricedRoute path="/" exact component={Login} onLogin={this.updateLoggedInStatus} />
                            <RestricedRoute
                                path="/register"
                                exact
                                component={Register}
                                onLogin={this.updateLoggedInStatus}
                            />
                            <PrivateRoute
                                path="/records/create"
                                exact
                                component={Create}
                                onCreate={this.successNotification}
                            />
                            <PrivateRoute
                                path="/records/:recordId/edit"
                                exact
                                component={Edit}
                                onEdit={this.successNotification}
                            />
                            <PrivateRoute
                                path="/records/:recordId"
                                exact
                                component={Show}
                                onDelete={this.successNotification}
                            />
                            <PrivateRoute path="/records" component={Home} onDelete={this.successNotification} />
                            <PrivateRoute
                                path={APP_ROUTES.SETTINGS}
                                exact
                                component={Settings}
                                onUpdate={this.successNotification}
                            />
                            <PrivateRoute
                                path={APP_ROUTES.CHECKLISTS}
                                exact
                                component={Checklists}
                                onUpdate={this.successNotification}
                            />
                        </Switch>
                    </Router>
                </main>
            </ErrorBoundary>
        )
    }
}

export default App
