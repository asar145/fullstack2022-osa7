import { Link } from 'react-router-dom'
import { Navbar, Nav, Button } from 'react-bootstrap'

const Menu = ({ name, handleLogout }) => (
  <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="#" as="span">
          <Link style={{ paddingRight: 5 }} to="/">
            blogs
          </Link>
        </Nav.Link>
        <Nav.Link href="#" as="span">
          <Link style={{ paddingRight: 5 }} to="/users">
            users
          </Link>
        </Nav.Link>
        <Nav.Link href="#" as="span">
          {name} logged in{' '}
          <Button variant="outline-secondary" onClick={() => handleLogout()}>
            {' '}
            logout{' '}
          </Button>
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default Menu
