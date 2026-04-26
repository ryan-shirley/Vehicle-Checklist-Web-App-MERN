import React, { Component } from "react"
import * as Sentry from "@sentry/react"

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        Sentry.captureException(error, { extra: info })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "40px 16px", textAlign: "center", fontFamily: "sans-serif" }}>
                    <h2>Something went wrong.</h2>
                    <p>Please refresh the page to try again.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: 16, padding: "10px 24px", cursor: "pointer" }}
                    >
                        Refresh
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary
