import React from 'react';
import CryptoList from '../components/CryptoList'
import Button from '../components/Button'

class Home extends React.Component {
    render() {
        return (
            <>
                <section className="hero">
                    <h1 className="text-center">The <strong>best</strong> Cryptocurrency Data Brought<br />
                        to your finger tips.</h1>

                    <p className="text-center">
                        <Button
                            text='All Coins'
                            link='/list'
                            style='danger'
                            classes='btn-md text-uppercase'
                        />
                    </p>
                </section>


                <div className="row">
                    <div className="col-12 text-center mb-3">
                        <h3><strong>Top</strong> Coins 2019</h3>
                    </div>
                    <div className="col-12">
                        <CryptoList 
                            display="card"
                            amount={4} />
                    </div>
                </div>
            </>
        )
    }
}

export default Home