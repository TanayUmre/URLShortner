from pydantic import BaseModel,HttpUrl
from datetime import datetime

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
    id:int
    url:str
    storened_url:str
    user_id:int
    created_at:datetime
    clicked_count:int
    model_config={
        "from-attributes":True
    }

class ShortenResponse(BaseModel):
    url: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str