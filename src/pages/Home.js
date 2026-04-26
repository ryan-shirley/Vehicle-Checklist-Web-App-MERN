import React from "react"
import axios from "axios"
import { Table, Badge } from "react-bootstrap"
import Moment from "react-moment"
import { Link } from "react-router-dom"
import TopAppBar from "../components/TopAppBar"

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            records: []
        }
    }

    componentDidMount() {
        this.fetchRecords()
    }

    fetchRecords() {
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("jwtToken")
        axios
            .get("/api/records")
            .then(res => {
                this.setState({ records: res.data })
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("jwtToken")
                    this.props.history.replace("/")
                }
            })
    }

    render() {
        const { url } = this.props.match
        const { records } = this.state

        return (
            <div className="omc-logbook">
                <TopAppBar />
                <div className="omc-logbook__content">
                    <h1 className="omc-logbook__title">Logbook</h1>
                    <p className="omc-logbook__subtitle">Vehicle: 201-D-17</p>

                    <div className="text-right px-4">
                        <Link
                            to="/records/create"
                            className="omc-logbook__cta"
                        >
                            New Check
                        </Link>
                    </div>

                    <hr className="my-0" />

                    <Table hover className="clickable-rows omc-logbook__table">
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
                                    className={record.passed ? "omc-logbook__row" : "omc-logbook__row omc-logbook__row--fail"}
                                    onClick={() => this.props.history.push(`${url}/${record._id}`)}
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
                                            variant={record.passed ? "success" : "danger"}
                                            className={`omc-logbook__badge ${record.passed ? "omc-logbook__badge--pass" : "omc-logbook__badge--fail"}`}
                                        >
                                            {record.passed ? "PASS" : "FAIL"}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <button type="button" className="omc-logbook__load-older" disabled>
                        Load Older Records
                    </button>
                </div>
            </div>
        )
    }
}

export default Home
