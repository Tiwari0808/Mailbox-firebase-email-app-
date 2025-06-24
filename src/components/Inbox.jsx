import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { encodeEmail } from "./encodeEmail"; // ✅ correctly imported

const Inbox = ({ userEmail }) => {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const encodedEmail = encodeEmail(userEmail); // ✅ sanitize email
    const inboxRef = ref(db, `mails/${encodedEmail}/inbox`);
    
    const unsubscribe = onValue(inboxRef, (snapshot) => {
      const data = snapshot.val() || {};
      setMails(Object.values(data));
    });

    return () => unsubscribe(); // Optional cleanup
  }, [userEmail]);

  return (
    <div>
      <h2>Inbox</h2>
      {mails.length === 0 ? (
        <p>No mails found.</p>
      ) : (
        mails.map((mail) => (
          <div key={mail.id} className="border p-3 mb-2">
            <strong>From:</strong> {mail.from}
            <br />
            <strong>Subject:</strong> {mail.subject}
            <br />
            <div dangerouslySetInnerHTML={{ __html: mail.body }} />
          </div>
        ))
      )}
    </div>
  );
};

export default Inbox;

