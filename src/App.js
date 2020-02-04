import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.scss';

// Pages
import Login from './pages/Login'

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
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={Login} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </main>
        );
    }
}

export default App;
