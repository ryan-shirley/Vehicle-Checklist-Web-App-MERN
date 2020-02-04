import React from "react"
import axios from "axios"
import { Table } from "react-bootstrap"
import Moment from 'react-moment';

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            records: []
        }
    }

    /**
     * componentDidMount() Load users records
     */
    componentDidMount() {
        console.log("Mounted")

        axios.defaults.headers.common["Authorization"] = localStorage.getItem(
            "jwtToken"
        )
        axios
            .get(process.env.REACT_APP_API_URI + "/records")
            .then(res => {
                this.setState({
                    records: res.data
                })
            })
            .catch(err => {
                console.log(err.response.data.message)
            })
    }

    render() {
        const { records } = this.state

        const recordRows = records.map(record => (
            <tr key={record._id}>
                <td><Moment format="YYYY/MM/DD">{record.date}</Moment></td>
                <td>{record.registration_number}</td>
                <td>{record.plant_name}</td>
                <td>Unknown</td>
            </tr>
        ))

        return (
            <Table striped bordered hover className="mt-5">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Registration Number</th>
                        <th>Plant</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {recordRows}
                </tbody>
            </Table>
        )
    }
}

export default Home
