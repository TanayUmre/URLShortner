from pydantic import BaseModel,HttpUrl

class UserCreate(BaseModel):
    name:str
    email:str
    password:str

class UserLogin(BaseModel):
    email:str
    password:str

class URLCreate(BaseModel):
    url:HttpUrl

class URLResponse(BaseModel):
    url: str