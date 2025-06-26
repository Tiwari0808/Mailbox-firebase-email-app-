import { Container, Nav, Navbar } from 'react-bootstrap'
import { FaMessage } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
// import './mainNavbar.css'

const MainNavbar = () => {
  return (
    <Navbar expand='lg'>
        <Container className='nav-content-div'>
          <Navbar.Brand><FaMessage /> Mailbox</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link as={Link} to={'/'}>Inbox</Nav.Link>
              <Nav.Link as={Link} to={'/composeMail'}>Send</Nav.Link>
              <Nav.Link as={Link} to={'/sentmail'}>Sent Mails</Nav.Link>
              <Nav.Link as={Link} to={'/login'}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
    </Navbar>
  )
}

export default MainNavbar
