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
import SweetAlert from 'react-bootstrap-sweetalert'

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
                <BrowserRouter>
                    <HGVNavbar loggedIn={this.state.loggedIn} onLogout={this.updateLoggedInStatus} />
                    {this.state.notification}
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
