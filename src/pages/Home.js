import React from "react"
import axios from "axios"
import { Container, Table, Row, Col, Badge } from "react-bootstrap"
import Moment from "react-moment"
import { Switch, Route, Link } from "react-router-dom"
import RecordShow from "./records/Show"

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            records: []
        }

        // Binding this to work in the callback
        this.deleteRecord = this.deleteRecord.bind(this)
    }

    /**
     * componentDidMount() Fetch users records on mount
     */
    componentDidMount() {
        this.fetchRecords()
    }

    /**
     * fetchRecords() Fetch users records
     */
    fetchRecords() {
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
                console.log(err.message)
                
                if(err.response.status === 401) {
                    // Unauthorised
                    localStorage.removeItem("jwtToken")
                    this.props.history.replace('/')
                }
            })
    }

    /**
     * deleteRecord() Delete single record
     */
    deleteRecord(id) {
        axios.defaults.headers.common["Authorization"] = localStorage.getItem(
            "jwtToken"
        )
        axios
            .delete(process.env.REACT_APP_API_URI + "/records/" + id)
            .then(res => {
                this.props.onDelete('Successfully deleted record')
                this.props.history.push("/records")
                this.fetchRecords()
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
            <Table hover className="clickable-rows">
                <thead>
                    <tr>
                        <th className="text-uppercase">Date</th>
                        <th className="d-none d-sm-table-cell text-uppercase">
                            Registration Number
                        </th>
                        <th className="d-none d-sm-table-cell text-uppercase">
                            Plant
                        </th>
                        <th className="d-none d-sm-table-cell text-uppercase">
                            Checklist
                        </th>
                        <th className="text-uppercase">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr
                            key={record._id}
                            onClick={e =>
                                this.props.history.push(`${url}/${record._id}`)
                            }
                        >
                            <td>
                                <Moment
                                    format="DD/MM/YYYY - hh:mm a"
                                    className="text-primary font-weight-medium"
                                >
                                    {record.date}
                                </Moment>
                            </td>
                            <td className="d-none d-sm-table-cell">
                                {record.registration_number}
                            </td>
                            <td className="d-none d-sm-table-cell">
                                {record.plant_name}
                            </td>
                            <td className="d-none d-sm-table-cell">
                                {record.check_list_id.name}
                            </td>
                            <td>
                                <Badge
                                    pill
                                    variant={
                                        record.passed ? "success" : "danger"
                                    }
                                >
                                    {record.passed ? "PASS" : "FAIL"}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )

        return (
            <>
                <Row noGutters={true}>
                    <Col
                        md={6}
                        lg={recordOpen ? 10 : 12}
                        className={
                            recordOpen && window.innerWidth <= 375 && "d-none"
                        }
                    >
                        <Container fluid={true} className="text-right px-4">
                            <Link
                                to="/records/create"
                                className="btn btn-primary my-2"
                            >
                                Add Record
                            </Link>
                        </Container>

                        <hr className="my-0" />

                        {recordTable}
                    </Col>

                    {recordOpen && (
                        <Col md={6} lg={2} className="bg-light single-record">
                            <Switch>
                                <Route
                                    path={`${path}/:recordId`}
                                    component={props => (
                                        <RecordShow
                                            {...props}
                                            deleteRecord={this.deleteRecord}
                                        />
                                    )}
                                />
                            </Switch>
                        </Col>
                    )}
                </Row>
            </>
        )
    }
}

export default Home
