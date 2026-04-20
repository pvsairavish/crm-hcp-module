import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateFields, resetForm } from "../store/interactionSlice";
import { saveInteraction } from "../services/api";

const styles = {
  container: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    height: "100%",
    overflowY: "auto",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#1a1a2e" },
  row: { display: "flex", gap: 16, marginBottom: 16 },
  group: { display: "flex", flexDirection: "column", flex: 1, gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#444" },
  input: {
    border: "1px solid #dde3f0",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 14,
    color: "#1a1a2e",
    background: "#f9fafb",
    outline: "none",
    width: "100%",
  },
  textarea: {
    border: "1px solid #dde3f0",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 14,
    color: "#1a1a2e",
    background: "#f9fafb",
    minHeight: 72,
    resize: "vertical",
    width: "100%",
  },
  sentimentRow: { display: "flex", gap: 20, alignItems: "center" },
  sentimentOption: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 },
  saveBtn: {
    marginTop: 20,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "11px 28px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
  },
  aiSuggest: { background: "#f0f4ff", borderRadius: 8, padding: 12, marginTop: 12 },
  aiSuggestTitle: { fontSize: 12, fontWeight: 700, color: "#667eea", marginBottom: 6 },
  aiSuggestItem: { fontSize: 13, color: "#444", marginBottom: 4 },
};

export default function InteractionForm() {
  const form = useSelector((s) => s.interaction);
  const dispatch = useDispatch();

  const set = (field) => (e) => dispatch(updateFields({ [field]: e.target.value }));

  const handleSave = async () => {
    try {
      await saveInteraction(form);
      alert("Interaction saved!");
      dispatch(resetForm());
    } catch {
      alert("Error saving. Check backend.");
    }
  };

  const aiFollowUps = form.follow_up_actions
    ? form.follow_up_actions.split("\n").filter(Boolean)
    : [];

  return (
    <div style={styles.container}>
      <div style={styles.title}>Log HCP Interaction</div>

      <div style={styles.row}>
        <div style={styles.group}>
          <label style={styles.label}>HCP Name</label>
          <input style={styles.input} value={form.hcp_name} onChange={set("hcp_name")} placeholder="Search or select HCP..." readOnly />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Interaction Type</label>
          <select style={styles.input} value={form.interaction_type} onChange={set("interaction_type")}>
            {["Meeting", "Call", "Email", "Conference", "Other"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.group}>
          <label style={styles.label}>Date</label>
          <input style={styles.input} type="date" value={form.date} onChange={set("date")} />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Time</label>
          <input style={styles.input} type="time" value={form.time} onChange={set("time")} />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>Attendees</label>
        <input style={styles.input} value={form.attendees} onChange={set("attendees")} placeholder="Enter names or search..." />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>Topics Discussed</label>
        <textarea style={styles.textarea} value={form.topics_discussed} onChange={set("topics_discussed")} placeholder="Enter key discussion points..." />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>Materials Shared</label>
        <input style={styles.input} value={form.materials_shared} onChange={set("materials_shared")} placeholder="E.g., Brochure, Clinical Data..." />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>Samples Distributed</label>
        <input style={styles.input} value={form.samples_distributed} onChange={set("samples_distributed")} placeholder="E.g., 5 units of Drug X..." />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>Observed/Inferred HCP Sentiment</label>
        <div style={styles.sentimentRow}>
          {["positive", "neutral", "negative"].map((s) => (
            <label key={s} style={styles.sentimentOption}>
              <input
                type="radio"
                name="sentiment"
                value={s}
                checked={form.sentiment === s}
                onChange={set("sentiment")}
              />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>Outcomes</label>
        <textarea style={styles.textarea} value={form.outcomes} onChange={set("outcomes")} placeholder="Key outcomes or agreements..." />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>Follow-up Actions</label>
        <textarea style={styles.textarea} value={form.follow_up_actions} onChange={set("follow_up_actions")} placeholder="Enter next steps or tasks..." />
      </div>

      {aiFollowUps.length > 0 && (
        <div style={styles.aiSuggest}>
          <div style={styles.aiSuggestTitle}>🤖 AI Suggested Follow-ups:</div>
          {aiFollowUps.map((item, i) => (
            <div key={i} style={styles.aiSuggestItem}>• {item}</div>
          ))}
        </div>
      )}

      <button style={styles.saveBtn} onClick={handleSave}>Save Interaction</button>
    </div>
  );
}