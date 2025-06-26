import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, get } from "firebase/database";
import { Accordion, Card, Col, Container, Row, Spinner } from "react-bootstrap";

const Inbox = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const userUid = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userUid) return;

    const inboxRef = ref(db, `userMails/${userUid}/inbox`);

    const unsubscribe = onValue(inboxRef, async (snapshot) => {
      const inboxData = snapshot.val();
      if (!inboxData) {
        setMails([]);
        setLoading(false);
        return;
      }

      const mailIds = Object.keys(inboxData);
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
  }, [userUid]);

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">📥 Inbox</Card.Title>

              {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
              ) : mails.length === 0 ? (
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
                        <p>{mail.body}</p>
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
 


