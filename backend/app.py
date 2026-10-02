import uvicorn
from fastapi import FastAPI,Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import Base,engine
from schemas import URLCreate,URLResponse,UserCreate,UserLogin,ShortenResponse
from crud import add_url,add_user,get_user,get_user_urls,delete_url,get_url_by_short_code
from auth import create_access_token,get_current_user
from models import User
from fastapi.responses import RedirectResponse

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

@app.post("/shorten",response_model=ShortenResponse)
def shorten_url(request:URLCreate,current_user:User=Depends(get_current_user)):
    shortened_url=add_url(current_user.id,str(request.url))
    return ShortenResponse(url=shortened_url)

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

@app.get("/urls")
def get_urls(current_user:User=Depends(get_current_user)):
    return get_user_urls(current_user.id)

@app.delete("/urls/{url_id}")
def delete_user_url(url_id:int,current_user:User=Depends(get_current_user)):
    deleted=delete_url(url_id,current_user.id)
    if not deleted:
        return {"message":"URL not found or unauthorized"}
    return {"message":"URL deleted Successfully"}

@app.get("/{short_code}")
def redirect_code(short_code:str):
    org_url=get_url_by_short_code(short_code)
    if not org_url:
        raise HTTPException(status_code=404,detail="Short URL not found")
    if org_url=="Shortened URL has expired":
        raise HTTPException(status_code=410,detail="Shortened URL has expired")
    return RedirectResponse(url=org_url)

if __name__=="__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)