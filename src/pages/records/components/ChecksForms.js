import React from "react"
import { Button, ButtonGroup } from "react-bootstrap"

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

    submitCheck(passed) {
        console.log("Submitting stage")

        // Add check to results
        let stage = this.state.stage
        let code = this.state.checks[stage - 1].code

        this.setState(state => {
            const results = state.results.concat({
                code,
                passed
            })

            return {
                results
            }
        }, () => {

            // Next stage or complete
            if (stage === this.state.checks.length) {
                // console.log("All stages completed")

                this.props.onComplete(this.state.results)
                this.props.onStageChange('')
            } else {
                // console.log("Next stage")

                this.setState({
                    stage: stage + 1
                }, () => { this.props.onStageChange(`${this.state.stage}/${this.state.numChecks}`) })
            }
        })
    }

    render() {
        let stage = this.state.stage
        let title =
            this.state.checks[stage - 1] && this.state.checks[stage - 1].title

        return (
            <>
                <p className="h5">{title}</p>

                <div className="d-flex flex-column">
                    <ButtonGroup className="mt-3">
                        <Button
                            variant="danger"
                            onClick={e => this.submitCheck(false)}
                        >
                            Fail
                        </Button>
                        <Button
                            variant="success"
                            onClick={e => this.submitCheck(true)}
                        >
                            Pass
                        </Button>
                    </ButtonGroup>
                </div>
            </>
        )
    }
}

export default ChecksForm
