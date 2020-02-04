import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container } from "react-bootstrap"
import './App.scss';

// Pages
import Login from './pages/Login'
import Home from './pages/Home'

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
                            <Route exact path="/" component={Login} />
                            <Route path="/home" component={Home} />
                        </Switch>
                    </Container>
                </BrowserRouter>
            </main>
        );
    }
}

export default App;
