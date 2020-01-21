import React from 'react';
import PropTypes from 'prop-types';

// Theme Context
import { ThemeContext } from "../ThemeContext";

// Components
import Button from './Button'

class CryptoCard extends React.Component {
    constructor(props) {
        super(props)

        let currency = this.props.currency
        if(currency === 'EUR') {
            currency = '€'
        }
        else if (currency === 'USD') {
            currency = '$'
        }
        else if (currency === 'GPB') {
            currency = '£'
        }

        this.state = {
            name: this.props.coin.name + ' (' + this.props.coin.symbol + ')',
            currency: currency,
            price: this.props.coin.quote[this.props.currency].price.toFixed(2),
            description: this.props.coin.metadata.description,
            logo: this.props.coin.metadata.logo,
            link: "coin/" + this.props.coin.slug
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.setState({
                currency: nextProps.currency,
                price: nextProps.coin.quote[nextProps.currency].price.toFixed(2)
            });
        }
    }

    static contextType = ThemeContext;

    render() {
        const themeStyle = this.context.style;

        return (
            <div className={"card crypto-card mb-4 " + themeStyle}>
                <div className="card-body">
                    <div className="row align-items-end">
                        <div className="col">
                            <h4 className="card-title mb-0 mt-3">{this.state.name}</h4>
                        </div>
                        <div className="col">
                            <p className="price text-right mb-0"><span className="currency">{this.state.currency}</span>{this.state.price}</p>
                        </div>
                    </div>

                    <p className="card-text">{this.state.description.substring(0, 170)}...</p>
                </div>
                <div className="card-footer">
                    <img src={this.state.logo} alt={this.state.name} className="rounded-circle float-left mt-1" width="25" />
                    <p className="float-left ml-3 mb-0 mt-1">Read more about {this.state.name}</p>
                    <Button
                        text='More info'
                        state={this.props.coin}
                        link={this.state.link}
                        style='dark'
                        classes='btn-sm float-right text-uppercase'
                    />
                </div>
            </div>
        )
    }
}

CryptoCard.propTypes = {
    coin: PropTypes.object.isRequired
}      

export default CryptoCard