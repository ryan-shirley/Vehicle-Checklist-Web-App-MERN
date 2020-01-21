import React from 'react';
import PropTypes from 'prop-types';

// Theme Context
import { ThemeContext } from "../ThemeContext";

class Coin extends React.Component {
    constructor(props) {
        super(props)

        const metadata = this.props.location.state.metadata
        delete this.props.location.state.metadata
        const latestMarketData = this.props.location.state

        // Remove Empty Url's
        if(metadata) {
            let urls = this.cleanUrls(metadata.urls)
            metadata.urls = urls
        }

        this.state = {
            latestMarketData: latestMarketData,
            metadata: metadata
        }
    }
    
    componentDidMount() {
        if(this.state.metadata === undefined) {
            // Get Metadata
            fetch(process.env.REACT_APP_COIN_MARKET_MAP_API_URI + `cryptocurrency/info?id=${this.state.latestMarketData.id}`, { 
                method: 'GET', 
                headers: new Headers({
                'X-CMC_PRO_API_KEY': process.env.REACT_APP_COIN_MARKET_MAP_API_KEY
                })
            })
            .then(resp => resp.json()) // Parse output to json
            .then((metadata) => {
                let data = metadata.data[this.state.latestMarketData.id]
                let urls = this.cleanUrls(data.urls)
                data.urls = urls

                this.setState({ metadata: data })
            })
            .catch((err) => {
                console.log('API call error:', err.message);
            });
        }
    }

    cleanUrls(urls) {
        const listUrls = []
        Object.keys(urls).forEach(key => {
            if(urls[key].length !== 0) {
                listUrls.push({
                    link: urls[key][0],
                    name: key.split('_').join(' ')
                })
            }
        });
        
        return listUrls;
    }

    static contextType = ThemeContext;

    render() {
        const themeStyle = this.context.style;

        if(this.state.metadata) {
            return (
                <div className="row">
                    <div className="col-12 text-center mb-3">
                        <h1>Coin Overview</h1>
                    </div>
                    <div className="col-md-6">
                        <div className={"card mb-4 " + themeStyle}>
                            <div className="card-body">
                                <p className=" card-title text-muted text-capitalize">Name</p>
                                <h4>{this.state.latestMarketData.name + ' (' + this.state.latestMarketData.symbol + ')'}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className={"card mb-4 " + themeStyle}>
                            <div className="card-body">
                                <p className=" card-title text-muted text-capitalize">Logo</p>
                                <img src={this.state.metadata.logo} alt={this.state.name} className="rounded-circle mt-1" width="32" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className={"card mb-4 " + themeStyle}>
                            <div className="card-body">
                                <p className=" card-title text-muted text-capitalize">Description</p>
                                <p>{this.state.metadata.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className={"card mb-4 " + themeStyle}>
                            <div className="card-body">
                                <p className="card-title text-muted text-capitalize">Links</p>
                                <ul className="list-group list-group-flush">
                                    {this.state.metadata.urls.map((url) => (
                                        <a href={url.link} className="list-group-item list-group-item-action text-capitalize" key={url.name} target='_blank' rel="noopener noreferrer">{url.name}</a>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return 'Loading data...'
        }
    }
}

Coin.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.object.isRequired
    })
}   

export default Coin