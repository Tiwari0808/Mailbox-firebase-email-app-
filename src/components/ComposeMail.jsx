import { useState } from "react";
import { db } from "../firebase";
import { ref, push, set } from "firebase/database";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa6";


const encodeEmail = (email) =>
  email.replace(/\./g, "_dot_").replace(/@/g, "_at_");

const ComposeMail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const senderEmail = localStorage.getItem("user_email");
  const senderUid = localStorage.getItem("user_id");

  const resetForm = () => {
    setTo("");
    setSubject("");
    setBody("");
  };

  const sendMail = async (e) => {
    e.preventDefault();

    if (!to || !subject || !body.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSending(true);

      const encodedTo = encodeEmail(to);
      const mail = {
        from: senderEmail,
        to,
        subject,
        body,
        timestamp: new Date().toISOString(),
      };

      const id = Date.now().toString();  

      await set(ref(db,`mails/${encodedTo}/inbox/${id}`),mail);
      await set(ref(db,`mails/${senderUid}/sent/${id}`),mail);

      toast.success("Email sent successfully!");
      resetForm();
      navigate("/");
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
      console.error("Send error:", error);
    } finally {
      setIsSending(false);
    }
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
              <Form onSubmit={sendMail}>
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




