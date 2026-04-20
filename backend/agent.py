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
from groq import RateLimitError

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0,
    max_tokens=512
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
    time.sleep(3)

    system_prompt = """You are a CRM AI assistant for pharmaceutical field reps.
Extract HCP interaction details and call the correct tool.
For new interactions use log_interaction.
For corrections use edit_interaction with only changed fields.
Keep responses brief.

Current form:
""" + json.dumps(current_form_state or {}, indent=2)

    for attempt in range(3):
        try:
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
                "ai_message": ai_text or "Done! Form updated.",
                "form_updates": merged_fields,
                "actions": [r.get("action") for r in tool_results if "action" in r]
            }

        except RateLimitError as e:
            wait = 15 * (attempt + 1)
            print(f"Rate limit hit. Waiting {wait}s before retry {attempt + 1}/3...")
            time.sleep(wait)

    return {
        "ai_message": "Rate limit reached. Please wait 30 seconds and try again.",
        "form_updates": {},
        "actions": []
    }