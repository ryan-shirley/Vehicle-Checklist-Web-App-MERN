import React from "react"
import api from "../../../services/api"
import { Button, Form, Spinner } from "react-bootstrap"
import {
    IconArrowBack,
    IconCheckCircle,
    IconCancel,
    IconAssignmentTurnedIn,
    IconReport,
    IconAddPhotoAlternate
} from "../../../components/icons"
import TopAppBar from "../../../components/TopAppBar"

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
    handleInputChange = (e) => {
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
            (state) => {
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
                            imageURL: ""
                        },
                        () => {
                            this.props.onStageChange(`${this.state.stage}/${this.state.numChecks}`)
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

        try {
            if (image) {
                let res = await this.uploadImage()

                this.setState(
                    {
                        imageURL: res.data.path,
                        image: null
                    },
                    () => this.submitCheck(false)
                )
            } else {
                this.submitCheck(false)
            }
        } catch (err) {
            this.setState({ processing: false })
            console.error("Image upload failed:", err)
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

            api.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then((res) => {
                    this.setState({ processing: false })
                    resolve(res)
                })
                .catch((err) => {
                    this.setState({ processing: false })
                    reject(err)
                })
        })
    }

    render() {
        let stage = this.state.stage
        let title = this.state.checks[stage - 1] && this.state.checks[stage - 1].title

        return (
            <>
                {!this.state.failureScreen && (
                    <div className="omc-check">
                        <div className="omc-check__step-bar">
                            <button
                                type="button"
                                className="omc-check__back"
                                aria-label="Back"
                                onClick={() => (this.props.onBack ? this.props.onBack() : window.history.back())}
                            >
                                <IconArrowBack />
                            </button>
                            <span className="omc-check__step">
                                Step {this.state.stage} of {this.state.numChecks}
                            </span>
                            <span className="omc-check__spacer" aria-hidden="true" />
                        </div>

                        <div className="omc-check__focus">
                            <div className="omc-check__icon-circle">
                                <IconAssignmentTurnedIn />
                            </div>
                            <h2 className="omc-check__title">{title}</h2>
                        </div>

                        <div className="omc-check__actions">
                            <Button
                                block
                                variant="primary"
                                className="omc-check__btn omc-check__btn--pass"
                                onClick={() => this.submitCheck(true)}
                            >
                                <IconCheckCircle />
                                Pass
                            </Button>
                            <Button
                                block
                                variant="danger"
                                className="omc-check__btn omc-check__btn--fail"
                                onClick={() => this.setState({ failureScreen: true })}
                            >
                                <IconCancel />
                                Fail
                            </Button>
                        </div>
                    </div>
                )}

                {this.state.failureScreen && (
                    <div className="omc-failure-note">
                        <TopAppBar />
                        <div className="omc-failure-note__hero">
                            <h2 className="omc-failure-note__title">Failure Note</h2>
                            <p className="omc-failure-note__subtitle">
                                Document the issue details for maintenance review.
                            </p>
                        </div>

                        <Form className="omc-failure-note__form">
                            <Form.Group controlId="hgvFailureNote" className="omc-failure-note__field">
                                <Form.Label className="omc-failure-note__label">Failure Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows="8"
                                    placeholder="Describe the failure, location, and circumstances..."
                                    name="note"
                                    value={this.state.note}
                                    onChange={this.handleInputChange}
                                    className="omc-failure-note__textarea"
                                />
                            </Form.Group>

                            <Form.Group controlId="hgvFailureImage" className="omc-failure-note__field">
                                <label className="omc-failure-note__photo-label">
                                    <IconAddPhotoAlternate />
                                    Add Photo Note
                                    <input
                                        type="file"
                                        className="omc-failure-note__file"
                                        onChange={(e) => this.setState({ image: e.target.files[0] })}
                                    />
                                </label>
                            </Form.Group>

                            {this.state.processing ? (
                                <Button block disabled className="omc-failure-note__btn omc-failure-note__btn--submit">
                                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                    Processing...
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        block
                                        onClick={() => this.submitFailure()}
                                        className="omc-failure-note__btn omc-failure-note__btn--submit"
                                    >
                                        <IconReport />
                                        Submit Failure
                                    </Button>
                                    <Button
                                        block
                                        type="button"
                                        onClick={() => this.setState({ failureScreen: false, note: "", image: null })}
                                        className="omc-failure-note__btn omc-failure-note__btn--cancel"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                )}
            </>
        )
    }
}

export default ChecksForm
