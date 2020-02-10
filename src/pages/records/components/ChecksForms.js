import React from "react"
import { Button, Row, Col } from "react-bootstrap"

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
            results: []
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
     * submitCheck() Add pass status of check into array.
     * Complete if at last stage.
     */
    submitCheck(passed) {
        console.log("Submitting stage")

        // Add check to results
        let stage = this.state.stage
        let code = this.state.checks[stage - 1].code

        this.setState(
            state => {
                const results = state.results.concat({
                    code,
                    passed
                })

                return {
                    results
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
                            stage: stage + 1
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
                <p className="h5 font-weight-normal mb-5">{title}</p>

                <Row>
                    <Col>
                        <Button
                            block
                            variant="danger"
                            onClick={e => this.submitCheck(false)}
                        >
                            Fail
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            block
                            variant="success"
                            onClick={e => this.submitCheck(true)}
                        >
                            Pass
                        </Button>
                    </Col>
                </Row>
            </>
        )
    }
}

export default ChecksForm
