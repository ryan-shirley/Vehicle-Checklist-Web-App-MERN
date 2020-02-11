import React from "react"
import { Button, Row, Col, Form } from "react-bootstrap"

/**
 * ChecksForm() Pass or fail certain checks
 */
class ChecksForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            numChecks: 0,
            stage: 1,
            checks: [],
            results: [],
            failureScreen: false,
            note: ""
        }
    }

    /**
     * componentDidMount() Load user checklist & last check status
     */
    componentDidMount() {
        let { checks } = this.props

        this.setState({
            numChecks: checks.length,
            checks
        })

        this.props.onStageChange(`1/${checks.length}`)
    }

    /**
     * handleInputChange() Handle form input from user
     */
    handleInputChange = e => {
        const target = e.target
        const { name, value } = target

        this.setState({
            [name]: value
        })
    }

    /**
     * submitCheck() Add pass status of check into array.
     * Complete if at last stage.
     */
    submitCheck(passed) {
        console.log("Submitting stage")

        // Add check to results
        let stage = this.state.stage
        let code = this.state.checks[stage - 1].code
        let note = this.state.note

        this.setState(
            state => {
                const results = note
                    ? state.results.concat({
                          code,
                          passed,
                          note
                      })
                    : state.results.concat({
                          code,
                          passed
                      })

                return {
                    results,
                    note: ""
                }
            },
            () => {
                // Next stage or complete
                if (stage === this.state.checks.length) {
                    this.props.onComplete(this.state.results)
                    this.props.onStageChange("")
                } else {
                    this.setState(
                        {
                            stage: stage + 1,
                            failureScreen: false
                        },
                        () => {
                            this.props.onStageChange(
                                `${this.state.stage}/${this.state.numChecks}`
                            )
                        }
                    )
                }
            }
        )
    }

    render() {
        let stage = this.state.stage
        let title =
            this.state.checks[stage - 1] && this.state.checks[stage - 1].title

        return (
            <>
                {!this.state.failureScreen && (
                    <>
                        <p className="h5 font-weight-normal mb-5">{title}</p>

                        <Row>
                            <Col>
                                <Button
                                    block
                                    variant="danger"
                                    onClick={e =>
                                        this.setState({ failureScreen: true })
                                    }
                                >
                                    Fail
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    block
                                    variant="primary"
                                    onClick={e => this.submitCheck(true)}
                                >
                                    Pass
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}

                {this.state.failureScreen && (
                    <>
                        <h3 className="mb-4">Failure Note</h3>
                        <Form.Group controlId="hgvFailureNote">
                            <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder="Note about failure"
                                name="note"
                                value={this.state.note}
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>

                        <Button
                            block
                            onClick={e =>
                                this.submitCheck(false, this.state.note)
                            }
                        >
                            Submit
                        </Button>
                    </>
                )}
            </>
        )
    }
}

export default ChecksForm
