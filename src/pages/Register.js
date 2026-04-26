import React from "react"
import api from "../services/api"
import { STORAGE_KEYS } from "../constants"
import { Form, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import { IconLocalShipping } from "../components/icons"

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: "",
            lastName: "",
            registration_number: "",
            make: "",
            model: "",
            check_list_id: "",
            plant_id: "",
            email: "",
            password: "",
            confirmPassword: "",
            checklists: [],
            plants: [],
            error: ""
        }

        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        api.get("/api/check-lists")
            .then((res) => {
                this.setState({ checklists: res.data, check_list_id: res.data[0]._id })
            })
            .catch((err) => {
                this.setState({ error: err.response?.data?.message || "Failed to load checklists" })
            })

        api.get("/api/plants")
            .then((res) => {
                this.setState({ plants: res.data, plant_id: res.data[0]._id })
            })
            .catch((err) => {
                this.setState({ error: err.response?.data?.message || "Failed to load plants" })
            })
    }

    handleInputChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onSubmit = (e) => {
        e.preventDefault()

        const {
            firstName: first_name,
            lastName: last_name,
            registration_number,
            make,
            model,
            check_list_id,
            plant_id,
            email,
            password,
            confirmPassword
        } = this.state

        if (password !== confirmPassword) {
            this.setState({ error: "Passwords do not match." })
            return
        }

        const user = {
            first_name,
            last_name,
            vehicle: { registration_number, make, model, check_list_id },
            plant_id,
            email,
            password
        }

        api.post("/api/users", user)
            .then((res) => {
                localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, res.data.token)
                localStorage.setItem(STORAGE_KEYS.UID, res.data.user._id)
                localStorage.setItem(
                    STORAGE_KEYS.USER_FULL_NAME,
                    res.data.user.first_name + " " + res.data.user.last_name
                )
                this.props.onLogin(true)
                this.props.history.push("/records")
            })
            .catch((err) => {
                this.setState({ error: err.response?.data?.error || "Registration failed. Please try again." })
            })
    }

    render() {
        return (
            <div className="omc-auth">
                <div className="omc-auth__hero">
                    <div className="omc-auth__icon">
                        <IconLocalShipping />
                    </div>
                    <h1 className="omc-auth__title">Create Account</h1>
                    <p className="omc-auth__subtitle">Register for an HGV Checklist account</p>
                </div>

                <div className="omc-auth__card">
                    <Form onSubmit={this.onSubmit}>
                        {this.state.error && (
                            <Alert variant="danger" className="omc-auth__error">
                                {this.state.error}
                            </Alert>
                        )}

                        <div className="omc-auth__row">
                            <div className="omc-auth__form-group">
                                <label className="omc-auth__label" htmlFor="regFirstName">
                                    First Name
                                </label>
                                <Form.Control
                                    id="regFirstName"
                                    type="text"
                                    name="firstName"
                                    value={this.state.firstName}
                                    onChange={this.handleInputChange}
                                    className="omc-auth__input"
                                    required
                                />
                            </div>
                            <div className="omc-auth__form-group">
                                <label className="omc-auth__label" htmlFor="regLastName">
                                    Last Name
                                </label>
                                <Form.Control
                                    id="regLastName"
                                    type="text"
                                    name="lastName"
                                    value={this.state.lastName}
                                    onChange={this.handleInputChange}
                                    className="omc-auth__input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="omc-auth__form-group">
                            <label className="omc-auth__label" htmlFor="regReg">
                                Registration Number
                            </label>
                            <Form.Control
                                id="regReg"
                                type="text"
                                name="registration_number"
                                value={this.state.registration_number}
                                onChange={this.handleInputChange}
                                className="omc-auth__input"
                                required
                            />
                        </div>

                        <div className="omc-auth__row">
                            <div className="omc-auth__form-group">
                                <label className="omc-auth__label" htmlFor="regMake">
                                    Make
                                </label>
                                <Form.Control
                                    id="regMake"
                                    type="text"
                                    name="make"
                                    value={this.state.make}
                                    onChange={this.handleInputChange}
                                    className="omc-auth__input"
                                    required
                                />
                            </div>
                            <div className="omc-auth__form-group">
                                <label className="omc-auth__label" htmlFor="regModel">
                                    Model
                                </label>
                                <Form.Control
                                    id="regModel"
                                    type="text"
                                    name="model"
                                    value={this.state.model}
                                    onChange={this.handleInputChange}
                                    className="omc-auth__input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="omc-auth__row">
                            <div className="omc-auth__form-group">
                                <label className="omc-auth__label" htmlFor="regChecklist">
                                    Checklist
                                </label>
                                <Form.Control
                                    id="regChecklist"
                                    as="select"
                                    name="check_list_id"
                                    value={this.state.check_list_id}
                                    onChange={this.handleInputChange}
                                    className="omc-auth__input"
                                >
                                    {this.state.checklists.map((list) => (
                                        <option key={list._id} value={list._id}>
                                            {list.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </div>
                            <div className="omc-auth__form-group">
                                <label className="omc-auth__label" htmlFor="regPlant">
                                    Plant
                                </label>
                                <Form.Control
                                    id="regPlant"
                                    as="select"
                                    name="plant_id"
                                    value={this.state.plant_id}
                                    onChange={this.handleInputChange}
                                    className="omc-auth__input"
                                >
                                    {this.state.plants.map((plant) => (
                                        <option key={plant._id} value={plant._id}>
                                            {plant.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </div>
                        </div>

                        <div className="omc-auth__form-group">
                            <label className="omc-auth__label" htmlFor="regEmail">
                                Email
                            </label>
                            <Form.Control
                                id="regEmail"
                                type="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleInputChange}
                                className="omc-auth__input"
                                required
                            />
                        </div>

                        <div className="omc-auth__form-group">
                            <label className="omc-auth__label" htmlFor="regPassword">
                                Password
                            </label>
                            <Form.Control
                                id="regPassword"
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                className="omc-auth__input"
                                required
                            />
                        </div>

                        <div className="omc-auth__form-group">
                            <label className="omc-auth__label" htmlFor="regConfirm">
                                Confirm Password
                            </label>
                            <Form.Control
                                id="regConfirm"
                                type="password"
                                name="confirmPassword"
                                value={this.state.confirmPassword}
                                onChange={this.handleInputChange}
                                className="omc-auth__input"
                                required
                            />
                        </div>

                        <button type="submit" className="btn omc-auth__btn omc-auth__btn--primary">
                            Register
                        </button>

                        <Link to="/" className="btn btn-link omc-auth__btn omc-auth__btn--link">
                            Sign in instead
                        </Link>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Register
