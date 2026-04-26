import React from "react"
import api from "../services/api"
import { STORAGE_KEYS } from "../constants"
import { Form, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import { IconLocalShipping } from "../components/icons"

class Login extends React.Component {
    constructor(props) {
        super(props)

        let ndate = new Date()
        let hours = ndate.getHours()
        let message =
            hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening"

        this.state = {
            email: "",
            password: "",
            error: "",
            welcomeMessage: message
        }

        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        let redirect_message = this.props.location.redirect_message
        if (redirect_message) {
            this.setState({ error: redirect_message })
        }
    }

    handleInputChange = e => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onSubmit = e => {
        e.preventDefault()

        const user = { email: this.state.email, password: this.state.password }

        api
            .post("/api/login", user)
            .then(res => {
                localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, res.data.token)
                localStorage.setItem(STORAGE_KEYS.UID, res.data.user._id)
                localStorage.setItem(
                    STORAGE_KEYS.USER_FULL_NAME,
                    res.data.user.first_name + " " + res.data.user.last_name
                )
                this.props.onLogin(true)
                this.props.history.push("/records")
            })
            .catch(err => {
                this.setState({ error: err.response?.data?.message || "Login failed. Please try again." })
            })
    }

    render() {
        return (
            <div className="omc-auth">
                <div className="omc-auth__hero">
                    <div className="omc-auth__icon">
                        <IconLocalShipping />
                    </div>
                    <h1 className="omc-auth__title">HGV Checklist</h1>
                    <p className="omc-auth__subtitle">{this.state.welcomeMessage}</p>
                </div>

                <div className="omc-auth__card">
                    <Form onSubmit={this.onSubmit}>
                        {this.state.error && (
                            <Alert variant="danger" className="omc-auth__error">
                                {this.state.error}
                            </Alert>
                        )}

                        <div className="omc-auth__form-group">
                            <label className="omc-auth__label" htmlFor="loginEmail">Email</label>
                            <Form.Control
                                id="loginEmail"
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleInputChange}
                                className="omc-auth__input"
                                required
                            />
                        </div>

                        <div className="omc-auth__form-group">
                            <label className="omc-auth__label" htmlFor="loginPassword">Password</label>
                            <Form.Control
                                id="loginPassword"
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                className="omc-auth__input"
                                required
                            />
                        </div>

                        <button type="submit" className="btn omc-auth__btn omc-auth__btn--primary">
                            Sign In
                        </button>

                        <Link to="/register" className="btn btn-link omc-auth__btn omc-auth__btn--link">
                            Create account
                        </Link>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Login
