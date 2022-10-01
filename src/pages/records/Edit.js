import React, { Component } from "react"
import axios from "axios"
import Moment from "react-moment"
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"

/**
 * RecordEdit() Edit record
 */
class RecordEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            record: {},
            loading: false,
            processing: false,
            error: ""
        }

        // Binding this to work in the callback
        this.handleChange = this.handleChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    /**
     * componentDidMount() Load single record
     */
    componentDidMount() {
        this.fetchRecord()
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
                this.setState({
                    record: res.data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    error: err.response.data.message,
                    loading: false
                })

                if (err.response.data.code === 401) {
                    this.props.history.replace("/records")
                }
            })
    }

    /**
     * updateRecord() Update record
     */
    updateRecord = e => {
        e.preventDefault()

        let recordId = this.props.match.params.recordId

        this.setState({
            processing: true
        })

        axios.defaults.headers.common["Authorization"] = localStorage.getItem(
            "jwtToken"
        )
        axios
            .put(
                "/api/records/" + recordId,
                this.state.record
            )
            .then(res => {
                this.props.onEdit(`Successfully update record for ${this.state.record.date}`)
                this.props.history.push("/records")
            })
            .catch(err => {
                this.setState({
                    error: err.response.data.error,
                    processing: false
                })
            })
    }

    /**
     * handleChange() Handle form checkbox changes
     */
    handleChange(event, gIndex, cIndex) {
        const target = event.target
        const passed = target.checked

        // Update Record
        this.setState(state => {
            let record = state.record
            record.checked_groups[gIndex].checks[cIndex].passed = passed

            // Reset note message
            if(passed) record.checked_groups[gIndex].checks[cIndex].note = ''

            return {
                record
            }
        })
    }

    /**
     * handleInputChange() Handle form text input changes
     */
    handleInputChange(event, gIndex, cIndex) {
        const target = event.target
        const value = target.value

        // Update Record
        this.setState(state => {
            let record = state.record

            record.checked_groups[gIndex].checks[cIndex].note = value

            return {
                record
            }
        })
    }

    render() {
        if (this.state.loading) {
            return "Loading..."
        } else {
            return (
                <>
                    <p className="text-center bg-lightdarker create-header py-3 mb-5 position-relative">
                        Edit Record -{" "}
                        <Moment
                            format="DD/MM/YYYY - hh:mm a"
                            className="text-primary"
                        >
                            {this.state.record.date}
                        </Moment>
                    </p>

                    <Container fluid={true}>
                        <Row className="justify-content-md-center mt-3 mb-3">
                            <Col sm={12} md={6}>
                                <Form onSubmit={this.updateRecord}>
                                    {this.state.error && (
                                        <Alert variant="danger">
                                            {this.state.error}
                                        </Alert>
                                    )}

                                    {this.state.record.checked_groups &&
                                        this.state.record.checked_groups.map(
                                            (group, gIndex) => (
                                                <div key={group._id}>
                                                    <h4>
                                                        {group.group_id.name}
                                                    </h4>
                                                    <hr />

                                                    <Row>
                                                        <Col
                                                            className="text-uppercase font-weight-bold"
                                                            xs={9}
                                                            sm={6}
                                                        >
                                                            Check
                                                        </Col>
                                                        <Col
                                                            className="text-uppercase font-weight-bold"
                                                            xs={3}
                                                            sm={2}
                                                        >
                                                            Status
                                                        </Col>
                                                        <Col
                                                            className="text-uppercase font-weight-bold d-none d-sm-block"
                                                            xs={3}
                                                            sm={4}
                                                        >
                                                            Notes
                                                        </Col>
                                                    </Row>

                                                    {group.checks.map(
                                                        (check, cIndex) => (
                                                            <Form.Group
                                                                as={Row}
                                                                key={check._id}
                                                            >
                                                                <Form.Label
                                                                    column
                                                                    xs={9}
                                                                    sm={6}
                                                                >
                                                                    {
                                                                        group
                                                                            .group_id
                                                                            .checks[
                                                                            cIndex
                                                                        ].title
                                                                    }
                                                                </Form.Label>
                                                                <Col
                                                                    xs={3}
                                                                    sm={2}
                                                                >
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id="custom-switch"
                                                                        name={
                                                                            check.code
                                                                        }
                                                                        checked={
                                                                            this
                                                                                .state
                                                                                .record
                                                                                .checked_groups[
                                                                                gIndex
                                                                            ]
                                                                                .checks[
                                                                                cIndex
                                                                            ]
                                                                                .passed
                                                                        }
                                                                        onChange={e =>
                                                                            this.handleChange(
                                                                                e,
                                                                                gIndex,
                                                                                cIndex
                                                                            )
                                                                        }
                                                                    />
                                                                </Col>
                                                                <Col
                                                                    xs={12}
                                                                    sm={4}
                                                                >
                                                                    {!this.state
                                                                        .record
                                                                        .checked_groups[
                                                                        gIndex
                                                                    ].checks[
                                                                        cIndex
                                                                    ]
                                                                        .passed && (
                                                                        <Form.Group controlId="hgvFailureNote">
                                                                            <Form.Control
                                                                                as="textarea"
                                                                                rows="3"
                                                                                placeholder="Note about failure"
                                                                                name="note"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .record
                                                                                        .checked_groups[
                                                                                        gIndex
                                                                                    ]
                                                                                        .checks[
                                                                                        cIndex
                                                                                    ]
                                                                                        .note
                                                                                }
                                                                                onChange={e =>
                                                                                    this.handleInputChange(
                                                                                        e,
                                                                                        gIndex,
                                                                                        cIndex
                                                                                    )
                                                                                }
                                                                            />
                                                                        </Form.Group>
                                                                    )}
                                                                </Col>
                                                            </Form.Group>
                                                        )
                                                    )}
                                                </div>
                                            )
                                        )}

                                    <hr />
                                    <Link
                                        to="/records"
                                        className="btn btn-secondary mr-2"
                                    >
                                        Cancel
                                    </Link>
                                    <Button variant="primary" type="submit">
                                        Update
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </>
            )
        }
    }
}

export default RecordEdit
