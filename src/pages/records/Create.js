import React from "react"
import axios from "axios"
import { Row, Col, Button, Alert } from "react-bootstrap"
import GroupList from "./components/GroupList"
import ChecksForm from "./components/ChecksForms"

class Create extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            checklist: "",
            groups: [],
            error: "",
            loading: true,
            currentList: [],
            results: []
        }
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
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("jwtToken")
            axios
                .post(
                    process.env.REACT_APP_API_URI + "/records",
                    { checked_groups: this.state.results }
                )
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

    startGroupCheck = groupId => {
        const currentList = this.state.groups.find(({ _id }) => _id === groupId)

        this.setState({
            currentList,
            error: ""
        })
    }

    groupFinished = groupResults => {
        let newGroups = []
        for (let i = 0; i < this.state.groups.length; i++) {
            let group = this.state.groups[i]

            console.log(group._id, this.state.currentList._id)

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
                group_id: state.currentList._id
            })

            return {
                results,
                currentList: [],
                groups: newGroups
            }
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
                <h5 className="text-center bg-light border py-3">
                    {this.state.currentList.name
                        ? this.state.currentList.name
                        : "Checklist: " + this.state.checklist}
                </h5>

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
                            />
                        ) : (
                            <>
                                <GroupList
                                    groups={this.state.groups}
                                    onClick={this.startGroupCheck}
                                />
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
