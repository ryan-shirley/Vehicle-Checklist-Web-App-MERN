import React, { Component } from "react";
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import TopAppBar from "../components/TopAppBar";
import api from "../services/api";
import { getCurrentUser } from "../services/currentUser";
import { APP_ROUTES, STORAGE_KEYS } from "../constants";

class Settings extends Component {
    constructor(props) {
        super(props);
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
            plants: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const uid = localStorage.getItem(STORAGE_KEYS.UID);
        Promise.all([
            getCurrentUser(),
            api.get("/api/plants"),
        ])
            .then(([user, plantsRes]) => {
                this.setState({
                    loading: false,
                    registration_number: user.vehicle?.registration_number || "",
                    make: user.vehicle?.make || "",
                    model: user.vehicle?.model || "",
                    plant_id: user.plant_id?._id || user.plant_id || "",
                    plants: plantsRes.data,
                });
            })
            .catch((err) => {
                this.setState({ loading: false, error: err.message || "Failed to load settings" });
            });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value, saveError: null, saveSuccess: false });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { registration_number, make, model, plant_id } = this.state;
        const uid = localStorage.getItem(STORAGE_KEYS.UID);

        this.setState({ saving: true, saveError: null, saveSuccess: false });

        api.put(`/api/users/${uid}`, {
            vehicle: { registration_number, make, model },
            plant_id,
        })
            .then(() => {
                return getCurrentUser({ force: true });
            })
            .then((user) => {
                this.setState({
                    saving: false,
                    saveSuccess: true,
                    registration_number: user.vehicle?.registration_number || "",
                    make: user.vehicle?.make || "",
                    model: user.vehicle?.model || "",
                    plant_id: user.plant_id?._id || user.plant_id || "",
                });
            })
            .catch((err) => {
                const msg = err.response?.data?.message || err.message || "Failed to save settings";
                this.setState({ saving: false, saveError: msg });
            });
    }

    render() {
        const { loading, error, saving, saveError, saveSuccess, registration_number, make, model, plant_id, plants } = this.state;

        return (
            <div>
                <TopAppBar title={registration_number || "Settings"} />
                <Container className="mt-4">
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            <h2 className="mb-4">Settings</h2>
                            {loading && (
                                <div className="text-center py-5">
                                    <Spinner animation="border" />
                                </div>
                            )}
                            {error && <Alert variant="danger">{error}</Alert>}
                            {!loading && !error && (
                                <Form onSubmit={this.handleSubmit}>
                                    <h5 className="mb-3">Vehicle Details</h5>
                                    <Form.Group className="mb-3" controlId="registration_number">
                                        <Form.Label>Registration Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="registration_number"
                                            value={registration_number}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="make">
                                        <Form.Label>Make</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="make"
                                            value={make}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="model">
                                        <Form.Label>Model</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="model"
                                            value={model}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <h5 className="mb-3 mt-4">Plant Assignment</h5>
                                    <Form.Group className="mb-3" controlId="plant_id">
                                        <Form.Label>Plant</Form.Label>
                                        <Form.Control
                                            as="select"
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
                                        </Form.Control>
                                    </Form.Group>
                                    <p className="text-muted small mb-3">
                                        Future inspection records will use these updated details. Previous records are not affected.
                                    </p>
                                    {saveError && <Alert variant="danger">{saveError}</Alert>}
                                    {saveSuccess && <Alert variant="success">Settings saved successfully.</Alert>}
                                    <Button type="submit" variant="primary" disabled={saving}>
                                        {saving ? <Spinner animation="border" size="sm" /> : "Save Changes"}
                                    </Button>
                                </Form>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Settings;
