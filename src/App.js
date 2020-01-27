import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap'
import './App.scss';

// Pages
import Home from './pages/Home'

class App extends Component {
    render() {
        return (
            <main>
                <BrowserRouter>
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                        </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={Home} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </main>
        );
    }
}

export default App;
