import React from "react"
import { Alert, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { IconArrowBack } from "../../components/icons"
import TopAppBar from "../../components/TopAppBar"
import { APP_ROUTES } from "../../constants"
import api from "../../services/api"
import { getCurrentUser } from "../../services/currentUser"
import ChecksForm from "./components/ChecksForms"
import GroupList from "./components/GroupList"

class Create extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            availableChecklists: [],
            selectedChecklistId: null,
            checklist: "",
            groups: [],
            error: "",
            loading: true,
            currentList: [],
            results: [],
            process: "",
            user: null
        }

        // Binding this to work in the callback
        this.setProgress = this.setProgress.bind(this)
    }

    /**
     * componentDidMount() Load active checklists for picker
     */
    componentDidMount() {
        api.get("/api/check-lists?active=true")
            .then((res) => {
                this.setState({
                    availableChecklists: res.data,
                    loading: false
                })
            })
            .catch((err) => {
                this.setState({
                    error: err.response?.data?.message || "Failed to load checklists",
                    loading: false
                })
            })

        getCurrentUser()
            .then((data) => this.setState({ user: data }))
            .catch(() => {})
    }

    /**
     * selectChecklist() User picks a checklist from the picker
     */
    selectChecklist = (checklist) => {
        this.setState({
            selectedChecklistId: checklist._id,
            checklist: checklist.name,
            groups: checklist.required_checks
        })
    }

    /**
     * onSubmit() Submit form
     */
    onSubmit = (e) => {
        e.preventDefault()

        const { results, groups } = this.state

        if (results.length !== groups.length) {
            this.setState({
                error: "Need to complete all stages"
            })
        } else {
            api.post("/api/records", {
                checked_groups: this.state.results,
                check_list_id: this.state.selectedChecklistId
            })
                .then((_res) => {
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
        const newGroups = []
        for (let i = 0; i < this.state.groups.length; i++) {
            const group = this.state.groups[i]

            if (group._id === this.state.currentList._id) {
                group.completed = true
                newGroups.push(group)
            } else {
                newGroups.push(group)
            }
        }

        this.setState((state) => {
            const results = state.results.concat({
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
                    <TopAppBar title={this.state.user?.vehicle?.registration_number} />
                    <div className="omc-inspection__content">
                        <p className="omc-inspection__helper" style={{ marginTop: 32 }}>
                            Loading checklists…
                        </p>
                    </div>
                </div>
            )
        }

        const { currentList, groups, results, availableChecklists, selectedChecklistId } = this.state

        if (currentList.check_group_id?.name) {
            return (
                <ChecksForm
                    checks={currentList.check_group_id.checks}
                    onComplete={this.groupFinished}
                    onStageChange={this.setProgress}
                    onBack={() => this.setState({ currentList: [] })}
                />
            )
        }

        if (!selectedChecklistId) {
            return (
                <div className="omc-inspection">
                    <TopAppBar title={this.state.user?.vehicle?.registration_number} />
                    <div className="omc-inspection__content">
                        <div className="omc-inspection__nav">
                            <Link to="/records" className="omc-back-btn" aria-label="Back to logbook">
                                <IconArrowBack />
                            </Link>
                        </div>
                        <div className="omc-inspection__hero">
                            <span className="omc-inspection__overline">SELECT CHECKLIST</span>
                            <h1 className="omc-inspection__title">New Inspection</h1>
                        </div>

                        {this.state.error && (
                            <Alert variant="danger" className="omc-inspection__error">
                                {this.state.error}
                            </Alert>
                        )}

                        {availableChecklists.length === 0 ? (
                            <Alert variant="info">
                                No active checklists available. <Link to={APP_ROUTES.CHECKLISTS}>Create one</Link>.
                            </Alert>
                        ) : (
                            <div className="omc-inspection__card">
                                {availableChecklists.map((cl) => (
                                    <button
                                        key={cl._id}
                                        className="omc-inspection__picker-item"
                                        onClick={() => this.selectChecklist(cl)}
                                    >
                                        {cl.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        return (
            <div className="omc-inspection">
                <TopAppBar title={this.state.user?.vehicle?.registration_number} />

                <div className="omc-inspection__content">
                    <div className="omc-inspection__nav">
                        <Link to="/records" className="omc-back-btn" aria-label="Back to logbook">
                            <IconArrowBack />
                        </Link>
                    </div>
                    <div className="omc-inspection__hero">
                        <span className="omc-inspection__overline">
                            VEHICLE {this.state.user?.vehicle?.registration_number || ""}
                        </span>
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
