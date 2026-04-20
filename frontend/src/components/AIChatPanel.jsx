import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFields } from "../store/interactionSlice";
import { sendChat } from "../services/api";

const styles = {
  container: {
    background: "#fff",
    borderRadius: 12,
    padding: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "16px 20px",
    color: "#fff",
  },
  headerTitle: { fontWeight: 700, fontSize: 15 },
  headerSub: { fontSize: 12, opacity: 0.85, marginTop: 2 },
  messages: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  userBubble: {
    alignSelf: "flex-end",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    borderRadius: "16px 16px 4px 16px",
    padding: "10px 14px",
    maxWidth: "80%",
    fontSize: 14,
  },
  aiBubble: {
    alignSelf: "flex-start",
    background: "#f0f4ff",
    color: "#1a1a2e",
    borderRadius: "16px 16px 16px 4px",
    padding: "10px 14px",
    maxWidth: "80%",
    fontSize: 14,
  },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderTop: "1px solid #eef0f6",
    background: "#fafbff",
  },
  input: {
    flex: 1,
    border: "1px solid #dde3f0",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
  },
  sendBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
  tag: {
    display: "inline-block",
    background: "#e8eeff",
    color: "#667eea",
    borderRadius: 4,
    padding: "2px 7px",
    fontSize: 11,
    marginTop: 6,
    fontWeight: 600,
  },
};

const WELCOME = {
  role: "ai",
  text: 'Hi! I\'m your AI assistant. Describe your HCP interaction and I\'ll fill the form for you.\n\nTry: "Today I met Dr. Smith, discussed Product X efficacy, sentiment was positive, shared brochures."',
};

export default function AIChatPanel() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const formState = useSelector((s) => s.interaction);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await sendChat(text, formState);
      if (res.form_updates && Object.keys(res.form_updates).length > 0) {
        dispatch(updateFields(res.form_updates));
      }
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: res.ai_message || "Form updated!",
          actions: res.actions || [],
        },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Error connecting to backend. Please check the server." }]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>🤖 AI Assistant</div>
        <div style={styles.headerSub}>Log interaction via chat</div>
      </div>

      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} style={m.role === "user" ? styles.userBubble : styles.aiBubble}>
            {m.text}
            {m.actions?.length > 0 && (
              <div style={{ marginTop: 6 }}>
                {m.actions.map((a, j) => (
                  <span key={j} style={styles.tag}>⚡ {a}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div style={styles.aiBubble}>⏳ Processing...</div>}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Describe interaction..."
        />
        <button style={styles.sendBtn} onClick={send}>Log</button>
      </div>
    </div>
  );
}