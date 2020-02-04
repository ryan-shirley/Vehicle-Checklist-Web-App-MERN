import React from "react"
import { Table } from "react-bootstrap"

/**
 * GroupList() List all the groups of checks that need to be preformed
 */
const GroupList = props => {

    let rows = props.groups.map(group => (
        <tr
            key={group._id}
            onClick={() => props.onClick(group._id)}
        >
            <td>{group.check_group_id.name}</td>
            <td>{group.completed === undefined ? 'Not Done' : 'Done' }</td>
        </tr>
    ))

    return (
        <Table hover>
            <thead>
                <tr>
                    <th>Checks</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    )
}

export default GroupList
