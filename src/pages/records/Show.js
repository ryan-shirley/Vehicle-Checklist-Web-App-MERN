import React, { Component } from "react"
import axios from "axios"
import Moment from "react-moment"
import { Link } from "react-router-dom"
import { Badge } from "react-bootstrap"


/**
 * RecordShow() Main navbar for all users
 */
class RecordShow extends Component {
    constructor(props) {
        super(props)

        this.state = {
            record: {},
            loading: false
        }
    }

    /**
     * componentDidMount() Load single record
     */
    componentDidMount() {
        this.fetchRecord()
    }

    /**
     * componentDidUpdate() Monitor for new record selected
     * then fetch new record.
     */
    componentDidUpdate(nextProps) {
        if (nextProps.match.params.recordId !== this.props.match.params.recordId) {
            this.fetchRecord()
        }
    }

    fetchRecord() {
        let recordId = this.props.match.params.recordId

        this.setState({
            loading: true
        })

        axios.defaults.headers.common["Authorization"] = localStorage.getItem("jwtToken")
        axios
            .get(process.env.REACT_APP_API_URI + "/records/" + recordId)
            .then(res => {
                this.setState({
                    record: res.data,
                    loading: false
                })
            })
            .catch(err => {
                console.log(err.response.data.message)
            })
    }

    render() {
        if (
            this.state.loading ||
            (Object.entries(this.state.record).length === 0 &&
                this.state.record.constructor === Object)
        ) {
            return "Loading..."
        } else {
            let groups = this.state.record.checked_groups

            groups = groups.map(group => (
                <div key={group._id}>
                    <h4>{group.group_id.name}</h4>
                    <hr />
                    
                    <ul className="list-unstyled">
                        {group.checks.map(check => (
                            <li key={check.code} className="media mb-3">
                                <Badge pill variant={check.passed ? 'success' : 'danger' } className="align-self-start mr-3" >
                                    {check.passed ? 'PASS' : 'FAIL' }
                                </Badge>
                                <div className="media-body">
                                    {group.group_id.checks.map(chk => (
                                        chk.code === check.code ? chk.title : ''
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))

            return (
                <>
                    <Link to="/home">Close</Link>
                    <p>
                        <Moment format="YYYY/MM/DD">
                            {this.state.record.date}
                        </Moment>{" "}
                        - STATUS *TODO DB
                    </p>
                    <p>Checklist: *Need to save</p>
                    {groups}
                </>
            )
        }
    }
}

export default RecordShow
