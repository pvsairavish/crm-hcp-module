# CRM HCP Module – AI-First Log Interaction Screen

An AI-powered Customer Relationship Management (CRM) system for Healthcare Professionals (HCPs), built for Life Science field representatives. The system features a split-screen interface where an AI chat assistant automatically fills and edits interaction forms using natural language.

---

## 🚀 Features

- Split-screen UI: Interaction Form (left) + AI Chat Assistant (right)
- AI-driven form filling — no manual input required
- 5 LangGraph tools powered by Groq LLM
- SQLite database for storing interactions
- Built with React + Redux (frontend) and FastAPI + LangGraph (backend)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux Toolkit |
| Backend | Python, FastAPI |
| AI Agent | LangGraph, LangChain |
| LLM | Groq (llama-3.3-70b-versatile) |
| Database | SQLite |
| Font | Google Inter |

---

## 📁 Project Structure
crm-hcp-module/
├── backend/
│   ├── main.py          # FastAPI app and routes
│   ├── agent.py         # LangGraph agent setup
│   ├── tools.py         # 5 LangGraph tools
│   ├── database.py      # SQLAlchemy DB setup
│   ├── models.py        # Database models
│   ├── schemas.py       # Pydantic schemas
│   ├── requirements.txt # Python dependencies
│   └── .env             # API keys and DB URL
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InteractionForm.jsx   # Left panel form
│   │   │   ├── AIChatPanel.jsx       # Right panel chat
│   │   │   └── SplitScreen.jsx       # Layout wrapper
│   │   ├── store/
│   │   │   ├── index.js              # Redux store
│   │   │   └── interactionSlice.js   # Redux slice
│   │   ├── services/
│   │   │   └── api.js                # Axios API calls
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API Key — get it free at https://console.groq.com

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/crm-hcp-module.git
cd crm-hcp-module
```

---

### 2. Backend Setup

```bash
cd backend
```

Create a `.env` file:
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=sqlite:///./crm_hcp.db

Install dependencies:
```bash
pip install -r requirements.txt
```

Start the backend server:
```bash
uvicorn main:app --reload --port 8000
```

Backend will run at: `http://localhost:8000`
API docs available at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will run at: `http://localhost:3000`

---

## 🤖 LangGraph Tools

| # | Tool | Description |
|---|---|---|
| 1 | `log_interaction` | Extracts HCP name, date, sentiment, topics from natural language and fills the form |
| 2 | `edit_interaction` | Updates only specified fields without touching others |
| 3 | `suggest_follow_up` | Generates follow-up action suggestions based on meeting context and sentiment |
| 4 | `analyze_sentiment` | Classifies HCP sentiment as positive, neutral, or negative |
| 5 | `summarize_interaction` | Condenses raw meeting notes into structured topics discussed |

---

## 💬 Example Chat Messages to Test

**Log a new interaction:**
Today I met Dr. Smith, discussed Product X efficacy, sentiment was positive, shared brochures

**Edit an existing interaction:**
Sorry, the name was actually Dr. John and the sentiment was negative

**Suggest follow-up actions:**
Suggest follow-up actions for Dr. Smith based on our meeting

**Analyze sentiment:**
The doctor was very enthusiastic and agreed to try the product

**Summarize notes:**
Summarize this: discussed oncology drug dosage, side effects, patient feedback and clinical trial results

---

## 🔑 How to Get Groq API Key

1. Go to https://console.groq.com
2. Sign up or log in
3. Click **API Keys** in the left sidebar
4. Click **Create API Key**
5. Copy the key and paste it in `backend/.env`

---

## 📌 Important Notes

- Do NOT fill the left form manually — use the AI chat to populate it
- LangGraph and Groq LLM are mandatory — no hardcoded logic
- Free tier Groq limit: 100,000 tokens/day — create a new account if limit is reached
- SQLite database file `crm_hcp.db` is auto-created on first run

---

