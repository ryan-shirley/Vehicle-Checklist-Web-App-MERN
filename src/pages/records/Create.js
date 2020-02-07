import React from "react"
import axios from "axios"
import { Row, Col, Button, Alert } from "react-bootstrap"
import GroupList from "./components/GroupList"
import ChecksForm from "./components/ChecksForms"
import { Link } from "react-router-dom"

class Create extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            checklist: "",
            groups: [],
            error: "",
            loading: true,
            currentList: [],
            results: [],
            process: ""
        }

        // Binding this to work in the callback
        this.setProgress = this.setProgress.bind(this)
    }

    /**
     * componentDidMount() Load user checklist
     */
    componentDidMount() {
        const uid = localStorage.getItem("UID")

        axios.defaults.headers.common["Authorization"] = localStorage.getItem(
            "jwtToken"
        )
        axios
            .get(process.env.REACT_APP_API_URI + "/users/" + uid + "/checklist")
            .then(res => {
                const { name, required_checks } = res.data.checkList

                this.setState({
                    checklist: name,
                    groups: required_checks,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    error: err.response.data.message
                })
            })
    }

    /**
     * onSubmit() Submit form
     */
    onSubmit = e => {
        e.preventDefault()

        let { results, groups } = this.state

        if (results.length !== groups.length) {
            this.setState({
                error: "Need to complete all stages"
            })
        } else {
            axios.defaults.headers.common[
                "Authorization"
            ] = localStorage.getItem("jwtToken")
            axios
                .post(process.env.REACT_APP_API_URI + "/records", {
                    checked_groups: this.state.results
                })
                .then(res => {
                    this.props.history.push("/records")
                })
                .catch(err => {
                    this.setState({
                        error: err.response.data.message
                    })
                })
        }
    }

    /**
     * startGroupCheck() Open single group for checks
     */
    startGroupCheck = groupId => {
        const currentList = this.state.groups.find(({ _id }) => _id === groupId)

        if (!currentList.completed) {
            this.setState({
                currentList,
                error: ""
            })
        } else {
            this.setState({
                error: "You have already filled out this group"
            })
        }
    }

    /**
     * groupFinished() Group check was completed
     * add to results
     */
    groupFinished = groupResults => {
        let newGroups = []
        for (let i = 0; i < this.state.groups.length; i++) {
            let group = this.state.groups[i]

            if (group._id === this.state.currentList._id) {
                group.completed = true
                newGroups.push(group)
            } else {
                newGroups.push(group)
            }
        }

        this.setState(state => {
            let results = state.results.concat({
                checks: groupResults,
                group_id: state.currentList.check_group_id._id
            })

            return {
                results,
                currentList: [],
                groups: newGroups
            }
        })
    }

    /**
     * setProgress() Set progress of group checks
     */
    setProgress(process) {
        this.setState({
            process
        })
    }

    render() {
        if (this.state.loading) {
            return (
                <h5 className="text-center bg-light border py-3">Loading...</h5>
            )
        }

        return (
            <>
                <p className="text-center bg-lightdarker create-header py-3 position-relative">
                    {this.state.currentList.check_group_id
                        ? this.state.currentList.check_group_id.name
                        : <span><span className="font-weight-semi-bold">Checklist:</span> {this.state.checklist}</span>}

                    {this.state.process && (
                        <span
                            className="position-absolute text-primary"
                            style={{ right: 20 }}
                        >
                            {this.state.process}
                        </span>
                    )}
                </p>

                {this.state.error && (
                    <Alert variant="danger">{this.state.error}</Alert>
                )}

                <Row className="justify-content-md-center">
                    <Col sm={4}>
                        {this.state.currentList.check_group_id &&
                        this.state.currentList.check_group_id.name ? (
                            <ChecksForm
                                checks={
                                    this.state.currentList.check_group_id.checks
                                }
                                onComplete={this.groupFinished}
                                onStageChange={this.setProgress}
                            />
                        ) : (
                            <>
                                <GroupList
                                    groups={this.state.groups}
                                    onClick={this.startGroupCheck}
                                />

                                <Link
                                    to="/records"
                                    className="btn btn-secondary mr-2"
                                >
                                    Cancel
                                </Link>
                                <Button
                                    variant="primary"
                                    onClick={this.onSubmit}
                                >
                                    Submit
                                </Button>
                            </>
                        )}
                    </Col>
                </Row>
            </>
        )
    }
}

export default Create
