import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, get, remove } from "firebase/database";
import { Accordion, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";

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

      fetchedMails.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMails(fetchedMails);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userUid]);

  const handleDelete = async (mailId) => {
    try {
      await remove(ref(db, `userMails/${userUid}/inbox/${mailId}`));
      setMails((prev) => prev.filter((mail) => mail.id !== mailId));
    } catch (error) {
      console.error("Failed to delete mail:", error);
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">📥 Inbox</Card.Title>

              {loading ? (
                <Spinner animation="border" />
              ) : mails.length === 0 ? (
                <p className="text-muted">No mails found.</p>
              ) : (
                <Accordion defaultActiveKey="0" alwaysOpen>
                  {mails.map((mail, index) => (
                    <Accordion.Item eventKey={String(index)} key={mail.id}>
                      <Accordion.Header>
                        <div className="w-100 d-flex justify-content-between align-items-center">
                          <div className="flex-grow-1">
                            <strong className="text-truncate">{mail.subject}</strong>
                            <div className="text-muted small">From: {mail.from}</div>
                          </div>
                          <small className="text-muted ms-2">
                            {new Date(mail.timestamp).toLocaleString()}
                          </small>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div dangerouslySetInnerHTML={{ __html: mail.body }} />
                        <div className="text-end mt-3">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(mail.id)}
                          >
                            Delete
                          </Button>
                        </div>
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

 


