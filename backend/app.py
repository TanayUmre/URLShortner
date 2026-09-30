import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base,engine
from schemas import URLCreate,URLResponse
from crud import add_url,add_user
import models

Base.metadata.create_all(engine)

app=FastAPI()

origin=[
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

add_user(
    "Test User",
    "test@example.com",
    "password123"
)

@app.post("/shorten",response_model=URLResponse)
def shorten_url(request:URLCreate):
    shortened_url=add_url(1,str(request.url))
    return URLResponse(url=shortened_url)


if __name__=="__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)