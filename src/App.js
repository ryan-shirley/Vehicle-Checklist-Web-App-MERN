import React, { Component } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import RestricedRoute from './components/RestricedRoute'
import { Container } from "react-bootstrap"
import './App.scss'

// Pages
import Login from './pages/Login'
import Home from './pages/Home'
import Create from './pages/records/Create'

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
                    <Container fluid={true}>
                        <Switch>
                            <RestricedRoute path="/" exact component={Login} onLogin={this.updateLoggedInStatus} />
                            <PrivateRoute path="/records/create" exact component={Create} />
                            <PrivateRoute path="/records" component={Home} />
                        </Switch>
                    </Container>
                </BrowserRouter>
            </main>
        );
    }
}

export default App;
