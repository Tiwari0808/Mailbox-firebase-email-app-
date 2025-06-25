import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { encodeEmail } from "./encodeEmail";
import { Accordion, Card, Col, Container, Row } from "react-bootstrap";

const Inbox = () => {
  const [mails, setMails] = useState([]);
  const userEmail = localStorage.getItem('user_email');
  useEffect(() => {
    if (!userEmail) return;

    const encodedEmail = encodeEmail(userEmail);
    const inboxRef = ref(db, `mails/${encodedEmail}/inbox`);

    const unsubscribe = onValue(inboxRef, (snapshot) => {
      const data = snapshot.val() || {};
      setMails(Object.values(data));
    });

    return () => unsubscribe();
  }, [userEmail]);

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">📥 Inbox</Card.Title>

              {mails.length === 0 ? (
                <p className="text-muted">No mails found.</p>
              ) : (
                <Accordion defaultActiveKey="0" alwaysOpen>
                  {mails.map((mail, index) => (
                    <Accordion.Item eventKey={String(index)} key={mail.id}>
                      <Accordion.Header>
                        <div className="w-100 d-flex flex-column">
                          <div className="d-flex justify-content-between">
                            <strong className="text-truncate">{mail.subject}</strong>
                            <small className="text-muted">
                              {new Date(mail.timestamp).toLocaleString()}
                            </small>
                          </div>
                          <small className="text-muted text-truncate">
                            From: {mail.from}
                          </small>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div
                          className="email-body"
                          dangerouslySetInnerHTML={{ __html: mail.body }}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Inbox;


