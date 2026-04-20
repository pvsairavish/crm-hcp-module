from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from tools import (
    log_interaction,
    edit_interaction,
    suggest_follow_up,
    analyze_sentiment,
    summarize_interaction
)
from dotenv import load_dotenv
import os, json, time

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0
)

tools = [
    log_interaction,
    edit_interaction,
    suggest_follow_up,
    analyze_sentiment,
    summarize_interaction
]

agent = create_react_agent(llm, tools)

def run_agent(user_message: str, current_form_state: dict = None) -> dict:
    time.sleep(2)

    system_prompt = """You are an AI assistant for a pharmaceutical CRM system.
Your job is to help field representatives log and manage HCP interactions.
When the user describes a meeting, extract all details and call the appropriate tool.
When the user wants to correct something, call edit_interaction with only changed fields.
Always use the provided tools.
Today's date is available if user says 'today'.

Current form state:
""" + json.dumps(current_form_state or {}, indent=2)

    result = agent.invoke({
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    })

    messages = result.get("messages", [])
    tool_results = []
    ai_text = ""

    for msg in messages:
        if hasattr(msg, "content"):
            if hasattr(msg, "type") and msg.type == "tool":
                try:
                    tool_results.append(json.loads(msg.content))
                except Exception:
                    pass
            elif hasattr(msg, "type") and msg.type == "ai":
                if isinstance(msg.content, str) and msg.content.strip():
                    ai_text = msg.content

    merged_fields = {}
    for r in tool_results:
        if isinstance(r, dict) and "fields" in r:
            merged_fields.update(r["fields"])

    return {
        "ai_message": ai_text or "Done! I've updated the form for you.",
        "form_updates": merged_fields,
        "actions": [r.get("action") for r in tool_results if "action" in r]
    }