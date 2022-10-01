import React from "react"
import axios from "axios"
import { Form, Button, Row, Col, Alert, Container } from "react-bootstrap"
import { Link } from "react-router-dom"

class Login extends React.Component {
    constructor(props) {
        super(props)

        // Generate welcome message
        let ndate = new Date()
        let hours = ndate.getHours()
        let message =
            hours < 12
                ? "Good Morning"
                : hours < 18
                ? "Good Afternoon"
                : "Good Evening"

        this.state = {
            email: "",
            password: "",
            error: "",
            welcomeMessage: message
        }

        // Binding this to work in the callback
        this.onSubmit = this.onSubmit.bind(this)
    }

    /**
     * componentDidMount() Check for redirect message
     */
    componentDidMount() {
        let redirect_message = this.props.location.redirect_message

        if (redirect_message) {
            this.setState({
                error: redirect_message
            })
        }
    }

    /**
     * handleInputChange() Handle form input from user
     */
    handleInputChange = e => {
        const target = e.target
        const { name, value } = target

        this.setState({
            [name]: value
        })
    }

    /**
     * onSubmit() Submit form to login
     */
    onSubmit = e => {
        e.preventDefault()

        const user = {
            email: this.state.email,
            password: this.state.password
        }

        axios
            .post("api/login", user)
            .then(res => {
                // save token in local storage
                localStorage.setItem("jwtToken", res.data.token)
                localStorage.setItem("UID", res.data.user._id)
                localStorage.setItem(
                    "userFullName",
                    res.data.user.first_name + " " + res.data.user.last_name
                )

                this.props.onLogin(true)
                this.props.history.push("/records")
            })
            .catch(err => {
                this.setState({
                    error: err.response.data.message
                })
            })
    }

    render() {
        return (
            <Container className="mt-5 mb-5">
                <div className="text-center">
                    <h1>HGV Checklist System</h1>
                    <p>
                        {this.state.welcomeMessage} and welcome to my platform.
                    </p>
                    <hr style={{ width: 60 }} />
                </div>

                <Row className="justify-content-md-center mt-5">
                    <Col sm={6}>
                        <p className="text-center">
                            Sign in with your credentials
                        </p>

                        <Form onSubmit={this.onSubmit} className="mt-3">
                            {this.state.error && (
                                <Alert variant="danger">
                                    {this.state.error}
                                </Alert>
                            )}

                            <Form.Group controlId="hgvLoginEmail">
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="hgvLoginPassword">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit">Sign In</Button>

                            <Link
                                to="/register"
                                className="btn btn-link float-right"
                            >
                                Register
                            </Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Login
