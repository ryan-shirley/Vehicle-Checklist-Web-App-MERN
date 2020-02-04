import React from "react"
import axios from 'axios'
import { Form, Button, Row, Col, Alert } from "react-bootstrap"

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            error: ""
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
                this.props.history.push("/home")
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
            </Form>
        )
    }
}

export default Login
