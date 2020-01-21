import React from 'react';
import {Link} from 'react-router-dom';

// Theme Context
import { ThemeContext } from "../ThemeContext";

class CryptoNav extends React.Component {
    static contextType = ThemeContext;

    render() {
        const themeStyle = this.context.style;

        return (
            <nav className={"navbar navbar-expand-lg pb-4 " + (themeStyle === 'dark' ? 'bg-light' : themeStyle === 'light' ? 'bg-dark' : '')}>
                <Link to='/' className="navbar-brand text-danger text-uppercase font-weight-bolder" style={{margin: '0 auto'}}>Crypto<span className="ml-1 font-weight-lighter" style={{fontSize: '12px'}}>King.</span></Link>
                <ThemeContext.Consumer>
                    {({style, toggleTheme}) => (
                        <div className="custom-control custom-switch text-center position-absolute" style={{left: '1.5rem'}}>
                            <input type="checkbox" className="custom-control-input" id="toggleTheme" onChange={toggleTheme} />
                            <label className="custom-control-label text-capitalize" htmlFor="toggleTheme">{style} mode</label>
                        </div>
                    )}
                </ThemeContext.Consumer>
            </nav>
        )
    }
}

export default CryptoNav