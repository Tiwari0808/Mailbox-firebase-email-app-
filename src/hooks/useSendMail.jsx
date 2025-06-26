import { useState } from "react";
import { ref, set } from "firebase/database";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { db } from "../store/firebase";
import { getRecieverUid } from "../store/ReceiverUid";

export const useSendMail = () => {
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const sendMail = async ({ to, subject, body, senderEmail, senderUid, onSuccess }) => {
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

      await set(ref(db, `mails/${id}`), mail);
      await set(ref(db, `userMails/${senderUid}/sent/${id}`), true);
      await set(ref(db, `userMails/${receiverUid}/inbox/${id}`), true);

      toast.success("Email sent successfully!");
      onSuccess?.(); // optional callback like form reset + navigate
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
      console.error("Send error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return { sendMail, isSending };
};
