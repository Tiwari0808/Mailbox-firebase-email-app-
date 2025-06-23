import { useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import './loginpage.css';

const Loginpage = () => {
    const [isLogin, setisLogin] = useState(false);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordInputRef = useRef();
    const submitHandler = (e) => {
        e.preventDefault();
        console.log(emailInputRef.current.value);
        console.log(passwordInputRef.current.value);
        console.log(confirmPasswordInputRef.current.value);
    }

    return (
        <Container>
            <Row id='main-row'>
                <Col md={5} lg={3}>
                    <Card>
                        <Card.Body id='form-body'>
                            <Card.Title>{isLogin ? 'Login' : 'Sign Up'}</Card.Title>
                            <Form className='form-input' onSubmit={submitHandler}>
                                <Form.Group className="">
                                    <Form.Control ref={emailInputRef} type="email" placeholder="Email" required />
                                    <Form.Control ref={passwordInputRef} type='password' placeholder='Password' required />
                                    {!isLogin && <Form.Control ref={confirmPasswordInputRef} type='password' placeholder='Confirm Password' required />}
                                </Form.Group>
                                <div className='btn'><Button id='btn1' type='submit'>{isLogin ? 'Login' : 'Sign Up'}</Button></div>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className='btn'><Button onClick={() => setisLogin(!isLogin)} variant="warning">{!isLogin ? 'Have an account? Login' : 'Sign Up Now'}</Button></div>
                </Col>
            </Row>
        </Container>
    )
}

export default Loginpage;