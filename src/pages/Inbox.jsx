import { useEffect, useState } from "react";
import { ref, onValue, get, remove } from "firebase/database";
import { db } from "../store/firebase";
import { FaTrash } from "react-icons/fa";

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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
        📥 Inbox
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : mails.length === 0 ? (
        <p className="text-gray-500 text-center">No mails found.</p>
      ) : (
        <div className="space-y-4">
          {mails.map((mail) => (
            <div
              key={mail.id}
              className="bg-white shadow-sm rounded-lg border border-gray-200"
            >
              <details className="group open:bg-gray-50 transition">
                <summary className="flex items-center justify-between px-5 py-3 cursor-pointer list-none group-open:border-b">
                  <div className="flex flex-col">
                    <span className="font-medium text-lg text-gray-800 truncate">
                      {mail.subject}
                    </span>
                    <span className="text-sm text-gray-500">From: {mail.from}</span>
                  </div>
                  <div className="text-sm text-gray-400 ml-4">
                    {new Date(mail.timestamp).toLocaleString()}
                  </div>
                </summary>

                <div className="px-5 py-4 border-t text-sm text-gray-700">
                  <div
                    className="mb-4"
                    dangerouslySetInnerHTML={{ __html: mail.body }}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(mail.id)}
                      className="flex items-center gap-2 text-red-500 border border-red-300 px-3 py-1 rounded-md text-sm hover:bg-red-50 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;
