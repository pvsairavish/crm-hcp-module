from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from models import Interaction
from schemas import ChatRequest, InteractionSchema
from agent import run_agent

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    current_state = request.current_form_state.dict() if request.current_form_state else {}
    result = run_agent(request.message, current_state)
    return result

@app.post("/interactions")
def save_interaction(data: InteractionSchema, db: Session = Depends(get_db)):
    interaction = Interaction(**data.dict())
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return {"id": interaction.id, "message": "Interaction saved successfully"}

@app.get("/interactions")
def get_interactions(db: Session = Depends(get_db)):
    return db.query(Interaction).all()