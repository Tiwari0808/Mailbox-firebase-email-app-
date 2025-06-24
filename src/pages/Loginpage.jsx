import { useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import './loginpage.css';

const Loginpage = () => {
    const [isLogin, setisLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordInputRef = useRef();
    const api_key = 'AIzaSyDgWsZEMu5cguQm33Qy0mn-YuJBBSrB6uE';
    let url;
    const submitHandler = async (e) => {
        e.preventDefault();
        if (isLogin) {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`
        } else {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`
        }
        if (!isLogin && passwordInputRef.current.value !== confirmPasswordInputRef.current.value) {
            alert('Password did not matched');
            return;
        }
        try {
            setIsLoading(true)
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    email: emailInputRef.current.value,
                    password: passwordInputRef.current.value,
                    returnSecureToken: true,
                })
            })
            setIsLoading(false);
            const data = await res.json();
            const token = data.idToken;
            
            if (res.ok) {
                alert(isLogin ? 'Login Successful' : 'Signup Successful');
            } else {
                alert(data.error.message || 'Authentication Failed');
            }
        } catch (error) {
            console.log(error);
        }
        emailInputRef.current.value = '';
        passwordInputRef.current.value = '';
        if (!isLogin) {
            confirmPasswordInputRef.current.value = '';
        }
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
                                <div className='btn'>
                                    {isLoading && <Spinner />}
                                    {!isLoading && <Button id='btn1' type='submit'>{isLogin ? 'Login' : 'Sign Up'}</Button>}
                                </div>
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