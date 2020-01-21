import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class CryptoInfo extends React.Component {
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
            name: this.props.coin.name,
            currency: currency,
            price: this.props.coin.quote[this.props.currency].price.toFixed(4),
            volume24hr: this.props.coin.quote[this.props.currency].volume_24h,
            change24h: this.props.coin.quote[this.props.currency].percent_change_24h.toFixed(2),
            change7day: this.props.coin.quote[this.props.currency].percent_change_7d.toFixed(2),
            slug: this.props.coin.slug
        }

        this.sendToCrypto = this.sendToCrypto.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.setState({
                currency: nextProps.currency,
                price: nextProps.coin.quote[nextProps.currency].price.toFixed(4),
                volume24hr: nextProps.coin.quote[nextProps.currency].volume_24h,
            });
        }
    }

    sendToCrypto = () => {
        this.props.history.push("/coin/" + this.state.slug, this.props.coin);
    }

    formatNumber(num) {
        return parseFloat(num).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    render() {
        return (
            <tr onClick={this.sendToCrypto}>
                <th scope="row"><img src="#" alt="" className="rounded-circle float-left" /> {this.state.name}</th>
                <td><span className="currency">{this.state.currency}</span>{this.state.price}</td>
                <td><span className={"badge badge-pill " + (this.state.change24h > 0 ? 'badge-success' : 'badge-danger')}>{this.state.change24h}</span></td>
                <td><span className={"badge badge-pill " + (this.state.change7day > 0 ? 'badge-success' : 'badge-danger')}>{this.state.change7day}</span></td>
                <td><span className="currency">{this.state.currency}</span>{this.formatNumber(this.state.volume24hr)}</td>
            </tr>
        )
    }
}

CryptoInfo.propTypes = {
    coin: PropTypes.object.isRequired,
    currency: PropTypes.string.isRequired
}      

export default withRouter(CryptoInfo)