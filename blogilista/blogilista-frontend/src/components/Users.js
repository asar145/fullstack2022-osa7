import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Users = ({ users }) => {
  if (!users) {
    return null
  }
  return (
    <div>
      <h1>Users</h1>
      <Table striped>
        <thead>
          <tr key="tablekey">
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return [
              <tr key={user.id}>
                <td>
                  <Link style={{ paddingRight: 5 }} to={`/users/${user.id}`}>
                    {user.name}
                  </Link>
                </td>
                <td>{user.blogs.length.toString()}</td>
              </tr>
            ]
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
