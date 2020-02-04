import React from "react"
import { Navbar } from 'react-bootstrap'

/**
 * HGVNavbar() Main navbar for all users
 */
const HGVNavbar = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/records">HGV Tracking</Navbar.Brand>
        </Navbar>
    )
}

export default HGVNavbar