import React, { Component } from "react"
import axios from "axios"
import Moment from "react-moment"
import { Link } from "react-router-dom"
import { Badge, Button, Row, Col } from "react-bootstrap"

/**
 * RecordShow() Main navbar for all users
 */
class RecordShow extends Component {
    constructor(props) {
        super(props)

        this.state = {
            record: {},
            loading: false
        }
    }

    /**
     * componentDidMount() Load single record
     */
    componentDidMount() {
        this.fetchRecord()
    }

    /**
     * componentDidUpdate() Monitor for new record selected
     * then fetch new record.
     */
    componentDidUpdate(nextProps) {
        if (
            nextProps.match.params.recordId !== this.props.match.params.recordId
        ) {
            this.fetchRecord()
        }
    }

    /**
     * fetchRecord() Fetch single record
     */
    fetchRecord() {
        let recordId = this.props.match.params.recordId

        this.setState({
            loading: true
        })

        axios.defaults.headers.common["Authorization"] = localStorage.getItem(
            "jwtToken"
        )
        axios
            .get(process.env.REACT_APP_API_URI + "/records/" + recordId)
            .then(res => {
                this.setState({
                    record: res.data,
                    loading: false
                })
            })
            .catch(err => {
                console.log(err.response.data.message)
            })
    }

    render() {
        if (
            this.state.loading ||
            (Object.entries(this.state.record).length === 0 &&
                this.state.record.constructor === Object)
        ) {
            return "Loading..."
        } else {
            let groups = this.state.record.checked_groups

            groups = groups.map(group => (
                <div key={group._id}>
                    <h4>{group.group_id.name}</h4>
                    <hr />

                    <ul className="list-unstyled">
                        {group.checks.map(check => (
                            <li key={check.code} className="media mb-3">
                                <Badge
                                    pill
                                    variant={
                                        check.passed ? "success" : "danger"
                                    }
                                    className="align-self-start mr-3"
                                >
                                    {check.passed ? "PASS" : "FAIL"}
                                </Badge>
                                <div className="media-body">
                                    {group.group_id.checks.map(chk =>
                                        chk.code === check.code ? chk.title : ""
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))

            return (
                <>
                    <Row className="sidebar-header align-items-center">
                        <Col className="border-bottom border-top">
                            <Moment format="YYYY/MM/DD" className="text-primary text-medium d-inline-block align-middle">
                                {this.state.record.date}
                            </Moment>
                        </Col>
                        <Col className="border-bottom border-top">
                            <Badge
                                pill
                                variant={
                                    this.state.record.passed ? "success" : "danger"
                                }
                            >
                                {this.state.record.passed ? "PASS" : "FAIL"}
                            </Badge>
                        </Col>
                        <Col className="border-bottom border-top text-right pr-0">
                            <Link to="/records" className="btn btn-outline-secondary btn-close border-right-0 border-top-0 border-bottom-0 rounded-0">></Link>
                        </Col>
                    </Row>
                    {/* <Link to="/records">Close</Link>
                    <p>
                        <Moment format="YYYY/MM/DD">
                            {this.state.record.date}
                        </Moment>{" "}
                        -{" "}
                        <Badge
                            pill
                            variant={
                                this.state.record.passed ? "success" : "danger"
                            }
                        >
                            {this.state.record.passed ? "PASS" : "FAIL"}
                        </Badge>
                    </p>
                    <p><Button variant="danger" onClick={() => this.props.deleteRecord(this.state.record._id)}>Delete</Button></p>
                    <p><Link to={`/records/${this.state.record._id}/edit`} className="btn btn-warning">Edit</Link></p>
                    <p>Checklist: {this.state.record.check_list_id.name}</p>
                    {groups} */}
                </>
            )
        }
    }
}

export default RecordShow
