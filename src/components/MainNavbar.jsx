import { Container, Nav, Navbar } from 'react-bootstrap'
import { FaMessage } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { logout } from '../store/logout'
import { useState } from 'react'
// import './mainNavbar.css'

const MainNavbar = () => {
   const [isAuth,setIsAuth] = useState(false);
   const authHandeler = ()=>{
    setIsAuth((!!localStorage.getItem('user_id')))
   }
  
  
  return (
    <Navbar expand='lg'>
        <Container className='nav-content-div'>
          <Navbar.Brand><FaMessage /> Mailbox</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              {isAuth&&<Nav.Link as={Link} to={'/'}>Inbox</Nav.Link>}
              {isAuth&&<Nav.Link as={Link} to={'/composeMail'}>Send</Nav.Link>}
              {isAuth&&<Nav.Link as={Link} to={'/sentmail'}>Sent Mails</Nav.Link>}
              <Nav.Link onClick={()=>logout()} as={Link} to={'/login'}>{isAuth?'Logout':'Login'}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
    </Navbar>
  )
}

export default MainNavbar
