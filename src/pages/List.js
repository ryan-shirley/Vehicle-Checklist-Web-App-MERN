import React from 'react';
import CryptoList from '../components/CryptoList'

class List extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-12 text-center mb-3">
                    <h3>The <strong>Top</strong> 100 Cryptocurrencies</h3>
                </div>
                <div className="col-md-12">
                    <CryptoList 
                    display="table"
                    amount={100} />
                </div>
            </div>
        )
    }
}

export default List