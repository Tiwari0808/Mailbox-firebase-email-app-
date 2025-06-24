import { useState } from "react";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, set } from "firebase/database";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import './ComposeMail.css';
import { encodeEmail } from "./encodeEmail";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

const ComposeMail = ({ senderEmail }) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attemptedSend, setAttemptedSend] = useState(false);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit, Highlight, TextStyle],
    content: "",
  });

  const resetForm = () => {
    setTo("");
    setSubject("");
    editor.commands.clearContent();
    setAttemptedSend(false);
  };

  const sendMail = async (e) => {
    e.preventDefault();
    setAttemptedSend(true);

    if (!to || !subject || !editor?.getText()?.trim()) {
      if (!to) toast.error("Recipient is required");
      else if (!subject) toast.error("Subject is required");
      else toast.error("Email content cannot be empty");
      return;
    }

    setIsSending(true);

    try {
      const body = editor.getHTML();
      const id = uuidv4();

      const encodedTo = encodeEmail(to);
      const encodedSender = encodeEmail(senderEmail);

      const mail = {
        id,
        from: senderEmail,
        to,
        subject,
        body,
        timestamp: new Date().toISOString(),
      };

      await set(ref(db, `mails/${encodedTo}/inbox/${id}`), mail);
      await set(ref(db, `mails/${encodedSender}/sent/${id}`), mail);

      toast.success("Email sent successfully!");
      navigate("/inbox");
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
      console.error("Send error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container className="compose-container">
      <Row className="justify-content-center">
        <Col lg={8} xl={9}>
          <Card className="compose-card">
            <Card.Header className="compose-header">
              <h5>New Message</h5>
              <div className="compose-actions">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={resetForm}
                  disabled={isSending}
                >
                  Discard
                </Button>
              </div>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={sendMail}>
                <Form.Group className="mb-3">
                  <Form.Control
                    autoFocus
                    placeholder="To"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    isInvalid={attemptedSend && !to}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a recipient
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    isInvalid={attemptedSend && !subject}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a subject
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="editor-box mb-3">
                  <EditorContent editor={editor} />
                </div>

                <div className="compose-footer">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Sending...
                      </>
                    ) : "Send"}
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


