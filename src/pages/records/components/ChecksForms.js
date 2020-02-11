import React from "react"
import axios from "axios"
import { Button, Row, Col, Form, Spinner } from "react-bootstrap"

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
            note: "",
            imageURL: "",
            image: null,
            processing: false
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

        // Get form data
        let stage = this.state.stage
        let code = this.state.checks[stage - 1].code
        let note = this.state.note
        let image_url = this.state.imageURL

        // Create Results obj
        let result = {}
        result.code = code
        result.passed = passed

        if (note) result.note = note
        if (image_url) result.image_url = image_url

        this.setState(
            state => {
                const results = state.results.concat(result)

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
                            failureScreen: false,
                            imageURL: ''
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

    /**
     * submitFailure() Submit failure notes and image
     */
    submitFailure = async () => {
        let image = this.state.image

        if (image) {
            let res = await this.uploadImage()
            
            this.setState({
                imageURL: res.data.path,
                image: null
            }, () => this.submitCheck(false))
        }
        else {
            this.submitCheck(false)
        }
    }

    /**
     * uploadImage() Upload Image
     */
    uploadImage = () => {
        this.setState({ processing: true })

        return new Promise((resolve, reject) => {
            let formData = new FormData()
            formData.append("image", this.state.image)

            axios.defaults.headers.common[
                "Authorization"
            ] = localStorage.getItem("jwtToken")
            axios
                .post(process.env.REACT_APP_API_URI + "/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(res => {
                    this.setState({ processing: false })
                    resolve(res)
                })
                .catch(err => {
                    this.setState({ processing: false })
                    reject(err)
                })
        })
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

                        <Form.Group controlId="hgvFailureNote">
                            <input
                                type="file"
                                className="form-control"
                                onChange={e =>
                                    this.setState({ image: e.target.files[0] })
                                }
                            />
                        </Form.Group>

                        {this.state.processing ? <Button block disabled>
                            <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Processing...
                        </Button> : <Button block onClick={e => this.submitFailure()}>Submit</Button> }
                    </>
                )}
            </>
        )
    }
}

export default ChecksForm
