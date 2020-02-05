import React from "react"
import axios from "axios"
import { Table, Row, Col, Badge } from "react-bootstrap"
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

    /**
     * rowClicked() Open single project
     */
    rowClicked(url) {
        this.props.history.push(url)
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
                        <th className="d-none d-sm-table-cell">Registration Number</th>
                        <th className="d-none d-sm-table-cell">Plant</th>
                        <th className="d-none d-sm-table-cell">Checklist</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record._id} onClick={e => this.rowClicked(`${url}/${record._id}`)}>
                            <td>
                                <Moment format="YYYY/MM/DD - hh:mm a" className="text-primary">
                                    {record.date}
                                </Moment>
                            </td>
                            <td className="d-none d-sm-table-cell">{record.registration_number}</td>
                            <td className="d-none d-sm-table-cell">{record.plant_name}</td>
                            <td className="d-none d-sm-table-cell">{record.check_list_id.name}</td>
                            <td>
                                <Badge pill variant={record.passed ? 'success' : 'danger'}>
                                    {record.passed ? 'PASS' : 'FAIL'}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
        
        return (
            <Row>
                <Col sm={recordOpen ? 10 : 12} className={recordOpen && window.innerWidth <= 375 && 'd-none'}>
                    <Link
                        to="/records/create"
                        className="btn btn-primary float-right my-2"
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
