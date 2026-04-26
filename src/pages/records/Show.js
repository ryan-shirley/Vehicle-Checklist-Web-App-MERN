import React, { Component } from "react"
import api from "../../services/api"
import Moment from "react-moment"
import { Link } from "react-router-dom"
import { Modal, Button, Image } from "react-bootstrap"
import TopAppBar from "../../components/TopAppBar"
import { IconArrowBack } from "../../components/icons"

class RecordShow extends Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.state = {
            record: {},
            checkDetails: null,
            loading: true,
            error: ""
        }

        this.deleteRecord = this.deleteRecord.bind(this)
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchRecord()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchRecord() {
        const recordId = this.props.match.params.recordId

        api.get("/api/records/" + recordId)
            .then((res) => {
                if (this._isMounted) {
                    this.setState({ record: res.data, loading: false })
                }
            })
            .catch((err) => {
                if (this._isMounted) {
                    this.setState({
                        error: err.response?.data?.message || "Failed to load record",
                        loading: false
                    })
                }
            })
    }

    deleteRecord() {
        const recordId = this.props.match.params.recordId

        api.delete("/api/records/" + recordId)
            .then(() => {
                this.props.onDelete("Successfully deleted record")
                this.props.history.push("/records")
            })
            .catch(() => {})
    }

    toggleDetails(details = null) {
        this.setState({ checkDetails: details })
    }

    render() {
        const { record, loading, error, checkDetails } = this.state

        if (loading) {
            return (
                <div className="omc-record-show">
                    <TopAppBar />
                    <div className="omc-record-show__content">
                        <p>Loading...</p>
                    </div>
                </div>
            )
        }

        if (error || !record._id) {
            return (
                <div className="omc-record-show">
                    <TopAppBar />
                    <div className="omc-record-show__content">
                        <Link to="/records" className="omc-back-btn" aria-label="Back to logbook">
                            <IconArrowBack />
                        </Link>
                        <p>{error || "Record not found."}</p>
                    </div>
                </div>
            )
        }

        const groups = record.checked_groups.map((group) => (
            <div key={group._id} className="omc-record-show__group-card">
                <h5 className="omc-record-show__group-title">{group.group_id.name}</h5>
                {group.checks.map((check) => {
                    const checkDef = group.group_id.checks.find((c) => c.code === check.code)
                    return (
                        <div key={check.code} className="omc-record-show__check-item">
                            <span
                                className={`omc-record-show__check-badge ${check.passed ? "omc-record-show__check-badge--pass" : "omc-record-show__check-badge--issue"}`}
                            >
                                {check.passed ? "PASS" : "ISSUE"}
                            </span>
                            <div className="omc-record-show__check-body">
                                <p className="omc-record-show__check-title">{checkDef ? checkDef.title : check.code}</p>
                                {check.note && <p className="omc-record-show__check-note">{check.note}</p>}
                                {(check.note || check.image_url) && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        style={{ padding: 0, fontSize: "12px" }}
                                        onClick={() => this.toggleDetails(check)}
                                    >
                                        View Details
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        ))

        return (
            <div className="omc-record-show">
                <TopAppBar />
                <div className="omc-record-show__content">
                    <Link to="/records" className="omc-back-btn" aria-label="Back to logbook">
                        <IconArrowBack />
                    </Link>

                    <div className="omc-record-show__header">
                        <Moment format="DD/MM/YYYY - hh:mm a" className="omc-record-show__date">
                            {record.date}
                        </Moment>
                        <span
                            className={`omc-record-show__status-badge ${record.passed ? "omc-record-show__status-badge--pass" : "omc-record-show__status-badge--fail"}`}
                        >
                            {record.passed ? "PASS" : "FAIL"}
                        </span>
                    </div>

                    <p className="omc-record-show__checklist-name">
                        {record.check_list_id && record.check_list_id.name}
                    </p>

                    {groups}

                    <div className="omc-record-show__actions">
                        <Link
                            to={`/records/${record._id}/edit`}
                            className="omc-record-show__btn omc-record-show__btn--edit"
                        >
                            Edit
                        </Link>
                        <button
                            type="button"
                            className="omc-record-show__btn omc-record-show__btn--delete"
                            onClick={this.deleteRecord}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {checkDetails && (
                    <Modal
                        show={!!checkDetails}
                        onHide={() => this.toggleDetails()}
                        animation={false}
                        centered
                        size="lg"
                    >
                        <Modal.Header>
                            <Modal.Title>Issue Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>{checkDetails.note}</p>
                            {checkDetails.image_url && <Image src={checkDetails.image_url} fluid className="mt-3" />}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.toggleDetails()}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </div>
        )
    }
}

export default RecordShow
