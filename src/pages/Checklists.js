import React, { Component } from "react"
import { Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { IconArrowBack } from "../components/icons"
import TopAppBar from "../components/TopAppBar"
import { APP_ROUTES } from "../constants"
import api from "../services/api"

class Checklists extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checklists: [],
            loading: true,
            error: "",
            mode: "list", // "list" | "create" | "edit"
            editingId: null,
            draft: { name: "", sections: [] },
            saving: false,
            saveError: ""
        }
    }

    componentDidMount() {
        this.fetchChecklists()
    }

    fetchChecklists() {
        api.get("/api/check-lists")
            .then((res) => this.setState({ checklists: res.data, loading: false, error: "" }))
            .catch((err) =>
                this.setState({
                    error: err.response?.data?.message || "Failed to load checklists",
                    loading: false
                })
            )
    }

    startCreate = () => {
        this.setState({ mode: "create", draft: { name: "", sections: [] }, saveError: "" })
    }

    startEdit = (checklist) => {
        const draft = {
            name: checklist.name,
            sections: checklist.required_checks.map((rc) => ({
                name: rc.check_group_id.name,
                checks: rc.check_group_id.checks.map((c) => ({ title: c.title }))
            }))
        }
        this.setState({ mode: "edit", editingId: checklist._id, draft, saveError: "" })
    }

    cancelEdit = () => {
        this.setState({ mode: "list", editingId: null, draft: { name: "", sections: [] } })
    }

    handleNameChange = (e) => {
        const val = e.target.value
        this.setState((s) => ({ draft: { ...s.draft, name: val } }))
    }

    addSection = () => {
        this.setState((s) => ({
            draft: { ...s.draft, sections: [...s.draft.sections, { name: "", checks: [] }] }
        }))
    }

    removeSection = (si) => {
        this.setState((s) => ({
            draft: { ...s.draft, sections: s.draft.sections.filter((_, i) => i !== si) }
        }))
    }

    handleSectionNameChange = (si, val) => {
        this.setState((s) => {
            const sections = [...s.draft.sections]
            sections[si] = { ...sections[si], name: val }
            return { draft: { ...s.draft, sections } }
        })
    }

    addCheck = (si) => {
        this.setState((s) => {
            const sections = [...s.draft.sections]
            sections[si] = { ...sections[si], checks: [...sections[si].checks, { title: "" }] }
            return { draft: { ...s.draft, sections } }
        })
    }

    removeCheck = (si, ci) => {
        this.setState((s) => {
            const sections = [...s.draft.sections]
            sections[si] = { ...sections[si], checks: sections[si].checks.filter((_, i) => i !== ci) }
            return { draft: { ...s.draft, sections } }
        })
    }

    handleCheckTitleChange = (si, ci, val) => {
        this.setState((s) => {
            const sections = [...s.draft.sections]
            const checks = [...sections[si].checks]
            checks[ci] = { title: val }
            sections[si] = { ...sections[si], checks }
            return { draft: { ...s.draft, sections } }
        })
    }

    save = () => {
        const { draft, mode, editingId } = this.state

        if (!draft.name.trim()) {
            return this.setState({ saveError: "Checklist name is required." })
        }
        for (const section of draft.sections) {
            if (!section.name.trim()) {
                return this.setState({ saveError: "All section names are required." })
            }
            for (const check of section.checks) {
                if (!check.title.trim()) {
                    return this.setState({ saveError: "All check titles are required." })
                }
            }
        }

        this.setState({ saving: true, saveError: "" })

        const body = {
            name: draft.name.trim(),
            sections: draft.sections.map((s) => ({
                name: s.name.trim(),
                checks: s.checks.map((c) => ({ title: c.title.trim() }))
            }))
        }

        const request =
            mode === "create" ? api.post("/api/check-lists", body) : api.put(`/api/check-lists/${editingId}`, body)

        request
            .then(() => {
                this.setState({
                    saving: false,
                    mode: "list",
                    editingId: null,
                    draft: { name: "", sections: [] }
                })
                this.fetchChecklists()
            })
            .catch((err) => {
                this.setState({
                    saving: false,
                    saveError: err.response?.data?.message || "Failed to save"
                })
            })
    }

    archive = (id) => {
        api.patch(`/api/check-lists/${id}/archive`)
            .then(() => this.fetchChecklists())
            .catch((err) => this.setState({ error: err.response?.data?.message || "Failed to archive" }))
    }

    render() {
        const { checklists, loading, error, mode, draft, saving, saveError } = this.state

        if (loading) {
            return (
                <div className="omc-checklists">
                    <TopAppBar title="Manage Checklists" />
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                    </div>
                </div>
            )
        }

        if (mode !== "list") {
            return (
                <div className="omc-checklists">
                    <TopAppBar title="Manage Checklists" />
                    <div className="omc-checklists__content">
                        <div className="omc-checklists__builder-header">
                            <button className="omc-back-btn" onClick={this.cancelEdit} aria-label="Back to checklists">
                                <IconArrowBack />
                            </button>
                            <h2 className="omc-checklists__builder-title">
                                {mode === "create" ? "New Checklist" : "Edit Checklist"}
                            </h2>
                        </div>

                        {saveError && (
                            <div className="omc-checklists__alert omc-checklists__alert--error">{saveError}</div>
                        )}

                        <div className="omc-checklists__form-group">
                            <label className="omc-checklists__label" htmlFor="checklist-name">
                                Checklist Name
                            </label>
                            <input
                                id="checklist-name"
                                className="form-control omc-checklists__input"
                                type="text"
                                value={draft.name}
                                onChange={this.handleNameChange}
                                placeholder="e.g. HGV Daily Walkaround"
                            />
                        </div>

                        {draft.sections.map((section, si) => (
                            <div key={si} className="omc-checklists__section-card">
                                <div className="omc-checklists__section-header">
                                    <input
                                        className="form-control omc-checklists__section-name"
                                        type="text"
                                        value={section.name}
                                        onChange={(e) => this.handleSectionNameChange(si, e.target.value)}
                                        placeholder="Section name"
                                    />
                                    <button
                                        className="omc-checklists__btn omc-checklists__btn--danger"
                                        onClick={() => this.removeSection(si)}
                                    >
                                        Remove section
                                    </button>
                                </div>

                                {section.checks.map((check, ci) => (
                                    <div key={ci} className="omc-checklists__check-row">
                                        <input
                                            className="form-control omc-checklists__check-input"
                                            type="text"
                                            value={check.title}
                                            onChange={(e) => this.handleCheckTitleChange(si, ci, e.target.value)}
                                            placeholder="Check title"
                                        />
                                        <button
                                            className="omc-checklists__btn omc-checklists__btn--link"
                                            onClick={() => this.removeCheck(si, ci)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}

                                <button
                                    className="omc-checklists__btn omc-checklists__btn--secondary"
                                    style={{ marginTop: 8, marginLeft: 16 }}
                                    onClick={() => this.addCheck(si)}
                                >
                                    + Add check
                                </button>
                            </div>
                        ))}

                        <button
                            className="omc-checklists__btn omc-checklists__btn--secondary"
                            style={{ marginBottom: 8 }}
                            onClick={this.addSection}
                        >
                            + Add section
                        </button>

                        <div className="omc-checklists__builder-actions">
                            <button
                                className="omc-checklists__btn omc-checklists__btn--primary"
                                onClick={this.save}
                                disabled={saving}
                            >
                                {saving ? <Spinner animation="border" size="sm" /> : "Save"}
                            </button>
                            <button className="omc-checklists__btn omc-checklists__btn--link" onClick={this.cancelEdit}>
                                Cancel
                            </button>
                        </div>

                        {mode === "edit" && (
                            <p className="omc-checklists__builder-hint">
                                Editing a checklist does not affect past inspection records.
                            </p>
                        )}
                    </div>
                </div>
            )
        }

        return (
            <div className="omc-checklists">
                <TopAppBar title="Manage Checklists" />
                <div className="omc-checklists__content">
                    <div className="omc-checklists__topbar">
                        <Link to={APP_ROUTES.RECORDS} className="omc-back-btn" aria-label="Back to Records">
                            <IconArrowBack />
                        </Link>
                        <button className="omc-checklists__btn omc-checklists__btn--primary" onClick={this.startCreate}>
                            New Checklist
                        </button>
                    </div>

                    {error && <div className="omc-checklists__alert omc-checklists__alert--error">{error}</div>}

                    {checklists.length === 0 && (
                        <p className="omc-checklists__empty">No checklists yet. Create one to get started.</p>
                    )}

                    {checklists.map((cl) => (
                        <div key={cl._id} className="omc-checklists__item">
                            <div>
                                <p className="omc-checklists__item-name">
                                    {cl.name}
                                    {cl.archived && <span className="omc-checklists__badge">Archived</span>}
                                </p>
                                <span className="omc-checklists__item-meta">
                                    {cl.required_checks.length} section
                                    {cl.required_checks.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            {!cl.archived && (
                                <div className="omc-checklists__item-actions">
                                    <button
                                        className="omc-checklists__btn omc-checklists__btn--secondary"
                                        onClick={() => this.startEdit(cl)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="omc-checklists__btn omc-checklists__btn--danger"
                                        onClick={() => this.archive(cl._id)}
                                    >
                                        Archive
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Checklists
