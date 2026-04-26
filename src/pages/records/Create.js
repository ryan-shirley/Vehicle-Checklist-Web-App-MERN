import React from "react"
import api from "../../services/api"
import { STORAGE_KEYS } from "../../constants"
import { Button, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import GroupList from "./components/GroupList"
import ChecksForm from "./components/ChecksForms"
import TopAppBar from "../../components/TopAppBar"
import { IconArrowBack } from "../../components/icons"

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
        const uid = localStorage.getItem(STORAGE_KEYS.UID)

        api.get("/api/users/" + uid + "/checklist")
            .then((res) => {
                const { name, required_checks } = res.data.checkList

                this.setState({
                    checklist: name,
                    groups: required_checks,
                    loading: false
                })
            })
            .catch((err) => {
                this.setState({
                    error: err.response?.data?.message || "Failed to load checklist"
                })
            })
    }

    /**
     * onSubmit() Submit form
     */
    onSubmit = (e) => {
        e.preventDefault()

        let { results, groups } = this.state

        if (results.length !== groups.length) {
            this.setState({
                error: "Need to complete all stages"
            })
        } else {
            api.post("/api/records", {
                checked_groups: this.state.results
            })
                .then((res) => {
                    this.props.onCreate("Successfully added a new record")
                    this.props.history.push("/records")
                })
                .catch((err) => {
                    this.setState({
                        error: err.response?.data?.message || "Failed to submit record"
                    })
                })
        }
    }

    /**
     * startGroupCheck() Open single group for checks
     */
    startGroupCheck = (groupId) => {
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
    groupFinished = (groupResults) => {
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

        this.setState((state) => {
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
                <div className="omc-inspection">
                    <TopAppBar />
                    <div className="omc-inspection__content">
                        <p className="omc-inspection__helper" style={{ marginTop: 32 }}>
                            Loading checklist…
                        </p>
                    </div>
                </div>
            )
        }

        const { currentList, groups, results } = this.state

        if (currentList.check_group_id && currentList.check_group_id.name) {
            return (
                <ChecksForm
                    checks={currentList.check_group_id.checks}
                    onComplete={this.groupFinished}
                    onStageChange={this.setProgress}
                    onBack={() => this.setState({ currentList: [] })}
                />
            )
        }

        return (
            <div className="omc-inspection">
                <TopAppBar />

                <div className="omc-inspection__content">
                    <div className="omc-inspection__nav">
                        <Link to="/records" className="omc-back-btn" aria-label="Back to logbook">
                            <IconArrowBack />
                        </Link>
                    </div>
                    <div className="omc-inspection__hero">
                        <span className="omc-inspection__overline">VEHICLE 201-D-17</span>
                        <h1 className="omc-inspection__title">Inspection</h1>
                    </div>

                    {this.state.error && (
                        <Alert variant="danger" className="omc-inspection__error">
                            {this.state.error}
                        </Alert>
                    )}

                    <div className="omc-inspection__card">
                        <GroupList groups={groups} onClick={this.startGroupCheck} />
                    </div>

                    <Button
                        className="omc-inspection__submit"
                        block
                        onClick={this.onSubmit}
                        disabled={results.length !== groups.length}
                    >
                        Submit
                    </Button>
                    <p className="omc-inspection__helper">
                        {results.length === groups.length
                            ? "All sections complete."
                            : "Complete all sections to enable submission."}
                    </p>
                </div>
            </div>
        )
    }
}

export default Create
