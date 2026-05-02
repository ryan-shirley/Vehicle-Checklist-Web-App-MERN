import React, { Component } from "react"
import { Spinner } from "react-bootstrap"
import TopAppBar from "../components/TopAppBar"
import { STORAGE_KEYS } from "../constants"
import api from "../services/api"
import { getCurrentUser } from "../services/currentUser"

class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            error: null,
            saving: false,
            saveError: null,
            saveSuccess: false,
            registration_number: "",
            make: "",
            model: "",
            plant_id: "",
            plants: []
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        Promise.all([getCurrentUser(), api.get("/api/plants")])
            .then(([user, plantsRes]) => {
                this.setState({
                    loading: false,
                    registration_number: user.vehicle?.registration_number || "",
                    make: user.vehicle?.make || "",
                    model: user.vehicle?.model || "",
                    plant_id: user.plant_id?._id || user.plant_id || "",
                    plants: plantsRes.data
                })
            })
            .catch((err) => {
                this.setState({ loading: false, error: err.message || "Failed to load settings" })
            })
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value, saveError: null, saveSuccess: false })
    }

    handleSubmit(e) {
        e.preventDefault()
        const { registration_number, make, model, plant_id } = this.state
        const uid = localStorage.getItem(STORAGE_KEYS.UID)

        this.setState({ saving: true, saveError: null, saveSuccess: false })

        api.put(`/api/users/${uid}`, {
            vehicle: { registration_number, make, model },
            plant_id
        })
            .then(() => {
                return getCurrentUser({ force: true })
            })
            .then((user) => {
                this.setState({
                    saving: false,
                    saveSuccess: true,
                    registration_number: user.vehicle?.registration_number || "",
                    make: user.vehicle?.make || "",
                    model: user.vehicle?.model || "",
                    plant_id: user.plant_id?._id || user.plant_id || ""
                })
            })
            .catch((err) => {
                const msg = err.response?.data?.message || err.message || "Failed to save settings"
                this.setState({ saving: false, saveError: msg })
            })
    }

    render() {
        const { loading, error, saving, saveError, saveSuccess, registration_number, make, model, plant_id, plants } =
            this.state

        return (
            <div className="omc-settings">
                <TopAppBar title={registration_number || "Settings"} />
                <div className="omc-settings__content">
                    <h2 className="omc-settings__title">Settings</h2>

                    {loading && (
                        <div className="text-center py-5">
                            <Spinner animation="border" />
                        </div>
                    )}

                    {error && <div className="omc-settings__alert omc-settings__alert--error">{error}</div>}

                    {!loading && !error && (
                        <form onSubmit={this.handleSubmit}>
                            <div className="omc-settings__card">
                                <p className="omc-settings__section-title">Vehicle Details</p>

                                <div className="omc-settings__form-group">
                                    <label className="omc-settings__label" htmlFor="registration_number">
                                        Registration Number
                                    </label>
                                    <input
                                        id="registration_number"
                                        className="form-control omc-settings__input"
                                        type="text"
                                        name="registration_number"
                                        value={registration_number}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>

                                <div className="omc-settings__form-group">
                                    <label className="omc-settings__label" htmlFor="make">
                                        Make
                                    </label>
                                    <input
                                        id="make"
                                        className="form-control omc-settings__input"
                                        type="text"
                                        name="make"
                                        value={make}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>

                                <div className="omc-settings__form-group">
                                    <label className="omc-settings__label" htmlFor="model">
                                        Model
                                    </label>
                                    <input
                                        id="model"
                                        className="form-control omc-settings__input"
                                        type="text"
                                        name="model"
                                        value={model}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="omc-settings__card">
                                <p className="omc-settings__section-title">Plant Assignment</p>

                                <div className="omc-settings__form-group">
                                    <label className="omc-settings__label" htmlFor="plant_id">
                                        Plant
                                    </label>
                                    <select
                                        id="plant_id"
                                        className="form-control omc-settings__input"
                                        name="plant_id"
                                        value={plant_id}
                                        onChange={this.handleChange}
                                        required
                                    >
                                        <option value="">Select a plant...</option>
                                        {plants.map((p) => (
                                            <option key={p._id} value={p._id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <p className="omc-settings__hint">
                                Future inspection records will use these updated details. Previous records are not
                                affected.
                            </p>

                            {saveError && (
                                <div className="omc-settings__alert omc-settings__alert--error">{saveError}</div>
                            )}
                            {saveSuccess && (
                                <div className="omc-settings__alert omc-settings__alert--success">
                                    Settings saved successfully.
                                </div>
                            )}

                            <button type="submit" className="btn omc-settings__btn" disabled={saving}>
                                {saving ? <Spinner animation="border" size="sm" /> : "Save Changes"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )
    }
}

export default Settings
