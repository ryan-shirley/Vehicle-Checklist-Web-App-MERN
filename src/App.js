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
    render() {
        return (
            <main>
                <BrowserRouter>
                    <HGVNavbar />
                    <Container fluid={true}>
                        <Switch>
                            <RestricedRoute path="/" exact component={Login} />
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
