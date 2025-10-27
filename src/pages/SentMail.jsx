import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { db } from "../store/firebase";

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

      fetchedMails.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMails(fetchedMails);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [senderUid]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">📤 Sent Mails</h2>

        {loading ? (
          <div className="text-center py-10">
            <svg className="animate-spin h-6 w-6 text-blue-500 mx-auto" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        ) : mails.length === 0 ? (
          <p className="text-gray-500 text-center">No sent mails.</p>
        ) : (
          <div className="space-y-4">
            {mails.map((mail, index) => (
              <details
                key={mail.id}
                className="bg-gray-50 border rounded-lg p-4 shadow-sm transition duration-200 hover:shadow-md"
              >
                <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
                  <div>
                    <div className="text-blue-600 font-semibold">{mail.subject}</div>
                    <div className="text-sm text-gray-500 truncate">To: {mail.to}</div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(mail.timestamp).toLocaleString()}
                  </div>
                </summary>

                <div className="mt-4 border-t pt-3 text-sm text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: mail.body }} />
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentMail;