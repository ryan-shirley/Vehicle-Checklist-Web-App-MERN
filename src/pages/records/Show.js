import React, { Component } from "react"
import axios from "axios"
import Moment from "react-moment"
import { Link } from "react-router-dom"
import { Badge, Button, Row, Col, Alert, Modal, Image } from "react-bootstrap"

/**
 * RecordShow() Main navbar for all users
 */
class RecordShow extends Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            record: {},
            checkDetails: null,
            loading: false,
            error: ""
        }
    }

    /**
     * componentDidMount() Load single record
     */
    componentDidMount() {
        this._isMounted = true
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
            .get("/api/records/" + recordId)
            .then(res => {
                if (this._isMounted) {
                    this.setState({
                        record: res.data,
                        loading: false
                    })
                }
            })
            .catch(err => {
                if (this._isMounted) {
                    this.setState({
                        error: err.response.data.message,
                        loading: false
                    })
                }
            })
    }

    /**
     * componentWillUnmount() Helps ensure set state is not
     * called when not mounted
     */
    componentWillUnmount() {
        this._isMounted = false
    }

    /**
     * toggleDetails() Toggle display details about failed record
     */
    toggleDetails(details = null) {
        this.setState({
            checkDetails: details
        })
    }

    render() {
        if (
            this.state.loading ||
            (Object.entries(this.state.record).length === 0 &&
                this.state.record.constructor === Object)
        ) {
            return (
                <>
                    <Row className="sidebar-header align-items-center mb-2">
                        <Col className="border-bottom border-top">
                            <span className="text-primary text-medium d-inline-block align-middle">
                                Loading...
                            </span>
                        </Col>
                        <Col className="border-bottom border-top text-right">
                            N/A
                        </Col>
                        <Col className="border-bottom border-top text-right pr-0">
                            <Link
                                to="/records"
                                className="btn btn-outline-secondary btn-close border-right-0 border-top-0 border-bottom-0 rounded-0"
                            >
                                >
                            </Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {this.state.error && (
                                <Alert variant="danger">
                                    {this.state.error}
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </>
            )
        } else {
            let groups = this.state.record.checked_groups

            groups = groups.map(group => (
                <div key={group._id}>
                    <h5 className="mb-0 mt-4">{group.group_id.name}</h5>
                    <hr />

                    <ul className="list-unstyled">
                        {group.checks.map(check => (
                            <li key={check.code} className="media mb-3">
                                <Badge
                                    pill
                                    variant={
                                        check.passed ? "success" : "warning"
                                    }
                                    className="align-self-start mr-3"
                                >
                                    {check.passed ? "PASS" : "ISSUE"}
                                </Badge>
                                <div className="media-body">
                                    <p>
                                        {group.group_id.checks.map(
                                            chk =>
                                                chk.code === check.code &&
                                                chk.title
                                        )}
                                    </p>
                                    {check.note || check.image_url ? (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={e =>
                                                this.toggleDetails(check)
                                            }
                                        >
                                            View Details
                                        </Button>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {this.state.checkDetails && (
                        <Modal
                            show={this.state.checkDetails ? true : false}
                            onHide={() => this.toggleDetails()}
                            animation={false}
                            centered
                            size="lg"
                        >
                            <Modal.Header>
                                <Modal.Title>Issue Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>{this.state.checkDetails.note}</p>
                                {this.state.checkDetails.image_url && (
                                    <Image
                                        src={this.state.checkDetails.image_url}
                                        fluid
                                        className="mt-5"
                                    />
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="secondary"
                                    onClick={() => this.toggleDetails()}
                                >
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </div>
            ))

            return (
                <>
                    <Row className="sidebar-header align-items-center">
                        <Col className="border-bottom border-top">
                            <Moment
                                format="DD/MM/YYYY"
                                className="text-primary font-weight-medium d-inline-block align-middle"
                            >
                                {this.state.record.date}
                            </Moment>
                        </Col>
                        <Col className="border-bottom border-top text-right">
                            <Badge
                                pill
                                variant={
                                    this.state.record.passed
                                        ? "success"
                                        : "danger"
                                }
                            >
                                {this.state.record.passed ? "PASS" : "FAIL"}
                            </Badge>
                        </Col>
                        <Col className="border-bottom border-top text-right pr-0">
                            <Link
                                to="/records"
                                className="btn btn-outline-secondary btn-close border-right-0 border-top-0 border-bottom-0 rounded-0"
                            >
                                >
                            </Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="border-bottom bg-lightdarker">
                            <span>
                                <span className="font-weight-semi-bold">
                                    Checklist:
                                </span>{" "}
                                {this.state.record.check_list_id.name}
                            </span>
                        </Col>
                    </Row>

                    <Row>
                        <Col>{groups}</Col>
                    </Row>

                    <hr />

                    <Row>
                        <Col>
                            <Link
                                to={`/records/${this.state.record._id}/edit`}
                                className="btn btn-warning"
                            >
                                Edit
                            </Link>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
                                onClick={() =>
                                    this.props.deleteRecord(
                                        this.state.record._id
                                    )
                                }
                            >
                                Delete
                            </Button>
                        </Col>
                    </Row>
                </>
            )
        }
    }
}

export default RecordShow
