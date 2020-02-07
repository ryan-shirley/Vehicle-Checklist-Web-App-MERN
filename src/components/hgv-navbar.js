import React, { Component } from "react"
import { Navbar, Nav, NavDropdown } from "react-bootstrap"
import { Redirect } from "react-router-dom"

/**
 * HGVNavbar() Main navbar for all users
 */
class HGVNavbar extends Component {
    constructor(props) {
        super(props)

        let name = ""
        if (props.loggedIn) {
            name = localStorage.getItem("userFullName")
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
        if (nextProps.loggedIn !== this.props.loggedIn) {
            this.setState({
                userFullName: localStorage.getItem("userFullName") || ""
            })
        }
    }

    /**
     * logout() Log user out of the application
     */
    logout() {
        localStorage.removeItem("jwtToken")
        localStorage.removeItem("UID")
        localStorage.removeItem("userFullName")

        this.setState({ redirect: true }, () => {
            this.setState({ redirect: false }, () => {
                this.props.onLogout(false)
            })
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" push={true} />
        }

        return (
            <Navbar bg="light" expand="lg" className="p-0 pr-3">
                <Navbar.Brand href="/" className="py-0">
                    <img
                        alt="HGV Logo"
                        src="/logo192.png"
                        width="60"
                        height="60"
                        className="d-inline-block align-top mr-3"
                    />{' '}
                    HGV Tracking
                </Navbar.Brand>
                <Nav className="hgv-settings-nav ml-auto">
                    <div>
                        <span className="text-uppercase driver">Driver</span>
                        {this.state.userFullName && (<NavDropdown alignRight title={`${this.state.userFullName}`} id="hgv-settings-dropdown">
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
                    </div>
                </Nav>
            </Navbar>

            // <Navbar bg="light" expand="lg">
            //     <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
            //     <Navbar.Collapse id="basic-navbar-nav">
            //         <Nav className="mr-auto">
            //             <Nav.Link href="#home">Home</Nav.Link>
            //             <Nav.Link href="#link">Link</Nav.Link>
            //             <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            //                 <NavDropdown.Item href="#action/3.1">
            //                     Action
            //                 </NavDropdown.Item>
            //                 <NavDropdown.Item href="#action/3.2">
            //                     Another action
            //                 </NavDropdown.Item>
            //                 <NavDropdown.Item href="#action/3.3">
            //                     Something
            //                 </NavDropdown.Item>
            //                 <NavDropdown.Divider />
            //                 <NavDropdown.Item href="#action/3.4">
            //                     Separated link
            //                 </NavDropdown.Item>
            //             </NavDropdown>
            //         </Nav>
            //     </Navbar.Collapse>
            // </Navbar>
        )
    }
}

export default HGVNavbar
