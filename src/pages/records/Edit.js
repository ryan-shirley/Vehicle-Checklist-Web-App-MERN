import React, { Component } from "react"
import axios from "axios"
import Moment from "react-moment"
import { Row, Col, Card, Button, Form, Alert } from "react-bootstrap"
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

        this.handleChange = this.handleChange.bind(this)
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
            .get(process.env.REACT_APP_API_URI + "/records/" + recordId)
            .then(res => {
                this.setState({
                    record: res.data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    error: err.response.data.error,
                    loading: false
                })
                console.log(err.response.data.message)
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
                process.env.REACT_APP_API_URI + "/records/" + recordId,
                this.state.record
            )
            .then(res => {
                this.props.history.push("/records")
            })
            .catch(err => {
                this.setState({
                    error: err.response.data.error,
                    processing: false
                })
                console.log(err.response.data.message)
            })
    }

    /**
     * handleChange() Handle form checkbox changes
     */
    handleChange(event, gIndex, cIndex) {
        const target = event.target
        const value = target.checked

        // Update Record
        this.setState(state => {
            let record = state.record
            record.checked_groups[gIndex].checks[cIndex].passed = value

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
                <Row className="justify-content-md-center mt-3">
                    <Col sm={12} md={6}>
                        <Card>
                            <Card.Header>
                                Edit Record -{" "}
                                <Moment
                                    format="YYYY/MM/DD - hh:mm a"
                                    className="text-primary"
                                >
                                    {this.state.record.date}
                                </Moment>
                            </Card.Header>
                            <Card.Body>
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
                                                        <Col className='text-uppercase font-weight-bold' xs={9} sm={6}>Check</Col>
                                                        <Col className='text-uppercase font-weight-bold' xs={3} sm={4}>Status</Col>
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
                                                                    sm={6}
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
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )
        }
    }
}

export default RecordEdit
