import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa6";
import { useSendMail } from "../hooks/useSendMail";
import { toast } from "react-toastify";
import { getRecieverUid } from "../store/ReceiverUid";

const ComposeMail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientValid, setRecipientValid] = useState(true);

  const navigate = useNavigate();

  const senderEmail = localStorage.getItem("user_email");
  const senderUid = localStorage.getItem("user_id");

  const { sendMail, isSending } = useSendMail();

  // 🔍 Real-time recipient check
  useEffect(() => {
    const checkRecipient = async () => {
      if (!to.trim()) {
        setRecipientValid(true);
        return;
      }

      const uid = await getRecieverUid(to);
      setRecipientValid(!!uid);
    };

    const delay = setTimeout(checkRecipient, 500); // debounce

    return () => clearTimeout(delay);
  }, [to]);

  const resetForm = () => {
    setTo("");
    setSubject("");
    setBody("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const receiverUid = await getRecieverUid(to);

    if (!receiverUid) {
      toast.error("Recipient is not a registered user");
      return;
    }

    sendMail({
      to,
      subject,
      body,
      senderEmail,
      senderUid,
      receiverUid,
      onSuccess: () => {
        resetForm();
        navigate("/");
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="flex items-center justify-between bg-blue-100 px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-blue-700">New Message</h2>
          <button
            onClick={resetForm}
            disabled={isSending}
            className="text-red-500 border border-red-300 px-3 py-1 rounded hover:bg-red-50 text-sm transition disabled:opacity-50"
          >
            Discard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <input
              type="email"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                recipientValid
                  ? "border-gray-300 focus:ring-blue-400"
                  : "border-red-500 focus:ring-red-400"
              }`}
            />
            {!recipientValid && (
              <p className="text-sm text-red-500 mt-1">User not found</p>
            )}
          </div>

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            rows={8}
            placeholder="Write your message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSending ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
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
              ) : (
                <>
                  <FaPaperPlane />
                  Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeMail;