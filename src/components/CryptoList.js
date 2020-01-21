import React from 'react';
import PropTypes from 'prop-types';
import CryptoInfo from '../components/CryptoInfo'
import CryptoCard from '../components/CryptoCard'

// Theme Context
import { ThemeContext } from "../ThemeContext";

class CryptoList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            coins: [],
            currency: 'EUR',
            display: this.props.display,
            amount: this.props.amount
        }

        // Binding this to work in the callback
        this.currencyChange = this.currencyChange.bind(this)
        this.fetchLatest = this.fetchLatest.bind(this)
    }

    componentDidMount() {
        if(this.state.display === 'table') {
            this.fetchLatest()
            .then((data) => {
                this.setState({ 
                    coins: data.coins
                })
            })
        }
        else if (this.state.display === 'card') {
            this.fetchLatest()
            .then((data) => {
                this.fetchMetaData(data.coins)
                .then((coins) => {
                    this.setState({ 
                        coins: coins
                    })
                })
            })
        }
    }

    currencyChange(event) {
        const newCurrency = event.target.value

        if(this.state.display === 'table') {
            this.fetchLatest(newCurrency)
                .then((data) => {
                    this.setState({ 
                        coins: data.coins,
                        currency: data.currency
                    })
                })
        }
        else if (this.state.display === 'card') {
            this.fetchLatest(newCurrency)
            .then((data) => {
                this.fetchMetaData(data.coins)
                .then((coins) => {
                    this.setState({ 
                        coins: coins,
                        currency: data.currency
                    })
                })
            })
        }
    }

    fetchLatest(newCurrency) {
        const state = this.state

        return new Promise(function(resolve, reject) {

            const currency = newCurrency || state.currency

            // Blocked by CORS - Uses Moesif CORS chrome extension to bypass.
            fetch(process.env.REACT_APP_COIN_MARKET_MAP_API_URI + 'cryptocurrency/listings/latest?start=1&limit='+ state.amount +'&convert=' + currency, { 
                method: 'GET', 
                headers: new Headers({
                'X-CMC_PRO_API_KEY': process.env.REACT_APP_COIN_MARKET_MAP_API_KEY
                })
            })
            .then(res => res.json()) // Parse output to json
            .then((data) => {
                resolve({
                    coins: data.data,
                    currency: currency
                })
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    fetchMetaData(data) {
        return new Promise(function(resolve, reject) {
            let topCoins = data

            // Get Top 4 coins Metadata
            fetch(process.env.REACT_APP_COIN_MARKET_MAP_API_URI + `cryptocurrency/info?id=${topCoins[0].id},${topCoins[1].id},${topCoins[2].id},${topCoins[3].id}`, { 
                method: 'GET', 
                headers: new Headers({
                'X-CMC_PRO_API_KEY': process.env.REACT_APP_COIN_MARKET_MAP_API_KEY
                })
            })
            .then(resp => resp.json()) // Parse output to json
            .then((metadata) => {
                metadata = metadata.data
                // Add metadata to price
                const top4coins = topCoins.map((coin) => {
                    coin.metadata = metadata[coin.id]
                    return coin;
                })

                resolve(top4coins)
            })
            .catch((err) => {
                reject('API call error: ', err.message)
            });
        })
    }

    static contextType = ThemeContext;

    render() {
        const currencyChanger = (
            <form>
                <div className="form-group">
                    <label htmlFor="currency">Currency</label>
                    <select className="form-control ml-2" id="currency" onChange={this.currencyChange}>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                    </select>
                </div>
            </form>
        )
        if(this.state.display === 'table') {
            const themeStyle = this.context.style;

            return (
                <>
                    {currencyChanger}
                    
                    <table className={"table table-"+ themeStyle + " table-hover table-striped"}>
                        <thead className="bg-warning">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">24h Change</th>
                                <th scope="col">7day Change</th>
                                <th scope="col">24h Volume</th>
                            </tr>
                        </thead>
                        <tbody>

                        {this.state.coins.map((coin) => (
                            <CryptoInfo
                            key={coin.slug}
                            coin={coin}
                            currency={this.state.currency} />
                        ))}
                        </tbody>
                    </table>
                </>
            )
        }
        else if(this.state.display === 'card') {
            return (
                <>
                    {currencyChanger}
                    
                    <div className="row">
                        {this.state.coins.map((coin) => (
                            <div className="col-md-6" key={coin.id}>
                                <CryptoCard 
                                    coin={coin}
                                    currency={this.state.currency} />
                            </div>
                        ))}
                    </div>
                </>
            )
        }
    }
}

CryptoList.propTypes = {
    display: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired
}     


export default CryptoList