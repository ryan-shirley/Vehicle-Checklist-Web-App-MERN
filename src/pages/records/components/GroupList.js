import { Badge, Table } from "react-bootstrap"

/**
 * GroupList() List all the groups of checks that need to be preformed
 */
const GroupList = (props) => {
    const rows = props.groups.map((group) => (
        <tr
            key={group._id}
            onClick={() => props.onClick(group._id)}
            className={`omc-inspection__row${group.completed ? " is-done" : ""}`}
        >
            <td className="omc-inspection__row-name">{group.check_group_id.name}</td>
            <td className="omc-inspection__row-badge">
                <Badge
                    pill
                    variant={group.completed ? "success" : "danger"}
                    className={`omc-inspection__badge ${group.completed ? "omc-inspection__badge--done" : "omc-inspection__badge--not-done"}`}
                >
                    {group.completed ? "Done" : "Not Done"}
                </Badge>
            </td>
        </tr>
    ))

    return (
        <Table hover className="clickable-rows">
            <thead>
                <tr>
                    <th>Checks</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </Table>
    )
}

export default GroupList
