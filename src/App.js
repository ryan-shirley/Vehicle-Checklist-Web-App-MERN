import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import './App.scss';

// Pages
import Home from './pages/Home'
import List from './pages/List'
import Coin from './pages/Coin'

// Components
import CryptoNav from './components/CryptoNav'

// Context
import { ThemeContext } from "./ThemeContext";

class App extends React.Component {
    constructor() {
        super()

        this.toggleTheme = () => {
            this.setState(state => ({
                style:
                    state.style === 'dark'
                        ? 'light'
                        : 'dark',
            }));
          };

        this.state = {
            style: 'dark',
            toggleTheme: this.toggleTheme
        }
    }

    render() {
        return (
            <ThemeContext.Provider value={this.state}>
                <ThemeContext.Consumer>
                    {({style, toggleTheme}) => (
                        <main className={"bg-danger pb-4 theme-" + style}>
                            <BrowserRouter>
                                <CryptoNav />
                                <div className={"bg-" + style  +" mx-4 mt-n3 position-relative py-5"} style={{zIndex:1}}>
                                    <div className="container">
                                        <Switch>
                                            <Route exact path="/" component={Home} />
                                            <Route path="/list" component={List} />
                                            <Route path="/coin/:slug" component={Coin} />
                                        </Switch>
                                    </div>
                                </div>
                            </BrowserRouter>
                        </main>
                    )}
                </ThemeContext.Consumer>
            </ThemeContext.Provider>
        );
    }
}

export default App;
