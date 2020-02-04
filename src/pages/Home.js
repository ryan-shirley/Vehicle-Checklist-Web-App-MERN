import React from "react"
import axios from "axios"
import { Table, Row, Col } from "react-bootstrap"
import Moment from "react-moment"
import { Switch, Route, Link } from "react-router-dom"
import RecordShow from "./records/Show"

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
        const { path, url, isExact } = this.props.match
        let recordOpen = !isExact

        const { records } = this.state

        const recordTable = (
            <Table hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Registration Number</th>
                        <th>Plant</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record._id}>
                            <td>
                                <Link to={`${url}/${record._id}`}>
                                    <Moment format="YYYY/MM/DD">
                                        {record.date}
                                    </Moment>
                                </Link>
                            </td>
                            <td>{record.registration_number}</td>
                            <td>{record.plant_name}</td>
                            <td>Unknown</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )

        let tableSize = recordOpen ? 10 : 12

        return (
            <Row>
                <Col sm={tableSize}>
                    <Link
                        to="/records/create"
                        className="btn btn-primary float-right"
                    >
                        Add Record
                    </Link>
                    {recordTable}
                </Col>
                
                {recordOpen && (
                    <Col sm={2} className="bg-light">
                        <Switch>
                            <Route
                                path={`${path}/:recordId`}
                                component={RecordShow}
                            />
                        </Switch>
                    </Col>
                )}
            </Row>
        )
    }
}

export default Home
