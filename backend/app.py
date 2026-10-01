import uvicorn
from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from database import Base,engine
from schemas import URLCreate,URLResponse,UserCreate,UserLogin
from crud import add_url,add_user,get_user
from auth import create_access_token,get_current_user
from models import User

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

@app.post("/shorten",response_model=URLResponse)
def shorten_url(request:URLCreate,current_user:User=Depends(get_current_user)):
    shortened_url=add_url(current_user.id,str(request.url))
    return URLResponse(url=shortened_url)

@app.post("/signup")
def signup_user(request:UserCreate):
    add_user(request.name,request.email,request.password)
    return {"message":"User created successfully"}

@app.post("/login")
def login_user(request:UserLogin):
    user=get_user(request.email,request.password)
    if not user:
        return {"message":"Invalid email or password"}
    tkn=create_access_token(user.id)
    return {"message":"Login successful","access_token":tkn}

@app.get("/me")
def get_me(current_user:User=Depends(get_current_user)):
    return {"id":current_user.id,"name":current_user.name,"email":current_user.email}

if __name__=="__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)