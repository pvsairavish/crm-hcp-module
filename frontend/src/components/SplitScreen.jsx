import React from "react";
import InteractionForm from "./InteractionForm";
import AIChatPanel from "./AIChatPanel";

export default function SplitScreen() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gap: 20,
      height: "calc(100vh - 40px)",
      padding: 20,
    }}>
      <InteractionForm />
      <AIChatPanel />
    </div>
  );
}