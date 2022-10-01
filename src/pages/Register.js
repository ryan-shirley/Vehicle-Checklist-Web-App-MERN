import React from "react"
import axios from "axios"
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"

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

        // Binding this to work in the callback
        this.onSubmit = this.onSubmit.bind(this)
    }

    /**
     * componentDidMount() Load form data
     */
    componentDidMount() {
        // Get checklists
        axios
            .get("api/check-lists")
            .then(res => {
                this.setState({
                    checklists: res.data,
                    check_list_id: res.data[0]._id
                })
            })
            .catch(err => {
                this.setState({
                    error: err.response.data.message
                })
            })

        // Get plants
        axios
            .get("api/plants")
            .then(res => {
                this.setState({
                    plants: res.data,
                    plant_id: res.data[0]._id
                })
            })
            .catch(err => {
                this.setState({
                    error: err.response.data.message
                })
            })
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
     * onSubmit() Submit form to register
     */
    onSubmit = e => {
        e.preventDefault()

        let {
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

        // Ensure password and confimation match before submitting
        if (password !== confirmPassword) {
            this.setState({
                error: "Passwords do not match."
            })
        } else {
            const user = {
                first_name,
                last_name,
                vehicle: {
                    registration_number,
                    make,
                    model,
                    check_list_id
                },
                plant_id,
                email,
                password
            }

            axios
                .post("api/users", user)
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
                        error: err.response.data.error
                    })
                })
        }
    }

    render() {
        return (
            <Container className="mt-5 mb-5">
                <div className="text-center">
                    <h1>Register for an account</h1>
                    <p>Use the awesome form below to request an account.</p>
                    <hr style={{ width: 60 }} />
                </div>

                <Row className="justify-content-md-center mt-5">
                    <Col sm={6}>
                        <p className="text-center">
                            Please remember your credentials
                        </p>

                        <Form onSubmit={this.onSubmit} className="mt-3">
                            {this.state.error && (
                                <Alert variant="danger">
                                    {this.state.error}
                                </Alert>
                            )}

                            <Row>
                                <Form.Group
                                    as={Col}
                                    controlId="registerFirstName"
                                >
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={this.state.firstName}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group
                                    as={Col}
                                    controlId="registerLastName"
                                >
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={this.state.lastName}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Form.Group controlId="registerRegistration_number">
                                <Form.Label>Registration Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="registration_number"
                                    value={this.state.registration_number}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Row>
                                <Form.Group
                                    as={Col}
                                    controlId="registerMake"
                                >
                                    <Form.Label>Make</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="make"
                                        value={this.state.make}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group
                                    as={Col}
                                    controlId="registerModel"
                                >
                                    <Form.Label>Model</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="model"
                                        value={this.state.model}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Form.Group
                                    as={Col}
                                    controlId="registerCheck_list_id"
                                >
                                    <Form.Label>Checklist</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="check_list_id"
                                        value={this.state.check_list_id}
                                        onChange={this.handleInputChange}
                                    >
                                        {this.state.checklists.map(list => (
                                            <option
                                                key={list._id}
                                                value={list._id}
                                            >
                                                {list.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group
                                    as={Col}
                                    controlId="registerPlant"
                                >
                                    <Form.Label>Plant</Form.Label>
                                    <Form.Control as="select">
                                        {this.state.plants.map(plant => (
                                            <option key={plant._id}>
                                                {plant.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Row>

                            <Form.Group controlId="registerEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="registerPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="registerConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={this.state.confirmPassword}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit">Register</Button>

                            <Link
                                to="/"
                                className="btn btn-link float-right"
                            >
                                Login
                            </Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Register
