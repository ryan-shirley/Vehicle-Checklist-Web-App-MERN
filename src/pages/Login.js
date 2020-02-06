import React from "react"
import axios from 'axios'
import { Form, Button, Row, Col, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            error: ""
        }

        // Binding this to work in the callback
        this.onSubmit = this.onSubmit.bind(this)
    }

    /**
     * componentDidMount() Check for redirect message
     */
    componentDidMount() {
        let redirect_message = this.props.location.redirect_message

        if(redirect_message) {
            this.setState({
                error: redirect_message
            })
        }
    }

    handleInputChange = e => {
        const target = e.target
        const { name, value } = target

        this.setState({
            [name]: value
        })
    }

    onSubmit = e => {
        e.preventDefault()

        const user = {
            email: this.state.email,
            password: this.state.password
        }

        axios
            .post(process.env.REACT_APP_API_URI + '/login', user)
            .then(res => {
                // save token in local storage
                localStorage.setItem("jwtToken", res.data.token)
                localStorage.setItem("UID", res.data.user._id)
                localStorage.setItem("userFullName", res.data.user.first_name + ' ' + res.data.user.last_name)

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
            <Form onSubmit={this.onSubmit} className="mt-5">
                <Form.Group as={Row} controlId="formHorizontalIMDB">
                    <Form.Label column sm={2}>
                        Email
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            required
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalTitle">
                    <Form.Label column sm={2}>
                        Password
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            required
                        />
                    </Col>
                </Form.Group>

                {this.state.error && (
                    <Alert variant="danger">
                        {this.state.error}
                    </Alert>
                )}

                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="submit">Login</Button>
                    </Col>
                </Form.Group>

                <Link to="/register" className="btn btn-dark">
                    Register
                </Link>
                
            </Form>
        )
    }
}

export default Login
