import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, set } from "firebase/database";
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
import { getRecieverUid } from "../store/ReceiverUid";

const ComposeMail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isValidRecipient, setIsValidRecipient] = useState(null); // null | true | false
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const senderEmail = localStorage.getItem("user_email");
  const senderUid = localStorage.getItem("user_id");

  const resetForm = () => {
    setTo("");
    setSubject("");
    setBody("");
    setIsValidRecipient(null);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!to || !to.includes("@") || !to.includes('.')) {
        setIsValidRecipient(null);
        return;
      }
      setIsChecking(true);
      const uid = await getRecieverUid(to);
      setIsValidRecipient(!!uid);
      setIsChecking(false);
    }, 500); // debounce time

    return () => clearTimeout(delayDebounce);
  }, [to]);

  const sendMail = async (e) => {
    e.preventDefault();

    if (!to || !subject || !body.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSending(true);

      const id = Date.now().toString();  
      const mail = {
        id,
        from: senderEmail,
        to,
        subject,
        body,
        timestamp: new Date().toISOString(),
      };

      const receiverUid = await getRecieverUid(to);
      if (!receiverUid) {
        toast.error("Recipient is not a registered user");
        setIsSending(false);
        return;
      }

      await set(ref(db, `mails/${mail.id}`), mail);
      await set(ref(db, `userMails/${senderUid}/sent/${mail.id}`), true);
      await set(ref(db, `userMails/${receiverUid}/inbox/${mail.id}`), true);

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
                <Form.Group className="mb-2">
                  <Form.Control
                    type="email"
                    placeholder="To"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                    isInvalid={isValidRecipient === false}
                    isValid={isValidRecipient === true}
                  />
                  {isChecking && <Form.Text className="text-muted">Checking user...</Form.Text>}
                  {!isChecking && isValidRecipient === false && (
                    <Form.Text className="text-danger">❌ Recipient not found</Form.Text>
                  )}
                  {!isChecking && isValidRecipient === true && (
                    <Form.Text className="text-success">✅ Valid recipient</Form.Text>
                  )}
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





