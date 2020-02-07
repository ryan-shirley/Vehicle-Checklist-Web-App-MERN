import React, { Component } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
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

/**
 * App() Main component used for routing and general layout
 */
class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: localStorage.getItem('UID') ? true : false
        }

        // Binding this to work in the callback
        this.updateLoggedInStatus = this.updateLoggedInStatus.bind(this)
    }

    /**
     * updateLoggedInStatus() Update logged in status
     */
    updateLoggedInStatus(newStatus) {
        this.setState({
            loggedIn: newStatus
        })
    }

    render() {
        return (
            <main>
                <BrowserRouter>
                    <HGVNavbar loggedIn={this.state.loggedIn} onLogout={this.updateLoggedInStatus} />
                    <Switch>
                        <RestricedRoute path="/" exact component={Login} onLogin={this.updateLoggedInStatus} />
                        <RestricedRoute path="/register" exact component={Register} onLogin={this.updateLoggedInStatus} />
                        <PrivateRoute path="/records/create" exact component={Create} />
                        <PrivateRoute path="/records/:recordId/edit" exact component={Edit} />
                        <PrivateRoute path="/records" component={Home} />
                    </Switch>
                </BrowserRouter>
            </main>
        );
    }
}

export default App;
