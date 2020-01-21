import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import './App.scss';

// Pages
import Home from './pages/Home'

class App extends Component {
    render() {
        return (
            <main>
                <BrowserRouter>
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
