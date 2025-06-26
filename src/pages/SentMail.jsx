import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, get } from "firebase/database";
import { Accordion, Card, Col, Container, Row, Spinner } from "react-bootstrap";

const SentMail = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const senderUid = localStorage.getItem("user_id");

  useEffect(() => {
    if (!senderUid) return;

    const sentRef = ref(db, `userMails/${senderUid}/sent`);

    const unsubscribe = onValue(sentRef, async (snapshot) => {
      const sentData = snapshot.val();

      if (!sentData) {
        setMails([]);
        setLoading(false);
        return;
      }

      const mailIds = Object.keys(sentData);
      const fetchedMails = [];

      for (const id of mailIds) {
        const mailSnap = await get(ref(db, `mails/${id}`));
        if (mailSnap.exists()) {
          fetchedMails.push(mailSnap.val());
        }
      }

      // Sort newest first
      fetchedMails.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMails(fetchedMails);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [senderUid]);

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">📤 Sent Mails</Card.Title>

              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" />
                </div>
              ) : mails.length === 0 ? (
                <p className="text-muted">No sent mails.</p>
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
                            To: {mail.to}
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

export default SentMail;
