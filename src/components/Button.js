import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class Button extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            text: this.props.text,
            state: this.props.state,
            link: this.props.link,
            style: this.props.style,
            classes: this.props.classes
        }
    }

    render() {
        if(this.state.state) {
            return (
                <Link to={{
                    pathname: this.state.link,
                    state: this.props.state
                }} className={"btn btn-" + this.state.style + (this.state.classes ?  " " + this.state.classes : '')} role="button" aria-disabled="true">{this.state.text}</Link>
            )
        }
        else {
            return <Link to={this.state.link} className={"btn btn-" + this.state.style + (this.state.classes ?  " " + this.state.classes : '')} role="button" aria-disabled="true">{this.state.text}</Link>
        }
    }
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    state: PropTypes.object,
    link: PropTypes.string.isRequired,
    style: PropTypes.string.isRequired,
    classes: PropTypes.string
}      

export default Button