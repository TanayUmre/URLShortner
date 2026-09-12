import uvicorn
import random
import string
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel,HttpUrl

class RequestBody(BaseModel):
    url: HttpUrl

class ResponseBody(BaseModel):
    url: HttpUrl

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

@app.post("/shorten",response_model=ResponseBody)
def shorten_url(request:RequestBody):
    shortened_url="http://shrtned.com"
    return ResponseBody(url=shortened_url)


if __name__=="__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)