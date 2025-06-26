import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa6";
import { useSendMail } from "../hooks/useSendMail";

const ComposeMail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const senderEmail = localStorage.getItem("user_email");
  const senderUid = localStorage.getItem("user_id");

  const { sendMail, isSending } = useSendMail();

  const resetForm = () => {
    setTo("");
    setSubject("");
    setBody("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMail({
      to,
      subject,
      body,
      senderEmail,
      senderUid,
      onSuccess: () => {
        resetForm();
        navigate("/");
      },
    });
  };

  return (
    <Container className="compose-container mt-5">
      <Row className="justify-content-center">
        <Col lg={8} xl={9}>
          <Card className="compose-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>New Message</h5>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={resetForm}
                disabled={isSending}
              >
                Discard
              </Button>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="To"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Write your message..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="compose-footer">
                  <Button variant="primary" type="submit" disabled={isSending}>
                    {isSending ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <FaPaperPlane />
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ComposeMail;





