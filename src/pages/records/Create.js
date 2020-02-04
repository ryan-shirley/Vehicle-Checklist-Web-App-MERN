import React from "react"
import axios from 'axios'
import { Form, Button, Row, Col, Alert } from "react-bootstrap"

class Create extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            checklist: '',
            groups: [],
            error: '',
            loading: true
        }
    }

    /**
     * componentDidMount() Load user checklist & last check status
     */
    componentDidMount() {
        const uid = localStorage.getItem("UID")

        axios.defaults.headers.common["Authorization"] = localStorage.getItem("jwtToken")
        axios
            .get(process.env.REACT_APP_API_URI + '/users/' + uid + '/checklist')
            .then(res => {
                const { name, required_checks } = res.data.checkList
                
                this.setState({
                    checklist: name,
                    groups: required_checks,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    error: err.response.data.message
                })
            })
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

        // axios
        //     .post(process.env.REACT_APP_API_URI + '/login', user)
        //     .then(res => {
        //         // save token in local storage
        //         localStorage.setItem("jwtToken", res.data.token)
        //         this.props.history.push("/records")
        //     })
        //     .catch(err => {
        //         this.setState({
        //             error: err.response.data.message
        //         })
        //     })
    }

    render() {
        if(this.state.loading) {
            return <h5 className="text-center bg-light border py-3">Loading...</h5>
        }

        return (
            <h5 className="text-center bg-light border py-3">Checklist: {this.state.checklist}</h5>
        )
    }
}

export default Create
