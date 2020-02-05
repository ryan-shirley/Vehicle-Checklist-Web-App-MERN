import React, { Component } from "react"
import { Navbar, Nav, NavDropdown } from "react-bootstrap"
import { Redirect } from "react-router-dom"

/**
 * HGVNavbar() Main navbar for all users
 */
class HGVNavbar extends Component {
    constructor(props) {
        super(props)

        let name = ''
        if(props.loggedIn) {
            name = localStorage.getItem('userFullName')
        }

        this.state = {
            loggedIn: props.loggedIn,
            redirect: false,
            userFullName: name
        }

        // Binding this to work in the callback
        this.logout = this.logout.bind(this)
    }

    /**
     * componentDidUpdate() Update username on loggin status change
     */
    componentDidUpdate(nextProps) {
        if(nextProps.loggedIn !== this.props.loggedIn) {
            this.setState({
                userFullName: localStorage.getItem('userFullName') || ''
            })
        }
    }

    /**
     * logout() Log user out of the application
     */
    logout() {
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('UID')
        localStorage.removeItem('userFullName')

        this.setState({ redirect: true }, () => { this.setState({ redirect: false }, () => { this.props.onLogout(false) })})
    }

    render() {

        if(this.state.redirect) {
            return <Redirect to='/' push={true} />
        }

        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">HGV Tracking</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {this.state.userFullName && (<NavDropdown alignRight title={this.state.userFullName} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/">
                                Action*
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/">
                                Another action*
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={this.logout}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>)}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default HGVNavbar
