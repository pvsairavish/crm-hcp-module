from langchain_core.tools import tool
from typing import Optional
from datetime import date

@tool
def log_interaction(
    hcp_name: str,
    interaction_type: str,
    date_of_meeting: str,
    topics_discussed: str,
    sentiment: str,
    materials_shared: Optional[str] = None,
    samples_distributed: Optional[str] = None,
    attendees: Optional[str] = None,
    outcomes: Optional[str] = None,
    follow_up_actions: Optional[str] = None
) -> dict:
    """
    Logs a new HCP interaction by extracting structured data from a natural
    language description. Returns all fields to populate the form.
    """
    return {
        "action": "log_interaction",
        "fields": {
            "hcp_name": hcp_name,
            "interaction_type": interaction_type,
            "date": date_of_meeting if date_of_meeting != "today" else str(date.today()),
            "topics_discussed": topics_discussed,
            "sentiment": sentiment,
            "materials_shared": materials_shared or "",
            "samples_distributed": samples_distributed or "",
            "attendees": attendees or "",
            "outcomes": outcomes or "",
            "follow_up_actions": follow_up_actions or ""
        }
    }

@tool
def edit_interaction(
    hcp_name: Optional[str] = None,
    interaction_type: Optional[str] = None,
    date_of_meeting: Optional[str] = None,
    topics_discussed: Optional[str] = None,
    sentiment: Optional[str] = None,
    materials_shared: Optional[str] = None,
    samples_distributed: Optional[str] = None,
    attendees: Optional[str] = None,
    outcomes: Optional[str] = None,
    follow_up_actions: Optional[str] = None
) -> dict:
    """
    Edits only the specified fields of an existing HCP interaction.
    Only provided (non-None) fields will be updated; everything else stays the same.
    """
    updates = {}
    if hcp_name: updates["hcp_name"] = hcp_name
    if interaction_type: updates["interaction_type"] = interaction_type
    if date_of_meeting: updates["date"] = date_of_meeting
    if topics_discussed: updates["topics_discussed"] = topics_discussed
    if sentiment: updates["sentiment"] = sentiment
    if materials_shared: updates["materials_shared"] = materials_shared
    if samples_distributed: updates["samples_distributed"] = samples_distributed
    if attendees: updates["attendees"] = attendees
    if outcomes: updates["outcomes"] = outcomes
    if follow_up_actions: updates["follow_up_actions"] = follow_up_actions

    return {"action": "edit_interaction", "fields": updates}

@tool
def suggest_follow_up(hcp_name: str, topics_discussed: str, sentiment: str) -> dict:
    """
    Suggests AI-generated follow-up actions based on meeting context,
    topics discussed, and sentiment observed during the HCP interaction.
    """
    suggestions = []
    if sentiment == "positive":
        suggestions.append(f"Schedule a follow-up meeting with {hcp_name} in 2 weeks")
        suggestions.append("Send product samples or latest clinical data")
    elif sentiment == "negative":
        suggestions.append(f"Address concerns raised by {hcp_name} with medical affairs")
        suggestions.append("Send tailored response addressing their objections")
    else:
        suggestions.append(f"Check in with {hcp_name} after 1 week")
        suggestions.append("Share relevant case studies on discussed topics")

    return {
        "action": "suggest_follow_up",
        "fields": {"follow_up_actions": "\n".join(suggestions)}
    }

@tool
def analyze_sentiment(conversation_text: str) -> dict:
    """
    Analyzes the sentiment of the described HCP interaction from natural language
    and returns positive, neutral, or negative sentiment classification.
    """
    text_lower = conversation_text.lower()
    if any(w in text_lower for w in ["positive", "happy", "interested", "enthusiastic", "agreed", "great"]):
        sentiment = "positive"
    elif any(w in text_lower for w in ["negative", "unhappy", "refused", "concerned", "objected", "skeptical"]):
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {"action": "analyze_sentiment", "fields": {"sentiment": sentiment}}

@tool
def summarize_interaction(raw_notes: str) -> dict:
    """
    Takes raw meeting notes or voice-to-text input and summarizes them
    into concise, structured topics discussed for the interaction form.
    """
    summary = raw_notes.strip()[:500]
    return {"action": "summarize_interaction", "fields": {"topics_discussed": summary}}